/**
 * Gera um código único no formato: REST-XXXX-XXXX
 * Usa caracteres alfanuméricos fáceis de ler (sem 0, O, I, L)
 */
export function generateUniqueCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  
  const generateSegment = (length: number): string => {
    let segment = '';
    for (let i = 0; i < length; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };

  const segment1 = generateSegment(4);
  const segment2 = generateSegment(4);
  
  return `REST-${segment1}-${segment2}`;
}

/**
 * Valida o formato do código
 */
export function isValidCodeFormat(code: string): boolean {
  const pattern = /^REST-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Formata o código para exibição e armazenamento (SEMPRE UPPERCASE)
 */
export function formatCode(code: string): string {
  // Remove espaços e converte para uppercase
  let formatted = code.toUpperCase().trim();
  
  // Se não começa com REST-, adiciona
  if (!formatted.startsWith('REST-')) {
    // Remove caracteres não alfanuméricos
    const clean = formatted.replace(/[^A-Z0-9]/g, '');
    
    // Formata como REST-XXXX-XXXX
    if (clean.length >= 8) {
      formatted = `REST-${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
    } else if (clean.length >= 4) {
      formatted = `REST-${clean.slice(0, 4)}-${clean.slice(4)}`;
    } else {
      formatted = `REST-${clean}`;
    }
  }
  
  return formatted;
}

/**
 * Calcula data de expiração (1 ano a partir de agora)
 */
export function calculateExpirationDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}
