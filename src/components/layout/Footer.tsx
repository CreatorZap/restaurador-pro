import React from 'react';
import { Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 text-xl font-bold text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
            <Camera size={16} />
          </div>
          FotoMagic Pro
        </div>
        <nav className="flex gap-8 text-zinc-500 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Suporte</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </nav>
        <div className="text-zinc-600 text-sm">
          © 2024 FotoMagic Pro. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
