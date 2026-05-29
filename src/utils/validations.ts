import { z } from 'zod';

export const EmployeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  designation: z.string().optional(),
  dob: z.string().optional(), // YYYY-MM-DD
});

export const SalaryRecordSchema = z.object({
  employee_id: z.string().uuid("Valid Employee ID (UUID) is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  base_salary: z.number().min(0),
  hra: z.number().min(0),
  allowances: z.number().min(0),
  deductions: z.number().min(0),
  net_salary: z.number().min(0),
});

export const EmailSendingSchema = z.object({
  employee_id: z.string().uuid("Valid Employee ID (UUID) is required"),
  salary_record_id: z.string().uuid().optional(),
  email: z.string().email("Invalid email address"),
  status: z.enum(['pending', 'sent', 'failed']).optional(),
  error_message: z.string().optional(),
  sent_at: z.string().optional(),
});
