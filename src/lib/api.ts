// Cliente para API de códigos

// Detectar ambiente e configurar URL da API
const getApiBaseUrl = () => {
  // Em produção, usar mesma origem (Vercel)
  if (import.meta.env.PROD) {
    return '';
  }
  // Em desenvolvimento, usar servidor local
  return 'http://localhost:3001';
};

const API_BASE = getApiBaseUrl();

interface CreditCode {
  code: string;
  email: string;
  creditsTotal: number;
  creditsUsed: number;
  creditsRemaining?: number;
  createdAt: string;
  expiresAt: string;
  packageName: string;
  isActive: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Criar novo código após pagamento
 */
export async function apiCreateCode(
  email: string, 
  credits: number, 
  packageName: string
): Promise<ApiResponse<CreditCode>> {
  try {
    const response = await fetch(`${API_BASE}/api/codes?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, credits, packageName }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro de conexão com o servidor' };
  }
}

/**
 * Validar código existente
 */
export async function apiValidateCode(code: string): Promise<ApiResponse<CreditCode>> {
  try {
    const response = await fetch(`${API_BASE}/api/codes?action=validate&code=${encodeURIComponent(code)}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro de conexão com o servidor' };
  }
}

/**
 * Usar um crédito do código
 */
export async function apiUseCredit(code: string): Promise<ApiResponse<{ creditsRemaining: number }>> {
  try {
    const response = await fetch(`${API_BASE}/api/codes?action=use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro de conexão com o servidor' };
  }
}

// ============================================
// PAGAMENTOS - Mercado Pago
// ============================================

interface PaymentCreateResponse {
  preferenceId: string;
  initPoint: string; // URL de pagamento produção
  sandboxInitPoint: string; // URL de pagamento teste
}

/**
 * Criar preferência de pagamento no Mercado Pago
 */
export async function apiCreatePayment(
  packageId: string,
  email: string
): Promise<ApiResponse<PaymentCreateResponse>> {
  try {
    const response = await fetch(`${API_BASE}/api/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, email }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro ao criar pagamento' };
  }
}

/**
 * Verificar status do pagamento
 */
export async function apiCheckPaymentStatus(
  paymentId: string
): Promise<ApiResponse<{ status: string; statusDetail: string }>> {
  try {
    const response = await fetch(`${API_BASE}/api/payment/status/${paymentId}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro ao verificar pagamento' };
  }
}

/**
 * APENAS TESTE: Simular pagamento aprovado
 */
export async function apiSimulatePayment(
  packageId: string,
  email: string
): Promise<ApiResponse<CreditCode>> {
  try {
    const response = await fetch(`${API_BASE}/api/payment/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, email }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Erro ao simular pagamento' };
  }
}
