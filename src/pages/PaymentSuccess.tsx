import React, { useEffect, useState } from 'react';
import { CheckCircle, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PaymentSuccess() {
  const [code, setCode] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [packageName, setPackageName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');

    console.log('Payment callback:', { paymentId, status });

    if (status === 'approved' && paymentId) {
      verifyPayment(paymentId);
    } else if (status === 'pending') {
      setError('Pagamento pendente. Você receberá o código por email quando confirmado.');
      setIsLoading(false);
    } else if (status === 'failure') {
      setError('Pagamento não foi aprovado. Tente novamente.');
      setIsLoading(false);
    } else {
      setError('Informações de pagamento não encontradas.');
      setIsLoading(false);
    }
  }, []);

  const verifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payment/verify?payment_id=${paymentId}`);
      const data = await response.json();

      if (data.success) {
        setCode(data.code);
        setCredits(data.credits);
        setPackageName(data.packageName);
        setIsLoading(false);
      } else if (data.pending) {
        // Pagamento ainda processando, tentar novamente
        if (retryCount < 10) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            verifyPayment(paymentId);
          }, 3000);
        } else {
          setError('Pagamento em processamento. Verifique seu email em alguns minutos.');
          setIsLoading(false);
        }
      } else {
        setError(data.message || 'Erro ao verificar pagamento');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erro:', err);
      if (retryCount < 5) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          verifyPayment(paymentId);
        }, 3000);
      } else {
        setError('Erro ao verificar pagamento. Verifique seu email.');
        setIsLoading(false);
      }
    }
  };

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Processando pagamento...</p>
          <p className="text-gray-400 text-sm">Aguarde enquanto geramos seu código</p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-xs mt-2">Tentativa {retryCount}/10</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-4">{error}</h1>
          <p className="text-gray-400 mb-6">
            Se você realizou o pagamento, o código será enviado para seu email em alguns minutos.
          </p>
          <a href="/">
            <Button variant="primary">Voltar ao Início</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Pagamento Aprovado! 🎉
        </h1>
        
        <p className="text-gray-400 mb-6">
          {packageName} - {credits} créditos
        </p>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-3">Seu código de acesso:</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <code className="text-3xl font-mono font-bold text-violet-400 tracking-wider">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-6 h-6 text-emerald-400" />
              ) : (
                <Copy className="w-6 h-6 text-gray-400 hover:text-white" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-emerald-400 text-sm">Código copiado!</p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-emerald-400 font-semibold">
              ✨ {credits} créditos disponíveis
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Válido por 12 meses
            </p>
          </div>
        </div>

        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mb-6">
          <p className="text-violet-300 text-sm">
            💡 <strong>Guarde este código!</strong> Use-o para restaurar suas fotos.
            Também enviamos uma cópia para seu email.
          </p>
        </div>

        <div className="space-y-3">
          <a href="/#restaurar" className="block">
            <Button variant="primary" className="w-full">
              🚀 Começar a Restaurar Fotos
            </Button>
          </a>
          <a href="/" className="block">
            <Button variant="secondary" className="w-full">
              Voltar ao Início
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
