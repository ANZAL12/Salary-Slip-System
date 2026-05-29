import { supabase } from '@/lib/supabase/client';
import type { EmailLog, CreateEmailLogDTO } from '@/types/email';

export const EmailService = {
  /**
   * Fetch all email logs
   */
  async getAllLogs(): Promise<EmailLog[]> {
    // TODO: Implement fetch all logs from Supabase
    return [];
  },

  /**
   * Log an email attempt
   */
  async logEmail(data: CreateEmailLogDTO): Promise<EmailLog | null> {
    // TODO: Implement insert into Supabase
    return null;
  },

  /**
   * Update an email status (e.g. pending -> sent/failed)
   */
  async updateEmailStatus(id: string, status: EmailLog['status'], errorMessage?: string): Promise<EmailLog | null> {
    // TODO: Implement status update in Supabase
    return null;
  }
};
