import { supabase } from '@/lib/supabase/client';
import type { ActivityLog, CreateActivityLogDTO } from '@/types/activity';

export const ActivityService = {
  /**
   * Fetch all activity logs (recent first)
   */
  async getRecentActivities(limit: number = 50): Promise<ActivityLog[]> {
    // TODO: Implement fetch from Supabase
    return [];
  },

  /**
   * Log a new activity
   */
  async logActivity(data: CreateActivityLogDTO): Promise<ActivityLog | null> {
    // TODO: Implement insert into Supabase
    return null;
  }
};
