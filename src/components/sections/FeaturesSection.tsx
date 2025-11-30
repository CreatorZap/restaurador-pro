import React from 'react';
import { Wrench, Palette, Sparkles, User, Shirt, Zap } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    { icon: <Wrench size={24} />, title: "Reparo de Danos", desc: "Remove rasgos, dobras, manchas de água, fungos e arranhões automaticamente." },
    { icon: <Palette size={24} />, title: "Colorização Realista", desc: "Adiciona cores naturais e vibrantes a fotos em preto e branco ou sépia." },
    { icon: <Sparkles size={24} />, title: "Melhoria de Qualidade", desc: "Aumenta resolução e nitidez para qualidade de câmera profissional moderna." },
    { icon: <User size={24} />, title: "Preservação de Identidade", desc: "Mantém traços faciais, expressões e características originais intactas." },
    { icon: <Shirt size={24} />, title: "Fidelidade Histórica", desc: "Preserva roupas, acessórios e contexto da época fielmente." },
    { icon: <Zap size={24} />, title: "Processamento Rápido", desc: "Resultados em menos de 30 segundos, sem espera." }
  ];

  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Tecnologia de Ponta</span>
          <h2 className="text-4xl font-black text-white mb-4">Recursos Avançados</h2>
          <p className="text-zinc-400">Nossa IA foi treinada com milhões de fotos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-[#0F0F0F] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-colors group">
              <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-6 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
