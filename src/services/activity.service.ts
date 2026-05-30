'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getAllActivities() {
  try {
    const supabase = createAdminClient();
    
    // 1. Get recent uploads from salary_records
    const { data: salaryData, error: salaryError } = await supabase
      .from('salary_records')
      .select('month, year, created_at');
      
    if (salaryError) throw salaryError;
    
    const uploadsMap = new Map<string, { count: number, firstUpload: string }>();
    if (salaryData) {
      salaryData.forEach(record => {
        const key = `${record.month}-${record.year}`;
        if (!uploadsMap.has(key)) {
          uploadsMap.set(key, { count: 1, firstUpload: record.created_at });
        } else {
          const entry = uploadsMap.get(key)!;
          entry.count += 1;
          if (new Date(record.created_at) < new Date(entry.firstUpload)) {
            entry.firstUpload = record.created_at;
          }
        }
      });
    }
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const activities: any[] = [];
    
    uploadsMap.forEach((value, key) => {
      const [month, year] = key.split('-').map(Number);
      activities.push({
        id: `upload-${key}`,
        title: 'Payroll Data Uploaded',
        desc: `Payroll uploaded for ${monthNames[month - 1]} ${year} (${value.count} records)`,
        time: value.firstUpload,
        type: 'success'
      });
    });

    // 2. Get Emails Dispatched
    const { data: emailData, error: emailError } = await supabase
      .from('email_logs')
      .select('status, sent_at');
    
    if (!emailError && emailData) {
       const emailMap = new Map<string, { sent: number, failed: number, date: string }>();
       emailData.forEach(log => {
         const d = new Date(log.sent_at || new Date());
         const dayKey = d.toISOString().split('T')[0];
         if (!emailMap.has(dayKey)) {
           emailMap.set(dayKey, { sent: 0, failed: 0, date: log.sent_at || new Date().toISOString() });
         }
         const entry = emailMap.get(dayKey)!;
         if (log.status === 'sent') entry.sent++;
         if (log.status === 'failed') entry.failed++;
       });
       
       emailMap.forEach((value, key) => {
         if (value.sent > 0) {
           activities.push({
             id: `email-sent-${key}`,
             title: 'Emails Dispatched',
             desc: `Successfully sent ${value.sent} salary slip emails`,
             time: value.date,
             type: 'info'
           });
         }
         if (value.failed > 0) {
           activities.push({
             id: `email-failed-${key}`,
             title: 'Email Delivery Failed',
             desc: `Failed to deliver ${value.failed} salary slip emails`,
             time: value.date,
             type: 'error'
           });
         }
       });
    }

    if (activities.length === 0) {
      activities.push({
        id: 'init',
        title: 'System initialized',
        desc: 'Ready for first payroll upload',
        time: new Date().toISOString(),
        type: 'success'
      });
    }
    
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    return { success: true, data: activities };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
