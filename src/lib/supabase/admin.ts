import { createClient } from '@supabase/supabase-js';

// The admin client uses the SERVICE_ROLE_KEY to bypass Row-Level Security (RLS)
// Use this ONLY in server environments for administrative tasks.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};
