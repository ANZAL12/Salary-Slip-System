import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  const result = await supabase.from('email_logs').select('*');
  return NextResponse.json(result);
}
