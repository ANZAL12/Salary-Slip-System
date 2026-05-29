export interface SalaryRecord {
  id: string; // uuid
  employee_id: string; // uuid
  month: number;
  year: number;
  base_salary: number;
  hra: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  created_at: string;
}

export type CreateSalaryRecordDTO = Omit<SalaryRecord, 'id' | 'created_at'>;
