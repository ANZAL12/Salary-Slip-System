'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface EnrichedSalarySlip {
  id: string;
  month: number;
  year: number;
  net_salary: number;
  base_salary: number;
  hra: number;
  allowances: number;
  deductions: number;
  employee_id: string;      // The UUID
  employee_code: string;    // EMP001
  employee_name: string;
  designation: string;
  email: string;
  pdf_status: 'Generated' | 'Pending' | 'Failed';
  pdf_url: string | null;
  generated_date: string | null;
  email_status: 'Sent' | 'Pending' | 'Failed';
  email_sent_at: string | null;
}

export interface SalarySlipStats {
  total: number;
  generatedThisMonth: number;
  pendingGeneration: number;
  emailReady: number;
}

export async function getSalarySlips(): Promise<{ data: EnrichedSalarySlip[], stats: SalarySlipStats, error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Perform a large join to get all required data
    const { data: rawData, error } = await supabase
      .from('salary_records')
      .select(`
        id,
        month,
        year,
        net_salary,
        base_salary,
        hra,
        allowances,
        deductions,
        employees (
          id,
          employee_id,
          name,
          designation,
          email
        ),
        generated_pdfs (
          pdf_url,
          generated_at
        ),
        email_logs (
          status,
          sent_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch Error:", error);
      throw error;
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let stats: SalarySlipStats = {
      total: rawData?.length || 0,
      generatedThisMonth: 0,
      pendingGeneration: 0,
      emailReady: 0
    };

    const enrichedData: EnrichedSalarySlip[] = (rawData || []).map((row: any) => {
      // Map relations
      const emp = Array.isArray(row.employees) ? row.employees[0] : row.employees;
      const pdfs = Array.isArray(row.generated_pdfs) ? row.generated_pdfs : (row.generated_pdfs ? [row.generated_pdfs] : []);
      const emails = Array.isArray(row.email_logs) ? row.email_logs : (row.email_logs ? [row.email_logs] : []);

      const latestPdf = pdfs.length > 0 ? pdfs[0] : null;
      const latestEmail = emails.length > 0 ? emails[0] : null;

      const pdf_status = latestPdf ? 'Generated' : 'Pending';
      const email_status = latestEmail ? (latestEmail.status === 'sent' ? 'Sent' : latestEmail.status === 'failed' ? 'Failed' : 'Pending') : 'Pending';

      // Update KPIs
      if (pdf_status === 'Pending') stats.pendingGeneration++;
      if (pdf_status === 'Generated' && row.month === currentMonth && row.year === currentYear) {
        stats.generatedThisMonth++;
      }
      if (pdf_status === 'Generated' && email_status !== 'Sent') {
        stats.emailReady++;
      }

      return {
        id: row.id,
        month: row.month,
        year: row.year,
        net_salary: Number(row.net_salary),
        base_salary: Number(row.base_salary),
        hra: Number(row.hra),
        allowances: Number(row.allowances),
        deductions: Number(row.deductions),
        employee_id: emp?.id || '',
        employee_code: emp?.employee_id || '-',
        employee_name: emp?.name || 'Unknown',
        designation: emp?.designation || '-',
        email: emp?.email || '',
        pdf_status,
        pdf_url: latestPdf?.pdf_url || null,
        generated_date: latestPdf?.generated_at || null,
        email_status,
        email_sent_at: latestEmail?.sent_at || null
      };
    });

    return { data: enrichedData, stats };

  } catch (err: any) {
    console.error("Salary slips fetch error:", err);
    return { data: [], stats: { total: 0, generatedThisMonth: 0, pendingGeneration: 0, emailReady: 0 }, error: err.message };
  }
}

// Placeholder for generation (Client-side PDF logic is usually cleaner for UI blocks, but we can do server-side too)
export async function saveGeneratedPdfMetadata(salaryRecordId: string, employeeId: string, pdfUrl: string, fileName: string) {
  const supabase = createAdminClient();
  
  // Clean up any old PDFs for this record
  await supabase.from('generated_pdfs').delete().eq('salary_record_id', salaryRecordId);
  
  const { data, error } = await supabase
    .from('generated_pdfs')
    .insert({
      salary_record_id: salaryRecordId,
      employee_id: employeeId,
      pdf_url: pdfUrl,
      file_name: fileName
    });
    
  return { success: !error, error };
}

export async function sendEmailSimulation(salaryRecordId: string, employeeId: string, email: string) {
  const supabase = createAdminClient();
  
  // Delete old pending logs
  await supabase.from('email_logs').delete().eq('salary_record_id', salaryRecordId);
  
  // Insert a success log
  const { error } = await supabase
    .from('email_logs')
    .insert({
      salary_record_id: salaryRecordId,
      employee_id: employeeId,
      email: email,
      status: 'sent',
      sent_at: new Date().toISOString()
    });
    
  return { success: !error, error };
}

export async function uploadPdfToStorage(fileName: string, base64Data: string) {
  try {
    const supabase = createAdminClient();
    const buffer = Buffer.from(base64Data, 'base64');
    
    const { data, error } = await supabase.storage
      .from('salary-slips')
      .upload(fileName, buffer, { 
        upsert: true,
        contentType: 'application/pdf'
      });
      
    if (error) {
      console.error("Admin upload error:", error);
      return { success: false, error: error.message };
    }
    
    const { data: publicUrlData } = supabase.storage.from('salary-slips').getPublicUrl(fileName);
    
    return { success: true, publicUrl: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function bulkGeneratePendingSlips() {
  const supabase = createAdminClient();
  
  // 1. Fetch all pending records (no generated_pdfs yet)
  const { data: rawData, error } = await supabase
    .from('salary_records')
    .select(`
      id, month, year, net_salary, base_salary, hra, allowances, deductions,
      employees!inner (id, employee_id, name, designation, email),
      generated_pdfs (id)
    `);

  if (error || !rawData) {
    return { success: false, error: error?.message || 'Failed to fetch records' };
  }

  // Filter out those that already have a PDF
  const pendingRecords = rawData.filter(r => !r.generated_pdfs || (Array.isArray(r.generated_pdfs) && r.generated_pdfs.length === 0));
  
  if (pendingRecords.length === 0) {
    return { success: true, count: 0 };
  }

  // Import locally to avoid top-level issues if any
  const { generatePdfBuffer } = await import('@/lib/pdf-generator');
  
  let successCount = 0;

  for (const record of pendingRecords) {
    try {
      const emp = Array.isArray(record.employees) ? record.employees[0] : record.employees;
      
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

      const pdfBuffer = await generatePdfBuffer(enrichedRecord);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[record.month - 1] || String(record.month);
      const fileName = `SalarySlip_${emp.employee_id}_${monthName}_${record.year}.pdf`;

      // Upload to storage
      let publicUrl = '';
      const { error: uploadError } = await supabase.storage
        .from('salary-slips')
        .upload(fileName, pdfBuffer, { upsert: true, contentType: 'application/pdf' });
        
      if (!uploadError) {
        const { data } = supabase.storage.from('salary-slips').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      // Save to database
      await supabase.from('generated_pdfs').insert({
        salary_record_id: record.id,
        employee_id: emp.id,
        pdf_url: publicUrl || 'local_buffer',
        file_name: fileName
      });
      
      successCount++;
    } catch (e) {
      console.error("Bulk generate error for record", record.id, e);
    }
  }

  return { success: true, count: successCount };
}

export async function getPendingSlipsToGenerate() {
  const supabase = createAdminClient();
  const { data: rawData, error } = await supabase
    .from('salary_records')
    .select('id, generated_pdfs (id)');

  if (error || !rawData) {
    return { success: false, data: [] };
  }

  const pending = rawData.filter(r => !r.generated_pdfs || (Array.isArray(r.generated_pdfs) && r.generated_pdfs.length === 0));
  return { success: true, data: pending.map(p => p.id) };
}

export async function generateAndSaveSingleSlip(recordId: string) {
  const supabase = createAdminClient();
  const { data: record, error } = await supabase
    .from('salary_records')
    .select(`
      id, month, year, net_salary, base_salary, hra, allowances, deductions,
      employees!inner (id, employee_id, name, designation, email)
    `)
    .eq('id', recordId)
    .single();

  if (error || !record) return { success: false, error: 'Failed to fetch record' };

  const { generatePdfBuffer } = await import('@/lib/pdf-generator');
  const emp = Array.isArray(record.employees) ? record.employees[0] : record.employees;
  
  const enrichedRecord: EnrichedSalarySlip = {
    id: record.id, month: record.month, year: record.year, net_salary: Number(record.net_salary),
    base_salary: Number(record.base_salary), hra: Number(record.hra), allowances: Number(record.allowances),
    deductions: Number(record.deductions), employee_id: emp.id, employee_code: emp.employee_id,
    employee_name: emp.name, designation: emp.designation, email: emp.email, pdf_status: 'Generated',
    pdf_url: null, generated_date: new Date().toISOString(), email_status: 'Pending', email_sent_at: null
  };

  const pdfBuffer = await generatePdfBuffer(enrichedRecord);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[record.month - 1] || String(record.month);
  const fileName = `SalarySlip_${emp.employee_id}_${monthName}_${record.year}.pdf`;

  let publicUrl = '';
  const { error: uploadError } = await supabase.storage
    .from('salary-slips')
    .upload(fileName, pdfBuffer, { upsert: true, contentType: 'application/pdf' });
    
  if (!uploadError) {
    const { data } = supabase.storage.from('salary-slips').getPublicUrl(fileName);
    publicUrl = data.publicUrl;
  }

  await supabase.from('generated_pdfs').insert({
    salary_record_id: record.id,
    employee_id: emp.id,
    pdf_url: publicUrl || 'local_buffer',
    file_name: fileName
  });

  return { success: true };
}
