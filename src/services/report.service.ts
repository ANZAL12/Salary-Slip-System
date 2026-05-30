'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function getDashboardKPIs() {
  const supabase = createAdminClient();
  
  // Total Employees
  const { count: totalEmployees } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true });
    
  // Salary Slips Generated
  const { count: slipsGenerated } = await supabase
    .from('generated_pdfs')
    .select('*', { count: 'exact', head: true });
    
  // Fetch all salary records to compute averages and totals
  // In a real prod environment with millions of rows, use SQL aggregation (RPC)
  const { data: records } = await supabase
    .from('salary_records')
    .select('net_salary, month, year');
    
  const totalPayroll = records?.reduce((sum, r) => sum + Number(r.net_salary), 0) || 0;
  const avgNetSalary = records && records.length > 0 ? totalPayroll / records.length : 0;

  // Mocking "vs last month" metrics since we don't have historical months strictly defined in this small dataset
  return {
    totalPayroll,
    totalEmployees: totalEmployees || 0,
    avgNetSalary,
    slipsGenerated: slipsGenerated || 0,
    trends: {
      payroll: '+8.42%',
      employees: '+5.79%',
      avgSalary: '+3.28%',
      slips: '+100%'
    }
  };
}

export async function getPayrollTrend() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('salary_records')
    .select('month, year, net_salary');
    
  if (!data) return [];

  // Group by "Month Year"
  const grouped: Record<string, number> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  data.forEach(r => {
    const key = `${months[r.month - 1]} ${r.year}`;
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += Number(r.net_salary);
  });

  // Convert to array and sort (mock sorting by assumption of recent 6 months)
  return Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  }));
}



export async function getSalaryDistribution() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('salary_records').select('net_salary');
  
  const buckets = {
    '0 - 25K': 0,
    '25K - 40K': 0,
    '40K - 60K': 0,
    '60K - 80K': 0,
    '80K - 1L': 0,
    '1L+': 0
  };

  if (data) {
    data.forEach(r => {
      const s = Number(r.net_salary);
      if (s < 25000) buckets['0 - 25K']++;
      else if (s < 40000) buckets['25K - 40K']++;
      else if (s < 60000) buckets['40K - 60K']++;
      else if (s < 80000) buckets['60K - 80K']++;
      else if (s < 100000) buckets['80K - 1L']++;
      else buckets['1L+']++;
    });
  }

  return Object.keys(buckets).map(key => ({
    name: key,
    count: buckets[key as keyof typeof buckets]
  }));
}

export async function getTopEmployees() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('salary_records')
    .select(`
      net_salary,
      employees ( employee_id, name, designation )
    `)
    .order('net_salary', { ascending: false })
    .limit(5);

  if (!data) return [];

  return data.map(r => {
    const emp = Array.isArray(r.employees) ? r.employees[0] : r.employees;
    
    // Map designation to department
    let dept = 'Others';
    const desig = emp?.designation?.toLowerCase() || '';
    if (desig.includes('engineer') || desig.includes('tech')) dept = 'Engineering';
    else if (desig.includes('operations')) dept = 'Operations';
    else if (desig.includes('sales') || desig.includes('market')) dept = 'Sales & Marketing';
    else if (desig.includes('finance')) dept = 'Finance';

    return {
      id: emp?.employee_id,
      name: emp?.name,
      department: dept,
      netSalary: Number(r.net_salary)
    };
  });
}

export async function getPayrollSummary() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('salary_records')
    .select('base_salary, hra, allowances, deductions, net_salary');
    
  let base = 0, hra = 0, allowances = 0, deductions = 0, net = 0;

  if (data) {
    data.forEach(r => {
      base += Number(r.base_salary);
      hra += Number(r.hra);
      allowances += Number(r.allowances);
      deductions += Number(r.deductions);
      net += Number(r.net_salary);
    });
  }

  const gross = base + hra + allowances; // This is a rough estimation of Gross
  
  return [
    { component: 'Basic Salary', amount: base, percentage: gross ? (base / gross) * 100 : 0 },
    { component: 'HRA', amount: hra, percentage: gross ? (hra / gross) * 100 : 0 },
    { component: 'Allowances', amount: allowances, percentage: gross ? (allowances / gross) * 100 : 0 },
    { component: 'Deductions', amount: deductions, percentage: gross ? (deductions / gross) * 100 : 0 },
    { component: 'Net Salary', amount: net, percentage: 100, isTotal: true }
  ];
}
