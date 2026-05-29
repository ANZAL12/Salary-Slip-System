'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { RawSalaryData } from '@/lib/schemas/salary.schema';

export type ValidatedSalaryRecord = RawSalaryData & {
  employee_uuid?: string;
  employee_name?: string;
  net_salary: number;
  month_int: number;
  status: 'Valid' | 'Invalid' | 'Duplicate';
  errors: string[];
};

const monthMap: Record<string, number> = {
  'january': 1, 'jan': 1, '01': 1, '1': 1,
  'february': 2, 'feb': 2, '02': 2, '2': 2,
  'march': 3, 'mar': 3, '03': 3, '3': 3,
  'april': 4, 'apr': 4, '04': 4, '4': 4,
  'may': 5, '05': 5, '5': 5,
  'june': 6, 'jun': 6, '06': 6, '6': 6,
  'july': 7, 'jul': 7, '07': 7, '7': 7,
  'august': 8, 'aug': 8, '08': 8, '8': 8,
  'september': 9, 'sep': 9, '09': 9, '9': 9,
  'october': 10, 'oct': 10, '10': 10,
  'november': 11, 'nov': 11, '11': 11,
  'december': 12, 'dec': 12, '12': 12
};

export async function validateSalaryData(rawRecords: RawSalaryData[]): Promise<ValidatedSalaryRecord[]> {
  try {
    const supabase = createAdminClient();
    
    // Extract unique employee IDs from the file
    const uniqueEmployeeIds = Array.from(new Set(rawRecords.map(r => r.employee_id.trim())));
    
    // Fetch employee data from DB
    const { data: dbEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, employee_id, name')
      .in('employee_id', uniqueEmployeeIds);
      
    if (empError) throw empError;
    
    // Create map of employee_id -> { id, name }
    const employeeMap = new Map<string, { id: string, name: string }>();
    dbEmployees?.forEach(e => {
      employeeMap.set(e.employee_id, { id: e.id, name: e.name });
    });

    // We also need to check for existing records for duplicate detection.
    // For large uploads, we might just query all records for these employees for the given year/months.
    const years = Array.from(new Set(rawRecords.map(r => r.year)));
    const employeeUuids = dbEmployees?.map(e => e.id) || [];
    
    let existingRecordsMap = new Set<string>();
    if (employeeUuids.length > 0 && years.length > 0) {
      const { data: existingSalaries, error: salError } = await supabase
        .from('salary_records')
        .select('employee_id, month, year')
        .in('employee_id', employeeUuids)
        .in('year', years);
        
      if (!salError && existingSalaries) {
        existingSalaries.forEach(r => {
          existingRecordsMap.add(`${r.employee_id}-${r.month}-${r.year}`);
        });
      }
    }

    const validatedData: ValidatedSalaryRecord[] = rawRecords.map(record => {
      let status: 'Valid' | 'Invalid' | 'Duplicate' = 'Valid';
      let errors: string[] = [];

      const empIdStr = record.employee_id.trim();
      const dbEmp = employeeMap.get(empIdStr);
      
      if (!dbEmp) {
        status = 'Invalid';
        errors.push(`Employee ID '${empIdStr}' not found in system`);
      }

      const monthStr = String(record.month).toLowerCase().trim();
      const monthInt = monthMap[monthStr];
      if (!monthInt) {
        status = 'Invalid';
        errors.push(`Invalid month: ${record.month}`);
      }

      const netSalary = (record.base_salary + record.hra + record.allowances) - record.deductions;

      // Check DB duplicates
      if (dbEmp && monthInt) {
        const uniqueKey = `${dbEmp.id}-${monthInt}-${record.year}`;
        if (existingRecordsMap.has(uniqueKey)) {
          status = 'Duplicate';
          errors.push(`Record already exists for ${monthStr} ${record.year}`);
        }
      }

      return {
        ...record,
        employee_uuid: dbEmp?.id,
        employee_name: dbEmp?.name || '-',
        month_int: monthInt || 0,
        net_salary: netSalary,
        status,
        errors
      };
    });

    return validatedData;
  } catch (error) {
    console.error("Error validating salary data:", error);
    throw new Error("Failed to validate data against database");
  }
}

export async function saveSalaryRecordsBatch(records: Omit<ValidatedSalaryRecord, 'status' | 'errors' | 'employee_name'>[]) {
  try {
    const supabase = createAdminClient();
    
    const insertPayload = records.map(r => ({
      employee_id: r.employee_uuid,
      month: r.month_int,
      year: r.year,
      base_salary: r.base_salary,
      hra: r.hra,
      allowances: r.allowances,
      deductions: r.deductions,
      net_salary: r.net_salary
    }));

    const { data, error } = await supabase
      .from('salary_records')
      .insert(insertPayload)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === '23505') {
        return { success: false, error: "One or more duplicate records encountered during save." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Save salaries error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
