export interface ActivityLog {
  id: string; // uuid
  action: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export type CreateActivityLogDTO = Omit<ActivityLog, 'id' | 'created_at'>;
