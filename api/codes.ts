// API para gerenciar códigos de crédito
// Vercel Serverless Function

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateCode, useCredit } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, code } = req.query;

  // Validar código
  if (req.method === 'GET' && action === 'validate') {
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Código não informado' });
    }

    const result = await validateCode(code);
    
    if (!result.valid) {
      return res.status(404).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, data: result });
  }

  // Usar crédito
  if (req.method === 'POST' && action === 'use') {
    const { code } = req.body || {};
    
    if (!code) {
      return res.status(400).json({ success: false, error: 'Código não informado' });
    }

    const result = await useCredit(code);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  }

  return res.status(400).json({ success: false, error: 'Ação inválida' });
}
