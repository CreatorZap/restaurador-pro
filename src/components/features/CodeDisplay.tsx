import React, { useState } from 'react';
import { Copy, Check, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeDisplayProps {
  code: string;
  credits: number;
  email: string;
  onContinue: () => void;
}

export function CodeDisplay({ code, credits, email, onContinue }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Ícone de sucesso */}
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="w-10 h-10 text-emerald-400" />
      </div>

      {/* Título */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Compra Confirmada! 🎉</h3>
        <p className="text-gray-400">
          Seu código de acesso foi gerado com sucesso
        </p>
      </div>

      {/* Código */}
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
        <p className="text-sm text-gray-400 mb-3">Seu código de acesso:</p>
        <div className="flex items-center justify-center gap-3">
          <code className="text-3xl font-mono font-bold text-violet-400 tracking-wider">
            {code}
          </code>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {/* Créditos */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold">{credits} créditos disponíveis</span>
        </div>
      </div>

      {/* Informações */}
      <div className="bg-white/5 rounded-xl p-4 text-left space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-violet-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Email de confirmação enviado</p>
            <p className="text-gray-400">Enviamos o código para {email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">Válido por 1 ano</p>
            <p className="text-gray-400">Use em qualquer dispositivo com o código</p>
          </div>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-sm">
        ⚠️ <strong>Importante:</strong> Guarde este código! Ele é necessário para acessar seus créditos em outros dispositivos.
      </div>

      {/* Botão continuar */}
      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        className="w-full"
      >
        Começar a Restaurar Fotos
      </Button>
    </div>
  );
}
