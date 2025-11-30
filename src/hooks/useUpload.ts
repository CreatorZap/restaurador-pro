import { useState, useCallback } from 'react';

interface UploadState {
  file: File | null;
  preview: string | null;
  error: string | null;
  isLoading: boolean;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use JPG, PNG ou WEBP.' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Arquivo muito grande. Máximo 10MB.' };
  }
  return { valid: true };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    error: null,
    isLoading: false
  });

  const handleFile = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, error: null, isLoading: true }));

    const validation = validateFile(file);
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.error!, isLoading: false }));
      return null;
    }

    try {
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);
      
      setState({
        file,
        preview,
        error: null,
        isLoading: false
      });

      return { file, base64, preview };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao processar imagem', 
        isLoading: false 
      }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    setState({
      file: null,
      preview: null,
      error: null,
      isLoading: false
    });
  }, [state.preview]);

  return { ...state, handleFile, reset };
}
