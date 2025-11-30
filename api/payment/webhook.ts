import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check para GET
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook active' });
  }

  // Responder imediatamente ao Mercado Pago
  if (req.method === 'POST') {
    console.log('Webhook received:', JSON.stringify(req.body));
    
    try {
      const { type, data } = req.body || {};

      if (type === 'payment' && data?.id) {
        const paymentId = String(data.id);
        console.log(`Payment notification: ${paymentId}`);
        
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (accessToken) {
          const client = new MercadoPagoConfig({ accessToken });
          const payment = new Payment(client);
          
          try {
            const paymentInfo = await payment.get({ id: paymentId });
            
            if (paymentInfo.status === 'approved') {
              console.log(`✅ Pagamento aprovado: ${paymentId}`);
              
              const externalRef = paymentInfo.external_reference;
              if (externalRef) {
                const refData = JSON.parse(externalRef);
                console.log(`📧 Email: ${refData.email}`);
                console.log(`📦 Pacote: ${refData.packageName}`);
                console.log(`💰 Créditos: ${refData.credits}`);
              }
            }
          } catch (paymentError) {
            console.log(`Payment fetch error: ${paymentError}`);
          }
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(200).json({ received: true, error: 'Processing error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
