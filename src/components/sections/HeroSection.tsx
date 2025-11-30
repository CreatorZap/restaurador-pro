import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-28 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-sm text-violet-300 mb-8 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700">
          <span className="bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOVO</span>
          Tecnologia de IA Avançada
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Traga Suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">Memórias</span><br />
          de Volta à Vida
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Restaure fotos antigas, danificadas e desbotadas em segundos. 
          Nossa IA remove danos, coloriza e transforma suas memórias em 
          imagens de qualidade profissional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <a href="#restaurar" className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-violet-600/30 hover:-translate-y-1 transition-all">
            <Sparkles size={20} />
            Testar Grátis (2 fotos)
          </a>
          <a href="#exemplos" className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
            Ver Exemplos
          </a>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-12 pt-12 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1">50.000+</div>
            <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Fotos Restauradas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1">98%</div>
            <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white mb-1">&lt; 30s</div>
            <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Tempo Médio</div>
          </div>
        </div>
      </div>
    </section>
  );
}
