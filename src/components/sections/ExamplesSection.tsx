import React from 'react';

export function ExamplesSection() {
  return (
    <section id="exemplos" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Resultados Reais</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Veja a Transformação</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Resultados reais de fotos restauradas pela nossa IA.</p>
        </div>
        <div className="text-center text-zinc-500 py-12">
          <p className="text-lg">Exemplos de restauração serão exibidos aqui após o processamento.</p>
        </div>
      </div>
    </section>
  );
}
