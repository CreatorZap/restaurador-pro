import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

interface CodeActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (code: string) => Promise<{ success: boolean; error?: string; credits?: number }>;
}

export function CodeActivationModal({ 
  isOpen, 
  onClose, 
  onActivate 
}: CodeActivationModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ credits: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCodeInput = (value: string) => {
    // Remove tudo que não é letra ou número
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Formata como REST-XXXX-XXXX
    let formatted = '';
    if (clean.length > 0) {
      formatted = 'REST-';
      if (clean.startsWith('REST')) {
        const rest = clean.slice(4);
        formatted += rest.slice(0, 4);
        if (rest.length > 4) {
          formatted += '-' + rest.slice(4, 8);
        }
      } else {
        formatted += clean.slice(0, 4);
        if (clean.length > 4) {
          formatted += '-' + clean.slice(4, 8);
        }
      }
    }
    
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCodeInput(e.target.value);
    setCode(formatted);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const result = await onActivate(code);
    setIsLoading(false);

    if (result.success) {
      setSuccess({ credits: result.credits || 0 });
      // Fecha após 2 segundos
      setTimeout(() => {
        onClose();
        setCode('');
        setSuccess(null);
      }, 2000);
    } else {
      setError(result.error || 'Erro ao ativar código');
    }
  };

  const handleClose = () => {
    setCode('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ativar Código" size="sm">
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Código Ativado!</h3>
          <p className="text-gray-400">
            Você tem <span className="text-emerald-400 font-bold">{success.credits} créditos</span> disponíveis
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Digite seu código de acesso
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={code}
                onChange={handleInputChange}
                placeholder="REST-XXXX-XXXX"
                maxLength={14}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono text-lg tracking-wider"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-400">
            <p className="mb-2">📧 O código foi enviado para seu email após a compra</p>
            <p>💡 Você pode usar o mesmo código em qualquer dispositivo</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={code.length < 14}
              className="flex-1"
            >
              Ativar Código
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
