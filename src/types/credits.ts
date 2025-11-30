export interface CreditCode {
  code: string;
  email: string;
  creditsTotal: number;
  creditsUsed: number;
  createdAt: string;
  expiresAt: string;
  packageName: string;
  isActive: boolean;
}

export interface ValidateCodeResponse {
  valid: boolean;
  code?: CreditCode;
  error?: string;
}

export interface UseCodeCreditResponse {
  success: boolean;
  creditsRemaining?: number;
  error?: string;
}

export interface CreateCodeRequest {
  email: string;
  packageId: string;
  credits: number;
  packageName: string;
}

export interface LocalCredits {
  free: number;
  code: string | null;
  codeCredits: number;
  isPaidUser: boolean;
}
