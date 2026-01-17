import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('[Supabase] KEY existe:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Tipos do banco de dados
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  free_credits_used: number;
  free_credits_limit: number;
  created_at: string;
}

export interface Restoration {
  id: string;
  user_id: string;
  credit_code_id: string | null;
  used_free_credit: boolean;
  restoration_type: string;
  created_at: string;
}

export interface CreditCodeDB {
  id: string;
  code: string;
  email: string;
  user_id: string | null;
  credits_total: number;
  credits_used: number;
  package_name: string;
  expires_at: string;
  created_at: string;
  is_active: boolean;
}
