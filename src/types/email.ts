export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface EmailLog {
  id: string; // uuid
  employee_id: string; // uuid
  salary_record_id?: string; // uuid
  email: string;
  status: EmailStatus;
  error_message?: string;
  sent_at?: string;
}

export type CreateEmailLogDTO = Omit<EmailLog, 'id'>;
