export enum RestorationMode {
  AUTO = 'Automático',
  BW = 'Preto e Branco',
  SEPIA = 'Sépia',
  REPAIR_ONLY = 'Apenas Reparar',
  VIBRANT = 'Mais Saturado',
  NATURAL = 'Mais Natural'
}

export interface RestorationResult {
  originalImage: string; // Base64
  restoredImage: string | null; // Base64
  textAnalysis: string | null;
  processingTime: number;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  errorMessage?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}