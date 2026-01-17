import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const mpConfigured = !!process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  return res.status(200).json({
    status: 'ok',
    mpConfigured,
    timestamp: new Date().toISOString()
  });
}
