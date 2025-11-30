import { CreditCode, ValidateCodeResponse, UseCodeCreditResponse } from '@/types/credits';
import { generateUniqueCode, calculateExpirationDate, isValidCodeFormat, formatCode } from './codeGenerator';

const CODES_STORAGE_KEY = 'fotorestore_codes';
const ACTIVE_CODE_KEY = 'fotorestore_active_code';

/**
 * Obtém todos os códigos armazenados
 */
function getAllCodes(): Record<string, CreditCode> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(CODES_STORAGE_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Salva todos os códigos
 */
function saveAllCodes(codes: Record<string, CreditCode>): void {
  localStorage.setItem(CODES_STORAGE_KEY, JSON.stringify(codes));
}

/**
 * Cria um novo código após pagamento
 */
export function createCode(
  email: string, 
  credits: number, 
  packageName: string
): CreditCode {
  const code = generateUniqueCode();
  const formattedCode = formatCode(code); // Garante formatação consistente
  const now = new Date().toISOString();
  
  const creditCode: CreditCode = {
    code: formattedCode, // Usa código formatado
    email: email.toLowerCase().trim(),
    creditsTotal: credits,
    creditsUsed: 0,
    createdAt: now,
    expiresAt: calculateExpirationDate(),
    packageName,
    isActive: true
  };

  const allCodes = getAllCodes();
  allCodes[formattedCode] = creditCode; // Chave também formatada
  saveAllCodes(allCodes);
  
  console.log('=== Código Criado ===');
  console.log('Code:', formattedCode);
  console.log('All codes now:', Object.keys(allCodes));

  return creditCode;
}

/**
 * Valida os dados do código (status, expiração, créditos)
 */
function validateCodeData(creditCode: CreditCode): ValidateCodeResponse {
  // Código inativo
  if (!creditCode.isActive) {
    return { 
      valid: false, 
      error: 'Este código foi desativado.' 
    };
  }

  // Código expirado
  if (new Date(creditCode.expiresAt) < new Date()) {
    return { 
      valid: false, 
      error: 'Este código expirou.' 
    };
  }

  // Sem créditos restantes
  const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
  if (remaining <= 0) {
    return { 
      valid: false, 
      error: 'Este código não tem mais créditos disponíveis.' 
    };
  }

  return { 
    valid: true, 
    code: creditCode 
  };
}

/**
 * Valida um código e retorna informações
 */
export function validateCode(inputCode: string): ValidateCodeResponse {
  const code = formatCode(inputCode);
  
  console.log('=== DEBUG validateCode ===');
  console.log('Input:', inputCode);
  console.log('Formatted:', code);
  
  // Validar formato
  if (!isValidCodeFormat(code)) {
    console.log('Formato inválido');
    return { 
      valid: false, 
      error: 'Formato de código inválido. Use: REST-XXXX-XXXX' 
    };
  }

  const allCodes = getAllCodes();
  console.log('All codes in storage:', Object.keys(allCodes));
  console.log('Looking for:', code);
  
  const creditCode = allCodes[code];
  console.log('Found:', creditCode);

  // Código não existe
  if (!creditCode) {
    // Tentar buscar ignorando case
    const codeUpper = code.toUpperCase();
    const foundKey = Object.keys(allCodes).find(k => k.toUpperCase() === codeUpper);
    
    if (foundKey) {
      console.log('Found with different case:', foundKey);
      const foundCode = allCodes[foundKey];
      return validateCodeData(foundCode);
    }
    
    return { 
      valid: false, 
      error: 'Código não encontrado. Verifique se digitou corretamente.' 
    };
  }

  return validateCodeData(creditCode);
}

/**
 * Usa um crédito do código
 */
export function useCodeCredit(inputCode: string): UseCodeCreditResponse {
  const code = formatCode(inputCode);
  const allCodes = getAllCodes();
  const creditCode = allCodes[code];

  if (!creditCode) {
    return { success: false, error: 'Código não encontrado' };
  }

  const remaining = creditCode.creditsTotal - creditCode.creditsUsed;
  if (remaining <= 0) {
    return { success: false, error: 'Sem créditos disponíveis' };
  }

  // Incrementa uso
  creditCode.creditsUsed += 1;
  allCodes[code] = creditCode;
  saveAllCodes(allCodes);

  return { 
    success: true, 
    creditsRemaining: creditCode.creditsTotal - creditCode.creditsUsed 
  };
}

/**
 * Obtém créditos restantes de um código
 */
export function getCodeCredits(inputCode: string): number {
  const code = formatCode(inputCode);
  const allCodes = getAllCodes();
  const creditCode = allCodes[code];
  
  if (!creditCode) return 0;
  
  return Math.max(0, creditCode.creditsTotal - creditCode.creditsUsed);
}

/**
 * Salva código ativo no dispositivo
 */
export function setActiveCode(code: string | null): void {
  if (code) {
    localStorage.setItem(ACTIVE_CODE_KEY, formatCode(code));
  } else {
    localStorage.removeItem(ACTIVE_CODE_KEY);
  }
}

/**
 * Obtém código ativo do dispositivo
 */
export function getActiveCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_CODE_KEY);
}

/**
 * Remove código ativo
 */
export function clearActiveCode(): void {
  localStorage.removeItem(ACTIVE_CODE_KEY);
}

/**
 * DEBUG: Lista todos os códigos (remover em produção)
 */
export function debugListAllCodes(): void {
  const allCodes = getAllCodes();
  console.log('=== TODOS OS CÓDIGOS ===');
  Object.entries(allCodes).forEach(([key, value]) => {
    console.log(`Key: "${key}"`);
    console.log(`  Code: "${value.code}"`);
    console.log(`  Credits: ${value.creditsTotal - value.creditsUsed}/${value.creditsTotal}`);
    console.log(`  Active: ${value.isActive}`);
  });
}

// Expor no window para debug no console do browser
if (typeof window !== 'undefined') {
  (window as any).debugCodes = debugListAllCodes;
  (window as any).getAllCodes = getAllCodes;
}
