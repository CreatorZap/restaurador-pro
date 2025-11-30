import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createCreditCode } from '../lib/supabase';
import { sendCodeEmail } from '../lib/email';

// Set para evitar processamento duplicado (em memória - OK para serverless)
const processedPayments = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook active' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log da requisição
  console.log('🔔 Webhook recebido:', JSON.stringify(req.body));

  try {
    const { type, data } = req.body || {};

    // Responder imediatamente ao Mercado Pago
    if (type !== 'payment' || !data?.id) {
      return res.status(200).json({ received: true, message: 'Not a payment notification' });
    }

    const paymentId = String(data.id);

    // Evitar duplicatas
    if (processedPayments.has(paymentId)) {
      console.log(`⚠️ Pagamento ${paymentId} já processado`);
      return res.status(200).json({ received: true, message: 'Already processed' });
    }

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
      console.log(`⏳ Pagamento não aprovado: ${paymentInfo.status}`);
      return res.status(200).json({ received: true, status: paymentInfo.status });
    }

    // Pagamento aprovado! Processar...
    console.log(`✅ Pagamento aprovado: ${paymentId}`);
    processedPayments.add(paymentId);

    // Parse external_reference (contém dados do pedido)
    let orderData;
    try {
      orderData = JSON.parse(paymentInfo.external_reference || '{}');
    } catch {
      console.error('❌ Erro ao parsear external_reference');
      orderData = {};
    }

    const email = orderData.email || paymentInfo.payer?.email;
    const credits = orderData.credits || 10;
    const packageName = orderData.packageName || 'Pacote';

    if (!email) {
      console.error('❌ Email não encontrado no pagamento');
      return res.status(200).json({ received: true, error: 'Email not found' });
    }

    console.log(`📧 Email: ${email}`);
    console.log(`📦 Pacote: ${packageName}`);
    console.log(`💰 Créditos: ${credits}`);

    // Criar código no Supabase
    const codeData = await createCreditCode({
      email,
      credits,
      packageName,
      paymentId,
    });

    console.log(`🎟️ Código gerado: ${codeData.code}`);

    // Enviar email
    const emailResult = await sendCodeEmail({
      email,
      code: codeData.code,
      packageName,
      credits,
    });

    if (emailResult.success) {
      console.log(`📨 Email enviado para: ${email}`);
    } else {
      console.error(`❌ Erro ao enviar email:`, emailResult.error);
    }

    return res.status(200).json({
      received: true,
      success: true,
      code: codeData.code,
      emailSent: emailResult.success,
    });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return res.status(200).json({ received: true, error: 'Processing error' });
  }
}
