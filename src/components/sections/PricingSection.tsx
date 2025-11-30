import React, { useState } from 'react';
import { Check, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CodeDisplay } from '@/components/features/CodeDisplay';
import { PRICING_PLANS, PricingPlan } from '@/constants/pricing';
import { validateEmail } from '@/lib/validation';

interface PricingSectionProps {
  onBuyCredits: (email: string, amount: number, packageName: string) => Promise<string | null>;
}

export function PricingSection({ onBuyCredits }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setEmail('');
    setEmailError(null);
    setGeneratedCode(null);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setEmail('');
    setEmailError(null);
    setGeneratedCode(null);
    setIsProcessing(false);
  };

  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) return;

    // Validar email
    if (!validateEmail(email)) {
      setEmailError('Digite um email válido');
      return;
    }

    setEmailError(null);
    setIsProcessing(true);

    try {
      // Importar a função de criar pagamento
      const { apiCreatePayment } = await import('@/lib/api');
      
      // Criar preferência de pagamento no Mercado Pago
      const result = await apiCreatePayment(selectedPlan.id, email);
      
      if (result.success && result.data) {
        // Redirecionar para página de pagamento do Mercado Pago
        // Use sandboxInitPoint para testes, initPoint para produção
        const paymentUrl = result.data.initPoint || result.data.sandboxInitPoint;
        
        console.log('🔗 Redirecionando para Mercado Pago:', paymentUrl);
        
        // Salvar email no localStorage para recuperar depois
        localStorage.setItem('pending_payment_email', email);
        localStorage.setItem('pending_payment_package', selectedPlan.id);
        
        // Redirecionar
        window.location.href = paymentUrl;
      } else {
        setEmailError(result.error || 'Erro ao processar pagamento');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      setEmailError('Erro ao processar pagamento');
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    handleCloseModal();
    // Scroll para seção de upload
    document.getElementById('restaurar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section id="precos" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full text-violet-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Preços Acessíveis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Escolha seu Pacote
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pague apenas pelo que usar. Sem mensalidades ou taxas escondidas.
              Créditos válidos por 1 ano.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-900/50 rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-violet-500 shadow-lg shadow-violet-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-amber-500 rounded-full text-sm font-semibold text-white">
                    ⭐ Mais Popular
                  </div>
                )}

                {/* Plan Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400 text-xl">R$</span>
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">pagamento único</p>
                </div>

                {/* Credits */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  {plan.credits} créditos {plan.bonus > 0 && `+ ${plan.bonus} bônus`}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                      <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Comprar Agora
                </Button>
              </div>
            ))}
          </div>

          {/* Free Trial Banner */}
          <div className="mt-16 bg-gradient-to-r from-violet-500/10 to-amber-500/10 border border-violet-500/20 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 rounded-full text-sm font-bold text-black mb-4">
              🎁 OFERTA ESPECIAL
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ainda não decidiu? Teste Grátis!
            </h3>
            <p className="text-gray-400 mb-6">
              Experimente 2 restaurações gratuitas com marca d'água e veja a qualidade antes de comprar
            </p>
            <a href="#restaurar">
              <Button variant="primary" size="lg">
                Testar Agora - É Grátis
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Modal de Compra */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={handleCloseModal}
        size="md"
      >
        {generatedCode ? (
          <CodeDisplay
            code={generatedCode}
            credits={(selectedPlan?.credits || 0) + (selectedPlan?.bonus || 0)}
            email={email}
            onContinue={handleContinue}
          />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedPlan?.name}
              </h3>
              <p className="text-gray-400">
                {(selectedPlan?.credits || 0) + (selectedPlan?.bonus || 0)} créditos por R${selectedPlan?.price}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitPurchase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seu email (para receber o código)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(null);
                    }}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-red-400 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-400">
                <p>📧 Você receberá um código único por email</p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isProcessing}
                >
                  {isProcessing ? 'Processando...' : `Pagar R$${selectedPlan?.price}`}
                </Button>
              </div>

              {/* DESENVOLVIMENTO - Botão de simulação (apenas em modo dev) */}
              {import.meta.env.DEV && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2 text-center">🧪 Modo desenvolvimento:</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      if (!selectedPlan) return;
                      if (!email || !email.includes('@')) {
                        setEmailError('Digite um email válido');
                        return;
                      }
                      setIsProcessing(true);
                      setEmailError(null);
                      
                      try {
                        const response = await fetch('http://localhost:3001/api/payment/simulate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            packageId: selectedPlan.id, 
                            email: email 
                          }),
                        });
                        const result = await response.json();
                        
                        if (result.success && result.data) {
                          setGeneratedCode(result.data.code);
                        } else {
                          setEmailError(result.error || 'Erro na simulação');
                        }
                      } catch (error) {
                        setEmailError('Erro de conexão com o servidor');
                      }
                      
                      setIsProcessing(false);
                    }}
                    disabled={isProcessing}
                  >
                    🧪 Simular Pagamento (teste)
                  </Button>
                </div>
              )}
            </form>
          </div>
        )}
      </Modal>
    </>
  );
}
