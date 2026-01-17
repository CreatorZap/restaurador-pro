export const VALIDATION = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MIN_DIMENSION: 100,
  MAX_DIMENSION: 8000
};

export interface ValidationError {
  field: string;
  message: string;
}

export function validateImage(file: File): ValidationError | null {
  if (!VALIDATION.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      field: 'file',
      message: `Formato não suportado. Use: ${VALIDATION.ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}` 
    };
  }

  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    const maxMB = VALIDATION.MAX_FILE_SIZE / (1024 * 1024);
    return {
      field: 'file',
      message: `Arquivo muito grande. Máximo: ${maxMB}MB` 
    };
  }

  return null;
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
