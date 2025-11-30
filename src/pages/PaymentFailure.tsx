import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Pagamento Não Aprovado
        </h1>
        
        <p className="text-gray-400 mb-6">
          Não foi possível processar seu pagamento. Isso pode acontecer por diversos motivos:
        </p>

        <ul className="text-left text-gray-400 text-sm space-y-2 mb-6 bg-gray-800 rounded-xl p-4">
          <li>• Saldo insuficiente</li>
          <li>• Dados do cartão incorretos</li>
          <li>• Cartão bloqueado</li>
          <li>• Limite excedido</li>
        </ul>

        <div className="space-y-3">
          <a href="/#precos" className="block">
            <Button variant="primary" className="w-full">
              Tentar Novamente
            </Button>
          </a>
          <a href="/" className="block">
            <Button variant="secondary" className="w-full">
              Voltar ao Início
            </Button>
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Se o problema persistir, entre em contato com seu banco ou tente outro método de pagamento.
        </p>
      </div>
    </div>
  );
}
