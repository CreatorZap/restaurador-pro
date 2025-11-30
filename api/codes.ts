// API para gerenciar códigos de crédito
// Vercel Serverless Function

import { kv } from '@vercel/kv';

// Tipos
interface CreditCode {
  code: string;
  email: string;
  creditsTotal: number;
  creditsUsed: number;
  createdAt: string;
  expiresAt: string;
  packageName: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Para desenvolvimento local sem Vercel KV, usar memória
const localCodes: Record<string, CreditCode> = {};

// Helpers
async function getCode(code: string): Promise<CreditCode | null> {
  if (process.env.VERCEL_ENV) {
    return await kv.get(`code:${code}`);
  }
  return localCodes[code] || null;
}

async function setCode(code: string, data: CreditCode): Promise<void> {
  if (process.env.VERCEL_ENV) {
    // Expira em 1 ano (em segundos)
    await kv.set(`code:${code}`, data, { ex: 365 * 24 * 60 * 60 });
  } else {
    localCodes[code] = data;
  }
}

async function getAllCodes(): Promise<Record<string, CreditCode>> {
  if (process.env.VERCEL_ENV) {
    const keys = await kv.keys('code:*');
    const codes: Record<string, CreditCode> = {};
    for (const key of keys) {
      const code = key.replace('code:', '');
      const data = await kv.get(key);
      if (data) codes[code] = data as CreditCode;
    }
    return codes;
  }
  return localCodes;
}

// Gerar código único
function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => 
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `REST-${segment(4)}-${segment(4)}`;
}

// Handler principal
export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    // CREATE - Criar novo código
    if (action === 'create' && req.method === 'POST') {
      const body = await req.json();
      const { email, credits, packageName } = body;

      if (!email || !credits || !packageName) {
        return Response.json(
          { success: false, error: 'Dados incompletos' },
          { status: 400, headers }
        );
      }

      const code = generateCode();
      const now = new Date();
      const expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));

      const creditCode: CreditCode = {
        code,
        email: email.toLowerCase().trim(),
        creditsTotal: credits,
        creditsUsed: 0,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        packageName,
        isActive: true,
      };

      await setCode(code, creditCode);

      return Response.json(
        { success: true, data: creditCode },
        { headers }
      );
    }

    // VALIDATE - Validar código
    if (action === 'validate') {
      const code = url.searchParams.get('code')?.toUpperCase();

      if (!code) {
        return Response.json(
          { success: false, error: 'Código não informado' },
          { status: 400, headers }
        );
      }

      const creditCode = await getCode(code);

      if (!creditCode) {
        return Response.json(
          { success: false, error: 'Código não encontrado' },
          { status: 404, headers }
        );
      }

      if (!creditCode.isActive) {
        return Response.json(
          { success: false, error: 'Código desativado' },
          { status: 400, headers }
        );
      }

      if (new Date(creditCode.expiresAt) < new Date()) {
        return Response.json(
          { success: false, error: 'Código expirado' },
          { status: 400, headers }
        );
      }

      const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
      if (remaining <= 0) {
        return Response.json(
          { success: false, error: 'Sem créditos disponíveis' },
          { status: 400, headers }
        );
      }

      return Response.json(
        { success: true, data: { ...creditCode, creditsRemaining: remaining } },
        { headers }
      );
    }

    // USE - Usar um crédito
    if (action === 'use' && req.method === 'POST') {
      const body = await req.json();
      const code = body.code?.toUpperCase();

      if (!code) {
        return Response.json(
          { success: false, error: 'Código não informado' },
          { status: 400, headers }
        );
      }

      const creditCode = await getCode(code);

      if (!creditCode) {
        return Response.json(
          { success: false, error: 'Código não encontrado' },
          { status: 404, headers }
        );
      }

      const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
      if (remaining <= 0) {
        return Response.json(
          { success: false, error: 'Sem créditos disponíveis' },
          { status: 400, headers }
        );
      }

      // Incrementar uso
      creditCode.creditsUsed += 1;
      await setCode(code, creditCode);

      return Response.json(
        { 
          success: true, 
          data: { 
            creditsRemaining: creditCode.creditsTotal - creditCode.creditsUsed 
          } 
        },
        { headers }
      );
    }

    // LIST - Listar todos (apenas para debug)
    if (action === 'list' && process.env.NODE_ENV === 'development') {
      const codes = await getAllCodes();
      return Response.json({ success: true, data: codes }, { headers });
    }

    return Response.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400, headers }
    );

  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500, headers }
    );
  }
}

export const config = {
  runtime: 'edge',
};
