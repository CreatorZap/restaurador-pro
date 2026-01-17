import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Download, Loader2, AlertCircle, CheckCircle2, LogIn } from 'lucide-react';
import { restoreImage, fileToBase64 } from '../../services/geminiService';
import { RestorationMode, RestorationResult } from '../../types';
import { addWatermark } from '../../lib/watermark';
import { LocalCredits } from '@/types/credits';
import { useAuth } from '@/contexts/AuthContext';

interface UploadSectionProps {
  credits: LocalCredits;
  totalCredits: number;
  onUseCredit: () => Promise<{ success: boolean; hasWatermark: boolean }>;
  onRestoreComplete: (hasWatermark: boolean) => void;
  onOpenLogin: () => void;
}

export function UploadSection({ credits, totalCredits, onUseCredit, onRestoreComplete, onOpenLogin }: UploadSectionProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<RestorationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 handleFileSelect triggered');
    const file = e.target.files?.[0];
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    console.log('📁 File:', file.name, file.type, file.size);

    // Verificar se usuário está logado
    if (!user) {
      console.log('❌ Usuário não logado');
      onOpenLogin();
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Verificar créditos
    if (totalCredits <= 0) {
      console.log('❌ Sem créditos');
      setErrorMsg('Você não tem créditos. Adquira um pacote para continuar.');
      setStatus('error');
      return;
    }

    console.log('💳 Usando crédito...');
    const creditResult = await onUseCredit();
    console.log('💳 Resultado:', creditResult);

    if (!creditResult.success) {
      console.log('❌ Falha ao usar crédito');
      document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      console.log('🔄 Iniciando processamento...');
      setStatus('processing');

      console.log('📸 Convertendo para base64...');
      const base64 = await fileToBase64(file);
      console.log('✅ Base64 convertido');

      console.log('🤖 Chamando API Gemini...');
      const { text, image } = await restoreImage(base64, RestorationMode.AUTO, file.type);
      console.log('🤖 Resposta recebida:', { hasText: !!text, hasImage: !!image });

      if (!image) {
        console.log('❌ Imagem não gerada');
        throw new Error("Falha ao gerar imagem.");
      }

      let restoredImageUrl = `data:image/jpeg;base64,${image}`;

      // Adicionar marca d'água se for crédito gratuito
      if (creditResult.hasWatermark) {
        console.log('🔖 Adicionando marca d\'água...');
        restoredImageUrl = await addWatermark(restoredImageUrl);
        console.log('✅ Marca d\'água adicionada');
      }

      console.log('✅ Restauração completa!');
      setResult({
        originalImage: `data:${file.type};base64,${base64}`,
        restoredImage: restoredImageUrl,
        textAnalysis: text,
        processingTime: 0
      });
      setStatus('complete');
      onRestoreComplete(creditResult.hasWatermark);

    } catch (err: any) {
      console.error('❌ Erro:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Ocorreu um erro ao restaurar a imagem. Tente novamente.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadClick = () => {
    // Se não está logado, abrir modal de login
    if (!user) {
      onOpenLogin();
      return;
    }

    // Se está logado mas sem créditos, ir para preços
    if (totalCredits <= 0) {
      document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Se está logado e tem créditos, abrir seletor de arquivo
    fileInputRef.current?.click();
  };

  return (
    <section id="restaurar" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-6">
            <Sparkles size={14} />
            {user ? (totalCredits > 0 ? `${totalCredits} Créditos Disponíveis` : 'Sem Créditos') : 'Faça login para começar'}
          </span>
          <h2 className="text-4xl font-black text-white mb-4">Restaure Sua Foto Agora</h2>
          <p className="text-zinc-400">
            {user ? 'Teste grátis e veja a magia acontecer em segundos' : 'Entre com sua conta e ganhe 2 restaurações grátis'}
          </p>
        </div>

        <div className="bg-white/5 border-2 border-dashed border-violet-500/30 rounded-3xl p-10 md:p-16 transition-all hover:border-violet-500 hover:bg-violet-500/5 relative overflow-hidden group">

          {/* Idle State */}
          {status === 'idle' && (
            <div
              onClick={handleUploadClick}
              className="cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform duration-300">
                {user ? <Camera size={32} /> : <LogIn size={32} />}
              </div>

              {user ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-3">Arraste sua foto aqui</h3>
                  <p className="text-zinc-400 mb-8">ou clique para selecionar do seu dispositivo</p>
                  <div className="flex justify-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <span className="bg-white/5 px-3 py-1 rounded">JPG</span>
                    <span className="bg-white/5 px-3 py-1 rounded">PNG</span>
                    <span className="bg-white/5 px-3 py-1 rounded">WEBP</span>
                  </div>

                  {totalCredits <= 0 && (
                    <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 font-bold">
                      ⚠️ Você precisa de mais créditos. Clique para ver pacotes.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-3">Entre para começar</h3>
                  <p className="text-zinc-400 mb-8">Crie sua conta grátis e ganhe 2 restaurações</p>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl font-bold hover:from-violet-500 hover:to-violet-600 transition-all">
                    <LogIn size={20} />
                    Entrar / Criar conta
                  </button>
                </>
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
              <button onClick={reset} className="px-6 py-2 bg-zinc-800 text-white rounded-lg font-bold hover:bg-zinc-700">
                Tentar Novamente
              </button>
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

        {user && credits.free > 0 && (
          <div className="mt-6 flex justify-center items-center gap-2 text-amber-500 text-sm font-medium bg-amber-500/10 inline-flex px-4 py-2 rounded-lg border border-amber-500/20">
            <AlertCircle size={16} />
            Versão gratuita inclui marca d'água. Adquira créditos para remover.
          </div>
        )}
      </div>
    </section>
  );
}
