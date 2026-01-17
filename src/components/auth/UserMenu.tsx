import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface UserMenuProps {
  onOpenLogin: () => void;
  freeCredits: number;
}

export function UserMenu({ onOpenLogin, freeCredits }: UserMenuProps) {
  const { user, profile, signOut, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-9 h-9 bg-white/5 rounded-full animate-pulse" />
    );
  }

  // Não logado - mostrar botão de entrar
  if (!user) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onOpenLogin}
        leftIcon={<User className="w-4 h-4" />}
      >
        <span className="hidden sm:inline">Entrar</span>
      </Button>
    );
  }

  // Logado - mostrar menu do usuário
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Usuário';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
      >
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        )}

        {/* Nome (desktop) */}
        <span className="hidden sm:block text-white text-sm font-medium max-w-[100px] truncate">
          {displayName}
        </span>

        {/* Créditos */}
        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-500 text-xs font-bold">{freeCredits}</span>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{displayName}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
            </div>

            {/* Créditos Info */}
            <div className="mt-3 p-2 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Créditos grátis</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">{freeCredits}</span>
                </div>
              </div>
              {profile && (
                <p className="text-xs text-gray-500 mt-1">
                  {profile.free_credits_used} de {profile.free_credits_limit} usados
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
