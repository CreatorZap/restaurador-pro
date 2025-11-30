import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  Download, 
  Cpu, 
  CheckCircle2, 
  MoveHorizontal, 
  Wrench, 
  Palette, 
  User, 
  Shirt, 
  Zap, 
  Star, 
  Gift, 
  Loader2, 
  AlertCircle, 
  Trash2,
  Check,
  X,
  Menu
} from './components/Icons';
import { restoreImage, fileToBase64 } from './services/geminiService';
import { RestorationMode, RestorationResult } from './types';

// --- Sub-components for the Landing Page ---

const Header = ({ credits }: { credits: number }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'py-4 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 text-2xl font-extrabold text-white no-underline relative z-50" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Camera size={20} />
            </div>
            FotoRestore AI
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <button onClick={() => scrollTo('como-funciona')} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Como Funciona</button>
            <button onClick={() => scrollTo('exemplos')} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Exemplos</button>
            <button onClick={() => scrollTo('precos')} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Preços</button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="font-bold text-emerald-500">{credits}</span>
              <span className="text-emerald-500/80">créditos grátis</span>
            </div>
          </nav>

          <div className="hidden md:flex">
             <button onClick={() => scrollTo('restaurar')} className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 transition-all">
              Restaurar Agora
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-50 p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#0F0F0F] z-40 flex flex-col justify-center items-center gap-8 animate-in fade-in slide-in-from-top-10 duration-200">
             <nav className="flex flex-col gap-8 text-center text-xl font-medium">
              <button onClick={() => scrollTo('como-funciona')} className="text-zinc-400 hover:text-white">Como Funciona</button>
              <button onClick={() => scrollTo('exemplos')} className="text-zinc-400 hover:text-white">Exemplos</button>
              <button onClick={() => scrollTo('precos')} className="text-zinc-400 hover:text-white">Preços</button>
            </nav>
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm">
                <Sparkles size={14} className="text-emerald-500" />
                <span className="font-bold text-emerald-500">{credits}</span>
                <span className="text-emerald-500/80">créditos</span>
              </div>
              <button onClick={() => scrollTo('restaurar')} className="px-8 py-4 bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-600/30">
                Restaurar Agora
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Hero = () => (
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

const ComparisonCard = ({ before, after, label, description }: { before: string, after: string, label: string, description: string }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pos)));
  };

  return (
    <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 group">
      <div 
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden cursor-col-resize select-none"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        <img src={after} alt="Depois" className="absolute inset-0 w-full h-full object-cover" />
        <div 
          className="absolute inset-0 border-r-2 border-violet-500 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img src={before} alt="Antes" className="absolute inset-0 w-full h-full object-cover grayscale sepia-[.3]" />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full text-xs font-bold text-white">Antes</div>
        </div>
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-violet-600/90 backdrop-blur rounded-full text-xs font-bold text-white">Depois</div>
        
        {/* Slider Handle */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50 z-20 pointer-events-none"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        >
          <MoveHorizontal size={20} className="text-white" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2">{label}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
};

const ExamplesSection = () => (
  <section id="exemplos" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Resultados Reais</span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Veja a Transformação</h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Resultados reais de fotos restauradas pela nossa IA. Arraste para comparar.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ComparisonCard 
          before="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
          after="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800"
          label="Retrato de Família - 1952"
          description="Rasgos, manchas de água e desbotamento completamente removidos"
        />
        <ComparisonCard 
          before="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
          after="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
          label="Foto de Casamento - 1968"
          description="Colorização realista e restauração de detalhes perdidos"
        />
        <ComparisonCard 
          before="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800"
          after="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800"
          label="Retrato do Avô - 1945"
          description="Manchas de fungo removidas, contraste e cores restaurados"
        />
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
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
        
        {[
          { icon: <Upload size={32} />, title: "Envie sua Foto", text: "Faça upload da foto antiga. Aceita JPG, PNG e fotos de celular." },
          { icon: <Cpu size={32} />, title: "IA Processa", text: "Nossa IA analisa e restaura automaticamente: remove danos e coloriza." },
          { icon: <Download size={32} />, title: "Baixe em HD", text: "Receba sua foto restaurada em alta resolução, pronta para imprimir." }
        ].map((step, i) => (
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

// --- The Functional Upload Section (Gemini Integration) ---

const UploadSection = ({ 
  credits, 
  onRestorationComplete 
}: { 
  credits: number, 
  onRestorationComplete: () => void 
}) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<RestorationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (credits <= 0) {
      // Smooth scroll to pricing
      document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      // API Key Check
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // Open selection dialog
          await window.aistudio.openSelectKey();
          // We proceed immediately assuming the user selected a key or the dialog handled it.
          // If the user cancelled, the next API call will likely fail, which is handled in catch block.
        }
      }

      setStatus('processing');
      const base64 = await fileToBase64(file);
      
      // Call Gemini API
      const { text, image } = await restoreImage(base64, RestorationMode.AUTO, file.type);
      
      if (!image) throw new Error("Falha ao gerar imagem.");

      setResult({
        originalImage: `data:${file.type};base64,${base64}`,
        restoredImage: `data:image/jpeg;base64,${image}`,
        textAnalysis: text,
        processingTime: 0
      });
      setStatus('complete');
      onRestorationComplete();
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      
      // Friendly error message for permission issues
      if (err.toString().includes('403') || err.toString().includes('permission')) {
         setErrorMsg('Erro de permissão: Por favor, verifique se selecionou uma chave de API válida com acesso ao Gemini Pro.');
      } else {
         setErrorMsg('Ocorreu um erro ao restaurar a imagem. Tente novamente.');
      }
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="restaurar" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-6">
            <Sparkles size={14} />
            {credits > 0 ? `${credits} Restaurações Grátis` : 'Sem Créditos'}
          </span>
          <h2 className="text-4xl font-black text-white mb-4">Restaure Sua Foto Agora</h2>
          <p className="text-zinc-400">Teste grátis e veja a magia acontecer em segundos</p>
        </div>

        <div className="bg-white/5 border-2 border-dashed border-violet-500/30 rounded-3xl p-10 md:p-16 transition-all hover:border-violet-500 hover:bg-violet-500/5 relative overflow-hidden group">
          
          {/* Idle State */}
          {status === 'idle' && (
            <div 
              onClick={() => {
                  if (credits > 0) {
                      fileInputRef.current?.click();
                  } else {
                      document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
                  }
              }}
              className="cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform duration-300">
                <Camera size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Arraste sua foto aqui</h3>
              <p className="text-zinc-400 mb-8">ou clique para selecionar do seu dispositivo</p>
              <div className="flex justify-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <span className="bg-white/5 px-3 py-1 rounded">JPG</span>
                <span className="bg-white/5 px-3 py-1 rounded">PNG</span>
                <span className="bg-white/5 px-3 py-1 rounded">WEBP</span>
              </div>
              
              {credits <= 0 && (
                  <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 font-bold">
                      ⚠️ Você precisa de mais créditos. Clique para ver pacotes.
                  </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {status === 'processing' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center text-violet-400 mx-auto mb-6 animate-pulse">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Processando sua foto...</h3>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">Nossa IA está analisando danos, removendo manchas e restaurando as cores originais.</p>
              <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-amber-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '50%' }}></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'complete' && result && (
            <div className="animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Restauração Concluída!</h3>
              <p className="text-zinc-400 mb-8">Sua memória foi trazida de volta à vida</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                 <div className="space-y-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Original</p>
                    <img src={result.originalImage} alt="Original" className="rounded-xl border border-white/10 w-full h-64 object-contain bg-black/50" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-500 uppercase">Restaurada</p>
                    <img src={result.restoredImage || ''} alt="Restaurada" className="rounded-xl border border-emerald-500/30 w-full h-64 object-contain bg-black/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]" />
                 </div>
              </div>

              {result.textAnalysis && (
                  <div className="bg-white/5 rounded-xl p-6 text-left mb-8 max-w-2xl mx-auto border border-white/10 text-sm text-zinc-300 whitespace-pre-line">
                      {result.textAnalysis}
                  </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href={result.restoredImage || '#'} 
                  download={`restaurada_${Date.now()}.jpg`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
                >
                  <Download size={18} />
                  Baixar Resultado
                </a>
                <button 
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                >
                  <Camera size={18} />
                  Nova Restauração
                </button>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {status === 'error' && (
             <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                   <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ops, algo deu errado</h3>
                <p className="text-zinc-400 mb-6">{errorMsg}</p>
                <div className="flex gap-4">
                  <button onClick={() => window.aistudio?.openSelectKey().then(() => fileInputRef.current?.click())} className="px-6 py-2 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500">
                    Trocar Chave API
                  </button>
                  <button onClick={reset} className="px-6 py-2 bg-zinc-800 text-white rounded-lg font-bold hover:bg-zinc-700">
                    Tentar Novamente
                  </button>
                </div>
             </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <div className="mt-6 flex justify-center items-center gap-2 text-amber-500 text-sm font-medium bg-amber-500/10 inline-flex px-4 py-2 rounded-lg border border-amber-500/20">
          <AlertCircle size={16} />
          Versão gratuita inclui marca d'água sutil. Adquira créditos para remover.
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-[#0F0F0F] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-colors group">
    <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-6 group-hover:bg-violet-500 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const PricingCard = ({ 
  title, 
  price, 
  desc, 
  credits, 
  features, 
  featured = false,
  onBuy
}: { 
  title: string, 
  price: number, 
  desc: string, 
  credits: string, 
  features: string[], 
  featured?: boolean,
  onBuy: () => void
}) => (
  <div className={`relative p-10 rounded-3xl border ${featured ? 'bg-[#1A1A1A] border-violet-500 shadow-2xl shadow-violet-900/20' : 'bg-[#1A1A1A] border-white/5'} transition-transform hover:-translate-y-2`}>
    {featured && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
        ⭐ Mais Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 text-sm mb-6">{desc}</p>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-2xl text-zinc-500 font-semibold">R$</span>
      <span className="text-5xl font-black text-white">{price}</span>
    </div>
    <p className="text-zinc-500 text-sm mb-6">pagamento único</p>
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-bold mb-8">
      <Sparkles size={14} />
      {credits}
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
            <Check size={12} strokeWidth={3} />
          </div>
          {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onBuy}
      className={`w-full py-4 rounded-xl font-bold transition-all ${featured ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
    >
      Comprar Agora
    </button>
  </div>
);

const TestimonialCard = ({ quote, author, location, initial }: { quote: string, author: string, location: string, initial: string }) => (
  <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-white/5">
    <div className="flex gap-1 text-amber-500 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
    </div>
    <p className="text-zinc-300 leading-relaxed mb-6">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {initial}
      </div>
      <div>
        <div className="font-bold text-white">{author}</div>
        <div className="text-xs text-zinc-500">{location}</div>
      </div>
    </div>
  </div>
);

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  packageName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  amount: number, 
  packageName: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full border border-emerald-500/30 shadow-2xl shadow-emerald-900/20 relative animate-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <CheckCircle2 size={40} />
        </div>
        
        <h3 className="text-2xl font-black text-center text-white mb-2">Compra Realizada!</h3>
        <p className="text-center text-zinc-400 mb-6">
          Você adquiriu o <strong>{packageName}</strong> com sucesso.<br/>
          <span className="text-emerald-400 font-bold">{amount} créditos</span> foram adicionados à sua conta.
        </p>
        
        <button 
          onClick={() => {
            onClose();
            document.getElementById('restaurar')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
        >
          Continuar Restaurando
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [credits, setCredits] = useState(2);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean, amount: number, packageName: string }>({
    isOpen: false,
    amount: 0,
    packageName: ''
  });

  const handleRestorationComplete = () => {
    setCredits(prev => Math.max(0, prev - 1));
  };

  const handleBuyCredits = (amount: number, packageName: string) => {
    // Simulate API call/processing
    setTimeout(() => {
      setCredits(prev => prev + amount);
      setSuccessModal({ isOpen: true, amount, packageName });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-zinc-100 font-sans selection:bg-violet-500/30">
      
      <Header credits={credits} />
      
      <main>
        <Hero />
        
        <ExamplesSection />
        
        <HowItWorks />
        
        <UploadSection 
          credits={credits} 
          onRestorationComplete={handleRestorationComplete} 
        />
        
        {/* Features Grid */}
        <section className="py-24 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Tecnologia de Ponta</span>
              <h2 className="text-4xl font-black text-white mb-4">Recursos Avançados</h2>
              <p className="text-zinc-400">Nossa IA foi treinada com milhões de fotos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<Wrench size={24} />} title="Reparo de Danos" desc="Remove rasgos, dobras, manchas de água, fungos e arranhões automaticamente." />
              <FeatureCard icon={<Palette size={24} />} title="Colorização Realista" desc="Adiciona cores naturais e vibrantes a fotos em preto e branco ou sépia." />
              <FeatureCard icon={<Sparkles size={24} />} title="Melhoria de Qualidade" desc="Aumenta resolução e nitidez para qualidade de câmera profissional moderna." />
              <FeatureCard icon={<User size={24} />} title="Preservação de Identidade" desc="Mantém traços faciais, expressões e características originais intactas." />
              <FeatureCard icon={<Shirt size={24} />} title="Fidelidade Histórica" desc="Preserva roupas, acessórios e contexto da época fielmente." />
              <FeatureCard icon={<Zap size={24} />} title="Processamento Rápido" desc="Resultados em menos de 30 segundos, sem espera." />
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section id="precos" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Preços Acessíveis</span>
              <h2 className="text-4xl font-black text-white mb-4">Escolha seu Pacote</h2>
              <p className="text-zinc-400">Pague apenas pelo que usar. Sem mensalidades.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard 
                title="Pacote Inicial" 
                price={19} 
                credits="10 créditos" 
                desc="Perfeito para testar o serviço"
                features={["10 restaurações completas", "Download sem marca d'água", "Alta resolução (até 4K)", "Créditos não expiram"]} 
                onBuy={() => handleBuyCredits(10, 'Pacote Inicial')}
              />
              <PricingCard 
                title="Pacote Família" 
                price={49} 
                credits="30 créditos + 5 bônus" 
                desc="Ideal para álbuns de família" 
                featured={true}
                features={["35 restaurações completas", "Download sem marca d'água", "Prioridade no processamento", "Suporte prioritário", "Créditos não expiram"]}
                onBuy={() => handleBuyCredits(35, 'Pacote Família')}
              />
              <PricingCard 
                title="Pacote Profissional" 
                price={99} 
                credits="80 créditos + 20 bônus" 
                desc="Para fotógrafos e empresas"
                features={["100 restaurações completas", "Download sem marca d'água", "Resolução máxima (até 8K)", "Uso comercial permitido", "Suporte VIP 24h"]}
                onBuy={() => handleBuyCredits(100, 'Pacote Profissional')}
              />
            </div>

            {/* Free Trial Banner */}
            <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-violet-900/20 to-amber-900/20 border border-violet-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-lg">🎁 OFERTA ESPECIAL</span>
                <h3 className="text-3xl font-black text-white mb-4">Ainda não decidiu? Teste Grátis!</h3>
                <p className="text-zinc-300 mb-8 max-w-lg mx-auto">Experimente 2 restaurações gratuitas com marca d'água e veja a qualidade antes de comprar.</p>
                <a href="#restaurar" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                  <Sparkles size={18} className="text-violet-600" />
                  Testar Agora - É Grátis
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-violet-400 font-bold tracking-wider text-sm uppercase bg-violet-500/10 px-4 py-2 rounded-full mb-4 inline-block">Depoimentos</span>
              <h2 className="text-4xl font-black text-white mb-4">O Que Nossos Clientes Dizem</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="Restaurei a única foto do meu avô que sobreviveu a uma enchente. Estava toda manchada e rasgada. O resultado me fez chorar de emoção. Valeu cada centavo!"
                author="Maria Fernanda"
                location="São Paulo, SP"
                initial="MF"
              />
              <TestimonialCard 
                quote="Sou fotógrafo e agora ofereço restauração como serviço extra. A qualidade é impressionante e meus clientes ficam encantados. Já recuperei o investimento!"
                author="Ricardo Santos"
                location="Rio de Janeiro, RJ"
                initial="RS"
              />
              <TestimonialCard 
                quote="Restaurei o álbum de casamento dos meus pais dos anos 70. Ver as fotos coloridas e restauradas foi como voltar no tempo. Presente perfeito!"
                author="Ana Luíza"
                location="Belo Horizonte, MG"
                initial="AL"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
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

      </main>

      <footer className="py-12 border-t border-white/5 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
              <Camera size={16} />
            </div>
            FotoRestore AI
          </div>
          <nav className="flex gap-8 text-zinc-500 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </nav>
          <div className="text-zinc-600 text-sm">
            © 2024 FotoRestore AI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
      
      <SuccessModal 
        isOpen={successModal.isOpen} 
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        amount={successModal.amount}
        packageName={successModal.packageName}
      />
    </div>
  );
};

export default App;