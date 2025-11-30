import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Storage temporário (em produção, usar banco de dados como Supabase/MongoDB)
// Para Vercel, precisamos de um banco externo pois serverless não mantém estado
const processedPayments = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Responder imediatamente ao Mercado Pago
  res.status(200).json({ received: true });

  // Processar webhook assincronamente
  try {
    const { type, data } = req.body;

    if (type === 'payment' && data?.id) {
      const paymentId = String(data.id);
      
      // Evitar duplicatas
      if (processedPayments.has(paymentId)) {
        console.log(`Pagamento ${paymentId} já processado`);
        return;
      }

      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) return;

      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);
      
      const paymentInfo = await payment.get({ id: paymentId });

      if (paymentInfo.status === 'approved') {
        console.log(`✅ Pagamento aprovado: ${paymentId}`);
        
        // Marcar como processado
        processedPayments.add(paymentId);

        // Parse external_reference
        const externalRef = paymentInfo.external_reference;
        if (externalRef) {
          const data = JSON.parse(externalRef);
          console.log(`📧 Email: ${data.email}`);
          console.log(`📦 Pacote: ${data.packageName}`);
          console.log(`💰 Créditos: ${data.credits}`);
          
          // TODO: Aqui você deve salvar em um banco de dados
          // e enviar email com o código para o usuário
        }
      }
    }
  } catch (error) {
    console.error('Erro no webhook:', error);
  }
}
