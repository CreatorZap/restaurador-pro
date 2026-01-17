import React from 'react';
import { Upload, Cpu, Download } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    { icon: <Upload size={32} />, title: "Envie sua Foto", text: "Faça upload da foto antiga. Aceita JPG, PNG e fotos de celular." },
    { icon: <Cpu size={32} />, title: "IA Processa", text: "Nossa IA analisa e restaura automaticamente: remove danos e coloriza." },
    { icon: <Download size={32} />, title: "Baixe em HD", text: "Receba sua foto restaurada em alta resolução, pronta para imprimir." }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Simples & Rápido</span>
          <h2 className="text-4xl font-black text-white mb-4">Como Funciona</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Restaure suas fotos em 3 passos simples. Sem conhecimento técnico.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="text-center relative z-10 group">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-xl shadow-violet-600/20 group-hover:scale-110 transition-transform duration-300">
                {i + 1}
              </div>
              <div className="text-violet-400 mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed px-4">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
