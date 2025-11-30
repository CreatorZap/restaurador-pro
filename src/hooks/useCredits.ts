import { useState, useEffect, useCallback } from 'react';
import { apiCreateCode, apiValidateCode, apiUseCredit } from '@/lib/api';

interface LocalCredits {
  free: number;
  code: string | null;
  codeCredits: number;
  isPaidUser: boolean;
}

interface UseCreditsReturn {
  credits: LocalCredits;
  totalCredits: number;
  hasActiveCode: boolean;
  activeCodeCredits: number;
  isLoading: boolean;
  useCredit: () => Promise<{ success: boolean; hasWatermark: boolean }>;
  activateCode: (code: string) => Promise<{ success: boolean; error?: string; credits?: number }>;
  deactivateCode: () => void;
  addCreditsWithCode: (email: string, amount: number, packageName: string) => Promise<string | null>;
  refreshCredits: () => Promise<void>;
}

const STORAGE_KEY = 'fotorestore_local_credits';
const ACTIVE_CODE_KEY = 'fotorestore_active_code';
const INITIAL_FREE_CREDITS = 2;

export function useCredits(): UseCreditsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<LocalCredits>(() => {
    if (typeof window === 'undefined') {
      return { free: INITIAL_FREE_CREDITS, code: null, codeCredits: 0, isPaidUser: false };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    let localCredits: LocalCredits = { 
      free: INITIAL_FREE_CREDITS, 
      code: null, 
      codeCredits: 0, 
      isPaidUser: false 
    };

    if (saved) {
      try {
        localCredits = JSON.parse(saved);
      } catch {
        // Mantém valores padrão
      }
    }

    // Verificar código ativo
    const activeCode = localStorage.getItem(ACTIVE_CODE_KEY);
    if (activeCode) {
      localCredits.code = activeCode;
    }

    return localCredits;
  });

  // Salvar mudanças no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
    if (credits.code) {
      localStorage.setItem(ACTIVE_CODE_KEY, credits.code);
    } else {
      localStorage.removeItem(ACTIVE_CODE_KEY);
    }
  }, [credits]);

  // Validar código ativo ao iniciar
  useEffect(() => {
    if (credits.code) {
      refreshCredits();
    }
  }, []);

  const totalCredits = credits.free + credits.codeCredits;
  const hasActiveCode = !!credits.code;
  const activeCodeCredits = credits.codeCredits;

  // Atualizar créditos do código via API
  const refreshCredits = useCallback(async () => {
    if (!credits.code) return;

    setIsLoading(true);
    const result = await apiValidateCode(credits.code);
    setIsLoading(false);

    if (result.success && result.data) {
      setCredits(prev => ({
        ...prev,
        codeCredits: result.data.creditsRemaining || 0,
        isPaidUser: true
      }));
    } else {
      // Código inválido, remover
      setCredits(prev => ({
        ...prev,
        code: null,
        codeCredits: 0
      }));
    }
  }, [credits.code]);

  // Usar um crédito
  const useCredit = useCallback(async () => {
    // Primeiro tenta usar crédito do código (sem marca d'água)
    if (credits.code && credits.codeCredits > 0) {
      setIsLoading(true);
      const result = await apiUseCredit(credits.code);
      setIsLoading(false);

      if (result.success) {
        setCredits(prev => ({
          ...prev,
          codeCredits: result.data?.creditsRemaining || 0
        }));
        return { success: true, hasWatermark: false };
      }
    }

    // Se não tem código ou acabou, usa crédito gratuito (com marca d'água)
    if (credits.free > 0) {
      setCredits(prev => ({
        ...prev,
        free: prev.free - 1
      }));
      return { success: true, hasWatermark: true };
    }

    return { success: false, hasWatermark: true };
  }, [credits]);

  // Ativar um código via API
  const activateCode = useCallback(async (inputCode: string) => {
    setIsLoading(true);
    const result = await apiValidateCode(inputCode.toUpperCase());
    setIsLoading(false);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const codeData = result.data!;
    const remaining = codeData.creditsRemaining || (codeData.creditsTotal - codeData.creditsUsed);

    setCredits(prev => ({
      ...prev,
      code: codeData.code,
      codeCredits: remaining,
      isPaidUser: true
    }));

    return { success: true, credits: remaining };
  }, []);

  // Desativar código
  const deactivateCode = useCallback(() => {
    setCredits(prev => ({
      ...prev,
      code: null,
      codeCredits: 0
    }));
  }, []);

  // Criar novo código via API após pagamento
  const addCreditsWithCode = useCallback(async (
    email: string, 
    amount: number, 
    packageName: string
  ): Promise<string | null> => {
    setIsLoading(true);
    const result = await apiCreateCode(email, amount, packageName);
    setIsLoading(false);

    if (!result.success || !result.data) {
      console.error('Erro ao criar código:', result.error);
      return null;
    }

    const newCode = result.data;

    setCredits(prev => ({
      ...prev,
      code: newCode.code,
      codeCredits: amount,
      isPaidUser: true
    }));

    return newCode.code;
  }, []);

  return {
    credits,
    totalCredits,
    hasActiveCode,
    activeCodeCredits,
    isLoading,
    useCredit,
    activateCode,
    deactivateCode,
    addCreditsWithCode,
    refreshCredits
  };
}
