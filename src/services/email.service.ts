'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { transporter } from '@/lib/email/transporter';
import { getSalarySlipTemplate } from '@/lib/email/templates/salary-slip-template';
import { generatePdfBuffer } from '@/lib/pdf-generator';
import { EnrichedSalarySlip } from './salary-slip.service';

const getMonthName = (m: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[m - 1] || String(m);
};

export async function sendSalarySlipEmail(salaryRecordId: string, employeeId: string) {
  const supabase = createAdminClient();
  let empId = employeeId;
  let empEmail = 'unknown';

  try {
    // 1. Fetch Salary Record and Employee Data
    const { data: record, error: fetchError } = await supabase
      .from('salary_records')
      .select(`
        id, month, year, net_salary, base_salary, hra, allowances, deductions,
        employees!inner (id, employee_id, name, designation, email)
      `)
      .eq('id', salaryRecordId)
      .single();

    if (fetchError || !record) {
      throw new Error(fetchError?.message || 'Record not found');
    }

    const emp = Array.isArray(record.employees) ? record.employees[0] : record.employees;
    
    if (!emp?.email) {
      throw new Error('Employee email is missing');
    }

    empId = emp.id;
    empEmail = emp.email;

    const enrichedRecord: EnrichedSalarySlip = {
      id: record.id,
      month: record.month,
      year: record.year,
      net_salary: Number(record.net_salary),
      base_salary: Number(record.base_salary),
      hra: Number(record.hra),
      allowances: Number(record.allowances),
      deductions: Number(record.deductions),
      employee_id: emp.id,
      employee_code: emp.employee_id,
      employee_name: emp.name,
      designation: emp.designation,
      email: emp.email,
      pdf_status: 'Generated',
      pdf_url: null,
      generated_date: new Date().toISOString(),
      email_status: 'Pending',
      email_sent_at: null
    };

    // 2. Generate PDF Buffer
    const pdfBuffer = await generatePdfBuffer(enrichedRecord);
    const monthName = getMonthName(record.month);
    const fileName = `SalarySlip_${emp.employee_id}_${monthName}_${record.year}.pdf`;

    // 3. Attempt Supabase Storage Upload (Optional/Fail-safe)
    let publicUrl = null;
    try {
      const { error: uploadError } = await supabase.storage
        .from('salary-slips')
        .upload(fileName, pdfBuffer, { upsert: true, contentType: 'application/pdf' });
      
      if (!uploadError) {
        const { data } = supabase.storage.from('salary-slips').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }
    } catch (e) {
      console.warn("Could not upload to bucket, attaching via buffer instead.", e);
    }

    // 4. Fetch Default Email Template
    let subject = `Salary Slip - ${monthName} ${record.year}`;
    let htmlContent = getSalarySlipTemplate(emp.name, monthName, String(record.year), emp.employee_id);

    try {
      const { data: defaultTemplates, error: fetchError } = await supabase
        .from('email_templates')
        .select('subject, body_html')
        .eq('is_default', true)
        .limit(1);

      if (fetchError) {
        console.warn("Error fetching default template", fetchError);
      }

      const defaultTemplate = defaultTemplates?.[0];

      if (defaultTemplate) {
        const placeholders: Record<string, string> = {
          '{{employee_name}}': emp.name,
          '{{employee_id}}': emp.employee_id,
          '{{designation}}': emp.designation || 'Employee',
          '{{month}}': monthName,
          '{{year}}': String(record.year),
          '{{net_salary}}': Number(record.net_salary).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
          '{{company_name}}': 'Nippon Toyota',
          '{{department}}': 'Operations'
        };

        let dynamicSubject = defaultTemplate.subject;
        let dynamicHtml = defaultTemplate.body_html;
        Object.keys(placeholders).forEach(key => {
          const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
          dynamicSubject = dynamicSubject.replace(regex, placeholders[key]);
          dynamicHtml = dynamicHtml.replace(regex, placeholders[key]);
        });

        subject = dynamicSubject;
        htmlContent = dynamicHtml;
      }
    } catch (err) {
      console.warn("Could not load default template, falling back to static", err);
    }

    // 5. Send Email via Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Toyota HR" <hr@toyota.com>',
      to: emp.email,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer, // Using local buffer fallback as requested!
          contentType: 'application/pdf'
        }
      ]
    });

    // 6. Update email_logs (Success)
    await supabase.from('email_logs').delete().eq('salary_record_id', salaryRecordId);
    await supabase.from('email_logs').insert({
      salary_record_id: salaryRecordId,
      employee_id: emp.id,
      email: emp.email,
      status: 'sent',
      sent_at: new Date().toISOString(),
      error_message: null
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    
    // Attempt to log failure
    try {
      await supabase.from('email_logs').delete().eq('salary_record_id', salaryRecordId);
      await supabase.from('email_logs').insert({
        salary_record_id: salaryRecordId,
        employee_id: empId || null,
        email: empEmail,
        status: 'failed',
        error_message: error.message || 'Unknown error occurred'
      });
    } catch (e) {}

    return { success: false, error: error.message };
  }
}

export async function sendBulkSalarySlipEmails(recordIds: string[]) {
  let successCount = 0;
  let failCount = 0;

  for (const id of recordIds) {
    // We only have the recordId here, so we extract the employeeId inside sendSalarySlipEmail if needed, 
    // or we fetch it first. Let's just pass empty employeeId, as it fetches it inside.
    const result = await sendSalarySlipEmail(id, '');
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  return { success: true, successCount, failCount };
}

export async function retryFailedEmail(logId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('email_logs').select('salary_record_id, employee_id').eq('id', logId).single();
  if (error || !data) return { success: false, error: 'Log not found' };
  
  return await sendSalarySlipEmail(data.salary_record_id, data.employee_id);
}

export async function getEmailLogs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('email_logs')
    .select(`
      id, status, error_message, sent_at, email,
      employees ( employee_id, name )
    `)
    .order('sent_at', { ascending: false, nullsFirst: false });

  if (error) return { data: [], error: error.message };
  
  return { data };
}
