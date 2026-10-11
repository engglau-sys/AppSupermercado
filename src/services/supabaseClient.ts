import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Sanitiza a URL do Supabase, removendo caminhos específicos de REST como '/rest/v1/'
 * caso tenham sido incluídos no ficheiro .env.
 */
function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
export const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'sua-url-aqui'
  );
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  };
};

/**
 * Instância oficial do cliente Supabase para toda a aplicação.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: false,
    },
  }
);
