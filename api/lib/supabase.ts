import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Gerar código único
export function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FOTO-${segment(4)}-${segment(4)}`;
}

// Criar código no banco
export async function createCreditCode(data: {
  email: string;
  credits: number;
  packageName: string;
  paymentId: string;
}) {
  const code = generateCode();
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Expira em 1 ano

  const { data: result, error } = await supabase
    .from('credit_codes')
    .insert({
      code,
      email: data.email.toLowerCase().trim(),
      credits_total: data.credits,
      credits_used: 0,
      package_name: data.packageName,
      payment_id: data.paymentId,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar código:', error);
    throw error;
  }

  return result;
}

// Validar código
export async function validateCode(code: string) {
  const { data, error } = await supabase
    .from('credit_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Código não encontrado' };
  }

  if (new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Código expirado' };
  }

  if (data.credits_used >= data.credits_total) {
    return { valid: false, error: 'Créditos esgotados' };
  }

  return {
    valid: true,
    code: data.code,
    creditsRemaining: data.credits_total - data.credits_used,
    creditsTotal: data.credits_total,
    creditsUsed: data.credits_used,
    packageName: data.package_name,
    email: data.email,
  };
}

// Usar crédito
export async function useCredit(code: string) {
  const validation = await validateCode(code);
  if (!validation.valid || !validation.creditsRemaining) {
    return { success: false, error: validation.error || 'Código inválido' };
  }

  // Atualizar créditos usados
  const { error } = await supabase
    .from('credit_codes')
    .update({ credits_used: (validation.creditsUsed || 0) + 1 })
    .eq('code', code.toUpperCase().trim());

  if (error) {
    return { success: false, error: 'Erro ao usar crédito' };
  }

  // Registrar uso
  await supabase.from('credit_usage').insert({
    code_id: code,
    action: 'restoration',
  });

  return {
    success: true,
    creditsRemaining: validation.creditsRemaining - 1,
  };
}
