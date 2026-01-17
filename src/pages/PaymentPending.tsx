import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PaymentPending() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Pagamento Pendente
        </h1>
        
        <p className="text-gray-400 mb-6">
          Seu pagamento está sendo processado. Isso pode levar alguns minutos.
        </p>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 text-left">
          <h3 className="text-white font-semibold mb-2">O que acontece agora?</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>✓ Seu pedido foi registrado</li>
            <li>⏳ Aguardando confirmação do pagamento</li>
            <li>📧 Você receberá um email quando aprovado</li>
            <li>🎁 Seu código será enviado automaticamente</li>
          </ul>
        </div>

        <div className="space-y-3">
          <a href="/" className="block">
            <Button variant="primary" className="w-full">
              Voltar ao Início
            </Button>
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Tempo médio de processamento: 5-10 minutos
        </p>
      </div>
    </div>
  );
}
