import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FOTO-${segment(4)}-${segment(4)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { payment_id, preference_id } = req.query;

  if (!payment_id && !preference_id) {
    return res.status(400).json({ success: false, error: 'payment_id ou preference_id necessário' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ success: false, error: 'Configuração inválida' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);

    let paymentInfo;
    
    if (payment_id) {
      paymentInfo = await paymentApi.get({ id: String(payment_id) });
    } else {
      // Buscar por preference_id (pode demorar um pouco para aparecer)
      return res.status(200).json({ 
        success: false, 
        pending: true,
        message: 'Aguardando confirmação do pagamento...' 
      });
    }

    if (paymentInfo.status !== 'approved') {
      return res.status(200).json({ 
        success: false, 
        status: paymentInfo.status,
        message: 'Pagamento ainda não aprovado' 
      });
    }

    // Verificar se já existe código para este pagamento
    const { data: existingCode } = await supabase
      .from('credit_codes')
      .select('*')
      .eq('payment_id', String(payment_id))
      .single();

    if (existingCode) {
      return res.status(200).json({
        success: true,
        code: existingCode.code,
        credits: existingCode.credits_total,
        packageName: existingCode.package_name,
        email: existingCode.email,
        alreadyExists: true
      });
    }

    // Parse external_reference
    let orderData: any = {};
    try {
      orderData = JSON.parse(paymentInfo.external_reference || '{}');
    } catch {
      orderData = {};
    }

    const email = orderData.email || paymentInfo.payer?.email;
    const credits = orderData.credits || 10;
    const packageName = orderData.packageName || 'Pacote';

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email não encontrado' });
    }

    // Gerar código
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Salvar no Supabase
    const { error: dbError } = await supabase
      .from('credit_codes')
      .insert({
        code,
        email: email.toLowerCase().trim(),
        credits_total: credits,
        credits_used: 0,
        package_name: packageName,
        payment_id: String(payment_id),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      });

    if (dbError) {
      console.error('Erro Supabase:', dbError);
      return res.status(500).json({ success: false, error: 'Erro ao gerar código' });
    }

    // Enviar email em background (não bloqueia)
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `🎉 Seu código FotoMagic Pro: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✨ FotoMagic Pro</h1>
          </div>
          <div style="background: #1a1a2e; padding: 30px; color: white;">
            <h2 style="color: #10B981;">🎉 Pagamento Confirmado!</h2>
            <p>Obrigado pela sua compra! Seu código de acesso:</p>
            <div style="background: rgba(139, 92, 246, 0.2); border: 2px solid #8B5CF6; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 28px; font-weight: bold; color: #8B5CF6; letter-spacing: 3px; margin: 0;">${code}</p>
            </div>
            <p><strong>Pacote:</strong> ${packageName}</p>
            <p><strong>Créditos:</strong> ${credits} restaurações</p>
            <p><strong>Validade:</strong> 12 meses</p>
          </div>
        </div>
      `,
    }).catch(err => console.error('Erro email:', err));

    return res.status(200).json({
      success: true,
      code,
      credits,
      packageName,
      email
    });

  } catch (error: any) {
    console.error('Erro:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
