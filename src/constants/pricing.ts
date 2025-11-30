export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  bonus: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Pacote Inicial',
    description: 'Perfeito para testar o serviço',
    price: 19,
    credits: 10,
    bonus: 0,
    features: [
      '10 restaurações completas',
      'Download sem marca d\'água',
      'Alta resolução (até 4K)',
      'Colorização automática',
      'Créditos não expiram'
    ]
  },
  {
    id: 'family',
    name: 'Pacote Família',
    description: 'Ideal para álbuns de família',
    price: 49,
    credits: 30,
    bonus: 5,
    popular: true,
    features: [
      '35 restaurações completas',
      'Download sem marca d\'água',
      'Alta resolução (até 4K)',
      'Colorização automática',
      'Suporte prioritário',
      'Créditos não expiram'
    ]
  },
  {
    id: 'pro',
    name: 'Pacote Profissional',
    description: 'Para fotógrafos e empresas',
    price: 99,
    credits: 80,
    bonus: 20,
    features: [
      '100 restaurações completas',
      'Download sem marca d\'água',
      'Resolução máxima (até 8K)',
      'Colorização + P&B artístico',
      'Suporte prioritário 24h',
      'Uso comercial permitido'
    ]
  }
];
