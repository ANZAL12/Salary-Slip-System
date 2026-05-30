'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTemplates() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data as EmailTemplate[] };
}

export async function getTemplateById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as EmailTemplate };
}

export async function createTemplate(templateData: Partial<EmailTemplate>) {
  const supabase = createAdminClient();
  
  if (templateData.is_default) {
    // Unset others first if this is going to be default
    await supabase.from('email_templates').update({ is_default: false }).eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('email_templates')
    .insert(templateData)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as EmailTemplate };
}

export async function updateTemplate(id: string, templateData: Partial<EmailTemplate>) {
  const supabase = createAdminClient();

  if (templateData.is_default) {
    // Unset others first if this is going to be default
    await supabase.from('email_templates').update({ is_default: false }).eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('email_templates')
    .update({ ...templateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as EmailTemplate };
}

export async function deleteTemplate(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function setDefaultTemplate(id: string) {
  const supabase = createAdminClient();
  // Clear existing defaults
  await supabase.from('email_templates').update({ is_default: false }).eq('is_default', true);
  
  // Set new default
  const { data, error } = await supabase
    .from('email_templates')
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as EmailTemplate };
}
