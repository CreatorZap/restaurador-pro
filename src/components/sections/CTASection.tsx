import React from 'react';
import { Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="relative z-10 px-6">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Pronto para Restaurar<br />Suas Memórias?
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
          Comece agora gratuitamente. Suas fotos antigas merecem uma nova vida.
        </p>
        <a href="#restaurar" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-violet-600/40 hover:-translate-y-1 transition-all">
          <Sparkles size={22} />
          Restaurar Minha Primeira Foto
        </a>
      </div>
    </section>
  );
}
