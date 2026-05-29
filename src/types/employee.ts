export interface Employee {
  id: string; // uuid
  employee_id: string;
  name: string;
  email: string;
  designation?: string;
  dob?: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export type CreateEmployeeDTO = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
