import React, { useState } from 'react';
import { Menu, X, Sparkles, KeyRound, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CodeActivationModal } from '@/components/features/CodeActivationModal';
import { UserMenu } from '@/components/auth';

interface HeaderProps {
  credits: number;
  freeCredits: number;
  hasActiveCode?: boolean;
  activeCode?: string | null;
  onActivateCode?: (code: string) => Promise<{ success: boolean; error?: string; credits?: number }>;
  onOpenLogin: () => void;
}

export function Header({
  credits,
  freeCredits,
  hasActiveCode = false,
  activeCode = null,
  onActivateCode,
  onOpenLogin
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleActivateCode = async (code: string) => {
    if (onActivateCode) {
      return await onActivateCode(code);
    }
    return { success: false, error: 'Função não disponível' };
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white hidden sm:block">
                FotoMagic Pro
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#exemplos" className="text-gray-400 hover:text-white transition-colors">
                Exemplos
              </a>
              <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-400 hover:text-white transition-colors">
                Preços
              </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Créditos */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold">{credits}</span>
                <span className="text-gray-400 text-sm hidden sm:inline">créditos</span>
              </div>

              {/* Botão Já Tenho Código */}
              {!hasActiveCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCodeModalOpen(true)}
                  className="hidden sm:flex"
                >
                  <KeyRound className="w-4 h-4 mr-1" />
                  Já tenho código
                </Button>
              )}

              {/* Código Ativo Badge */}
              {hasActiveCode && activeCode && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
                  <KeyRound className="w-4 h-4 text-violet-400" />
                  <code className="text-violet-400 text-xs font-mono">
                    {activeCode.slice(0, 9)}...
                  </code>
                </div>
              )}

              {/* User Menu (Login/Logout) */}
              <UserMenu onOpenLogin={onOpenLogin} freeCredits={freeCredits} />

              {/* CTA Button */}
              <a href="#restaurar">
                <Button variant="primary" size="sm">
                  Restaurar
                </Button>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              <nav className="flex flex-col gap-4">
                <a
                  href="#exemplos"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Exemplos
                </a>
                <a
                  href="#como-funciona"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Como Funciona
                </a>
                <a
                  href="#precos"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Preços
                </a>
                {!hasActiveCode && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCodeModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    Já tenho código
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modal de Ativação */}
      <CodeActivationModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onActivate={handleActivateCode}
      />
    </>
  );
}
