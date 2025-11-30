import React, { useEffect, useState } from 'react';
import { CheckCircle, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiValidateCode } from '@/lib/api';

export function PaymentSuccess() {
  const [code, setCode] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar parâmetros da URL (Mercado Pago retorna informações)
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    const externalReference = params.get('external_reference');

    console.log('Payment callback:', { paymentId, status, externalReference });

    if (status === 'approved' && externalReference) {
      try {
        const ref = JSON.parse(externalReference);
        
        // O código foi gerado pelo webhook, precisamos buscá-lo
        // Por enquanto, mostrar mensagem de sucesso
        setIsLoading(false);
        
        // Em produção, você buscaria o código pelo email
        // Por agora, mostrar instruções
      } catch (e) {
        setError('Erro ao processar pagamento');
        setIsLoading(false);
      }
    } else if (status === 'pending') {
      setError('Pagamento pendente. Você receberá o código por email quando confirmado.');
      setIsLoading(false);
    } else {
      setError('Pagamento não foi aprovado');
      setIsLoading(false);
    }
  }, []);

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
          <p className="text-white">Processando pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
          <p className="text-gray-400 mb-6">
            Verifique seu email para mais informações sobre seu pedido.
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
          Seu código de acesso foi enviado para seu email.
        </p>

        {code && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Seu código:</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-mono font-bold text-violet-400">
                {code}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-emerald-400 mt-2">
              {credits} créditos disponíveis
            </p>
          </div>
        )}

        <div className="space-y-3">
          <a href="/#restaurar" className="block">
            <Button variant="primary" className="w-full">
              Começar a Restaurar Fotos
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
