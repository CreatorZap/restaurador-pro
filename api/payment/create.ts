import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const PACKAGES: Record<string, { id: string; name: string; price: number; credits: number }> = {
  starter: { id: 'starter', name: 'Pacote Inicial', price: 19, credits: 10 },
  family: { id: 'family', name: 'Pacote Família', price: 49, credits: 35 },
  pro: { id: 'pro', name: 'Pacote Profissional', price: 99, credits: 100 }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { packageId, email } = req.body;

  if (!packageId || !email) {
    return res.status(400).json({ success: false, error: 'Dados incompletos' });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return res.status(400).json({ success: false, error: 'Pacote não encontrado' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ success: false, error: 'Token Mercado Pago não configurado' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const siteUrl = process.env.VITE_SITE_URL || 'https://fotomagicpro.com';

    const preferenceData = {
      items: [
        {
          id: pkg.id,
          title: `${pkg.name} - ${pkg.credits} Créditos`,
          description: `FotoMagic Pro - ${pkg.credits} restaurações de fotos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(pkg.price)
        }
      ],
      payer: {
        email: email
      },
      back_urls: {
        success: `${siteUrl}/?status=success&package=${packageId}`,
        failure: `${siteUrl}/?status=failure`,
        pending: `${siteUrl}/?status=pending`
      },
      auto_return: 'approved' as const,
      notification_url: `${siteUrl}/api/payment/webhook`,
      external_reference: JSON.stringify({
        email,
        packageId,
        credits: pkg.credits,
        packageName: pkg.name,
        timestamp: Date.now()
      }),
      statement_descriptor: 'FOTOMAGIC PRO'
    };

    const response = await preference.create({ body: preferenceData });

    return res.status(200).json({
      success: true,
      data: {
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point
      }
    });

  } catch (error: any) {
    console.error('Erro Mercado Pago:', error);
    return res.status(500).json({
      success: false,
      error: `Erro ao criar pagamento: ${error.message}`
    });
  }
}
