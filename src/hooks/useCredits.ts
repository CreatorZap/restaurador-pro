import { useState, useEffect, useCallback } from 'react';
import { apiCreateCode, apiValidateCode, apiUseCredit } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface LocalCredits {
  free: number;
  code: string | null;
  codeCredits: number;
  isPaidUser: boolean;
}

interface UseCreditsReturn {
  credits: LocalCredits;
  totalCredits: number;
  freeCredits: number;
  hasActiveCode: boolean;
  activeCodeCredits: number;
  isLoading: boolean;
  useCredit: () => Promise<{ success: boolean; hasWatermark: boolean }>;
  activateCode: (code: string) => Promise<{ success: boolean; error?: string; credits?: number }>;
  deactivateCode: () => void;
  addCreditsWithCode: (email: string, amount: number, packageName: string) => Promise<string | null>;
  refreshCredits: () => Promise<void>;
}

const ACTIVE_CODE_KEY = 'fotorestore_active_code';

export function useCredits(): UseCreditsReturn {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<LocalCredits>(() => {
    // Inicializar com código ativo do localStorage (se houver)
    const activeCode = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_CODE_KEY) : null;
    return {
      free: 0, // Será calculado do profile
      code: activeCode,
      codeCredits: 0,
      isPaidUser: false
    };
  });

  // Calcular créditos grátis do profile (Supabase)
  const freeCredits = profile
    ? profile.free_credits_limit - profile.free_credits_used
    : 0;

  // Total = créditos grátis + créditos do código
  const totalCredits = freeCredits + credits.codeCredits;
  const hasActiveCode = !!credits.code;
  const activeCodeCredits = credits.codeCredits;

  // Salvar código ativo no localStorage
  useEffect(() => {
    if (credits.code) {
      localStorage.setItem(ACTIVE_CODE_KEY, credits.code);
    } else {
      localStorage.removeItem(ACTIVE_CODE_KEY);
    }
  }, [credits.code]);

  // Validar código ativo ao iniciar
  useEffect(() => {
    if (credits.code) {
      refreshCredits();
    }
  }, []);

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

        // Registrar restauração no banco (opcional - com código)
        if (user) {
          try {
            await supabase.from('restorations').insert({
              user_id: user.id,
              credit_code_id: null, // TODO: mapear código para ID
              used_free_credit: false,
              restoration_type: 'auto'
            });
          } catch (error) {
            console.error('Erro ao registrar restauração:', error);
          }
        }

        return { success: true, hasWatermark: false };
      }
    }

    // Se não tem código ou acabou, usa crédito gratuito (com marca d'água)
    if (user && profile && freeCredits > 0) {
      setIsLoading(true);

      try {
        // Atualizar free_credits_used no Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({ free_credits_used: profile.free_credits_used + 1 })
          .eq('id', user.id);

        if (error) {
          console.error('Erro ao usar crédito grátis:', error);
          setIsLoading(false);
          return { success: false, hasWatermark: true };
        }

        // Registrar restauração no banco
        await supabase.from('restorations').insert({
          user_id: user.id,
          credit_code_id: null,
          used_free_credit: true,
          restoration_type: 'auto'
        });

        // Atualizar profile local
        await refreshProfile();

        setIsLoading(false);
        return { success: true, hasWatermark: true };
      } catch (error) {
        console.error('Erro ao processar crédito:', error);
        setIsLoading(false);
        return { success: false, hasWatermark: true };
      }
    }

    return { success: false, hasWatermark: true };
  }, [credits, user, profile, freeCredits, refreshProfile]);

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
    credits: {
      ...credits,
      free: freeCredits // Usar créditos do profile
    },
    totalCredits,
    freeCredits,
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
