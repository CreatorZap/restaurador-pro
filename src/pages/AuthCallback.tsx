import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type CallbackStatus = 'loading' | 'success' | 'error';

export function AuthCallback() {
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // O Supabase processa automaticamente o código na URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro no callback de auth:', error);
          setErrorMessage(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');
          // Redirecionar para home após 2 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          // Tentar exchange do código (para magic link)
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const queryParams = new URLSearchParams(window.location.search);

          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const code = queryParams.get('code');

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              throw sessionError;
            }

            setStatus('success');
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else if (code) {
            // Exchange code for session (PKCE flow)
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              throw exchangeError;
            }

            setStatus('success');
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            // Sem sessão e sem código
            setErrorMessage('Link de autenticação inválido ou expirado');
            setStatus('error');
          }
        }
      } catch (err: any) {
        console.error('Erro ao processar callback:', err);
        setErrorMessage(err.message || 'Erro ao processar autenticação');
        setStatus('error');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl border border-white/10 p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Verificando...</h1>
            <p className="text-gray-400">Aguarde enquanto confirmamos seu acesso</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Login realizado!</h1>
            <p className="text-gray-400 mb-4">Você será redirecionado em instantes...</p>
            <a
              href="/"
              className="text-violet-400 hover:text-violet-300 underline text-sm"
            >
              Clique aqui se não for redirecionado
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Erro no login</h1>
            <p className="text-gray-400 mb-6">{errorMessage}</p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-500 transition-colors"
            >
              Voltar ao início
            </a>
          </>
        )}
      </div>
    </div>
  );
}
