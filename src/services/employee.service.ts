'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { EmployeeData, EmployeeRecord } from '@/lib/schemas/employee.schema';

export type EmployeeStats = {
  total: number;
  active: number;
  inactive: number;
};

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

export async function getEmployees() {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch employees error:", error);
      return { success: false, data: [], stats: { total: 0, active: 0, inactive: 0 }, error: error.message };
    }

    const employees = data as EmployeeRecord[];
    
    // Calculate Stats
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = employees.filter(e => e.status === 'Inactive').length;
    
    return { 
      success: true, 
      data: employees,
      stats: { total, active, inactive }
    };

  } catch (err: any) {
    console.error("Get employees error:", err);
    return { success: false, data: [], stats: { total: 0, active: 0, inactive: 0 }, error: err.message };
  }
}

export async function createEmployee(data: Partial<EmployeeData>) {
  try {
    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from('employees')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Create employee error:", error);
      if (error.code === '23505') {
        return { success: false, error: "Employee ID or Email already exists." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error("Create employee error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateEmployee(id: string, data: Partial<EmployeeData>) {
  try {
    const supabase = createAdminClient();
    
    const { data: result, error } = await supabase
      .from('employees')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update employee error:", error);
      if (error.code === '23505') {
        return { success: false, error: "Employee ID or Email already exists." };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error("Update employee error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete employee error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Delete employee error:", err);
    return { success: false, error: err.message };
  }
}
