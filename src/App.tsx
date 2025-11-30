import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExamplesSection } from '@/components/sections/ExamplesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { UploadSection } from '@/components/sections/UploadSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { CodeStatus } from '@/components/features/CodeStatus';
import { Toast, useToast } from '@/components/ui/Toast';
import { useCredits } from '@/hooks/useCredits';

export default function App() {
  const { 
    credits, 
    totalCredits, 
    hasActiveCode,
    activeCodeCredits,
    useCredit, 
    activateCode,
    deactivateCode,
    addCreditsWithCode 
  } = useCredits();
  
  const { toast, showToast, hideToast } = useToast();

  const handleBuyCredits = async (email: string, amount: number, packageName: string): Promise<string | null> => {
    const code = await addCreditsWithCode(email, amount, packageName);
    if (code) {
      showToast(`${packageName} adquirido! Código: ${code}`, 'success');
    } else {
      showToast('Erro ao processar compra', 'error');
    }
    return code;
  };

  const handleActivateCode = async (code: string) => {
    const result = await activateCode(code);
    if (result.success) {
      showToast(`Código ativado! ${result.credits} créditos disponíveis`, 'success');
    }
    return result;
  };

  const handleDeactivateCode = () => {
    deactivateCode();
    showToast('Código desconectado', 'info');
  };

  const handleRestoreComplete = (hasWatermark: boolean) => {
    if (hasWatermark) {
      showToast('Foto restaurada! Adquira créditos para remover marca d\'água', 'info');
    } else {
      showToast('Foto restaurada com sucesso!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header 
        credits={totalCredits}
        hasActiveCode={hasActiveCode}
        activeCode={credits.code}
        onActivateCode={handleActivateCode}
      />
      
      <main>
        <HeroSection />
        <ExamplesSection />
        <HowItWorksSection />
        
        {/* Status do Código Ativo */}
        {hasActiveCode && credits.code && (
          <div className="max-w-3xl mx-auto px-4 -mt-8 mb-8">
            <CodeStatus
              code={credits.code}
              credits={activeCodeCredits}
              onDeactivate={handleDeactivateCode}
            />
          </div>
        )}
        
        <UploadSection 
          credits={credits}
          totalCredits={totalCredits}
          onUseCredit={useCredit}
          onRestoreComplete={handleRestoreComplete}
        />
        <FeaturesSection />
        <PricingSection onBuyCredits={handleBuyCredits} />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
