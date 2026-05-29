import { z } from 'zod';

export const salarySchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  base_salary: z.coerce.number().min(1, "Base Salary must be > 0"),
  hra: z.coerce.number().min(0, "HRA must be positive"),
  allowances: z.coerce.number().min(0, "Allowances must be positive"),
  deductions: z.coerce.number().min(0, "Deductions must be positive"),
  month: z.string().min(1, "Month is required"),
  year: z.coerce.number().min(2000, "Valid Year is required"),
}).superRefine((data, ctx) => {
  const earnings = data.base_salary + data.hra + data.allowances;
  if (data.deductions > earnings) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Deductions cannot exceed earnings",
      path: ["deductions"]
    });
  }
});

export type RawSalaryData = z.infer<typeof salarySchema>;

export type SalaryRecordDB = {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  hra: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  created_at: string;
  employees: {
    employee_id: string;
  };
};
