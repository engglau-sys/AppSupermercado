/**
 * Cliente Supabase preparado para o futuro.
 * Quando quiseres ligar ao Supabase na versão V2, basta definir as variáveis:
 * VITE_SUPABASE_URL=https://exemplo.supabase.co
 * VITE_SUPABASE_ANON_KEY=tua-chave-anon
 */

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url !== 'sua-url-aqui');
};

export const getSupabaseConfig = () => {
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
};
