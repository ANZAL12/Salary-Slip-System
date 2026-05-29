import { z } from 'zod';

export const employeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  designation: z.string().min(1, "Designation is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  status: z.enum(['Active', 'Inactive', 'On Leave'])
});

export type EmployeeData = z.infer<typeof employeeSchema>;

// Extended type for DB responses
export type EmployeeRecord = EmployeeData & {
  id: string;
  created_at: string;
  updated_at: string;
};
