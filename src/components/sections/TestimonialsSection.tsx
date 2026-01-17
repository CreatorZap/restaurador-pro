import React from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Restaurei a única foto do meu avô que sobreviveu a uma enchente. Estava toda manchada e rasgada. O resultado me fez chorar de emoção. Valeu cada centavo!",
      author: "Maria Fernanda",
      location: "São Paulo, SP",
      initial: "MF"
    },
    {
      quote: "Sou fotógrafo e agora ofereço restauração como serviço extra. A qualidade é impressionante e meus clientes ficam encantados. Já recuperei o investimento!",
      author: "Ricardo Santos",
      location: "Rio de Janeiro, RJ",
      initial: "RS"
    },
    {
      quote: "Restaurei o álbum de casamento dos meus pais dos anos 70. Ver as fotos coloridas e restauradas foi como voltar no tempo. Presente perfeito!",
      author: "Ana Luíza",
      location: "Belo Horizonte, MG",
      initial: "AL"
    }
  ];

  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Depoimentos</span>
          <h2 className="text-4xl font-black text-white mb-4">O Que Nossos Clientes Dizem</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-[#1A1A1A] p-8 rounded-3xl border border-white/5">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-xs text-zinc-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
