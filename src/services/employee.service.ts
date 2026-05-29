'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { EmployeeData } from '@/lib/schemas/employee.schema';

export async function saveEmployeesBatch(employees: EmployeeData[]) {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('employees')
      .insert(employees)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === '23505') {
        return { success: false, error: "One or more Employee IDs or Emails already exist in the database." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Save employees error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
