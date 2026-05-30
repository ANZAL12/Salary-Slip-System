require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('email_logs').select('*');
  console.log('Data:', data);
  console.log('Error:', error);

  // Let's also check if we can insert a dummy log
  const res = await supabase.from('email_logs').insert({
    email: 'test@example.com',
    status: 'sent'
  });
  console.log('Insert res:', res);
}
run();
