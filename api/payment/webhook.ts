import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Gerar código único
function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FOTO-${segment(4)}-${segment(4)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook active' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔔 Webhook recebido:', JSON.stringify(req.body));

  try {
    const { type, data } = req.body || {};

    if (type !== 'payment' || !data?.id) {
      return res.status(200).json({ received: true, message: 'Not a payment notification' });
    }

    const paymentId = String(data.id);
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('❌ MERCADOPAGO_ACCESS_TOKEN não configurado');
      return res.status(200).json({ received: true, error: 'Missing config' });
    }

    // Buscar detalhes do pagamento
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    console.log(`📋 Status do pagamento: ${paymentInfo.status}`);

    if (paymentInfo.status !== 'approved') {
      return res.status(200).json({ received: true, status: paymentInfo.status });
    }

    console.log(`✅ Pagamento aprovado: ${paymentId}`);

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
      console.error('❌ Email não encontrado');
      return res.status(200).json({ received: true, error: 'Email not found' });
    }

    console.log(`📧 Email: ${email}`);
    console.log(`📦 Pacote: ${packageName}`);
    console.log(`💰 Créditos: ${credits}`);

    // Gerar código
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Salvar no Supabase
    const { data: codeData, error: dbError } = await supabase
      .from('credit_codes')
      .insert({
        code,
        email: email.toLowerCase().trim(),
        credits_total: credits,
        credits_used: 0,
        package_name: packageName,
        payment_id: paymentId,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Erro Supabase:', dbError);
      return res.status(200).json({ received: true, error: 'Database error' });
    }

    console.log(`🎟️ Código gerado: ${code}`);

    // Enviar email
    try {
      await resend.emails.send({
        from: 'FotoMagic Pro <onboarding@resend.dev>',
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
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://fotomagicpro.com" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">🚀 Começar a Restaurar</a>
              </div>
            </div>
            <div style="background: #0f0f23; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="color: #666; margin: 0; font-size: 12px;">© 2024 FotoMagic Pro</p>
            </div>
          </div>
        `,
      });
      console.log(`📨 Email enviado para: ${email}`);
    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError);
    }

    return res.status(200).json({
      received: true,
      success: true,
      code,
    });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return res.status(200).json({ received: true, error: 'Processing error' });
  }
}
