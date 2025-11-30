import React from 'react';
import { KeyRound, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeStatusProps {
  code: string;
  credits: number;
  onDeactivate: () => void;
}

export function CodeStatus({ code, credits, onDeactivate }: CodeStatusProps) {
  return (
    <div className="bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Código ativo:</span>
              <code className="text-violet-400 font-mono font-bold">{code}</code>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">{credits} créditos</span>
              <span className="text-gray-500">restantes</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeactivate}
          className="text-gray-400 hover:text-red-400"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Desconectar
        </Button>
      </div>
    </div>
  );
}
