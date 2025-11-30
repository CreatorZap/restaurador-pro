import { useState } from 'react';
import { ImageSlider } from '../features/ImageSlider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const examples = [
  {
    id: 1,
    before: '/examples/01-antes.jpg',
    after: '/examples/01-depois.jpg',
    title: 'Reconstrução Completa',
    description: 'Foto rasgada em 3 pedaços restaurada e colorizada'
  },
  {
    id: 2,
    before: '/examples/02-antes.jpg',
    after: '/examples/02-depois.jpg',
    title: 'Remoção de Danos',
    description: 'Rachaduras e manchas removidas com precisão'
  },
  {
    id: 3,
    before: '/examples/03-antes.jpg',
    after: '/examples/03-depois.jpg',
    title: 'Foto de Família',
    description: 'Restauração completa com colorização natural'
  },
  {
    id: 4,
    before: '/examples/04-antes.jpg',
    after: '/examples/04-depois.jpg',
    title: 'Restauração Facial',
    description: 'Reconstrução de detalhes faciais danificados'
  }
];

export function ExamplesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const currentExample = examples[currentIndex];

  return (
    <section id="exemplos" className="py-16 sm:py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-4">
            RESULTADOS REAIS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Veja a Transformação
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Resultados reais de fotos restauradas pela nossa IA. Arraste o slider para comparar.
          </p>
        </div>

        {/* Slider Principal */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navegação */}
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider Image */}
          <div className="relative">
            <ImageSlider
              beforeImage={currentExample.before}
              afterImage={currentExample.after}
            />

            {/* Info do exemplo */}
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {currentExample.title}
              </h3>
              <p className="text-gray-400">
                {currentExample.description}
              </p>
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-6">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-violet-500 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ir para exemplo ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Grid de thumbnails (opcional - desktop) */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-950'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={example.after}
                alt={example.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate">
                {example.title}
              </span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#restaurar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
          >
            <span>Restaurar Minha Foto</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
