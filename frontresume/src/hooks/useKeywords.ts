import { useState } from 'react';
import { extractKeywords } from '@/lib/api/endpoints';
import { ApiErrorResponse } from '@/lib/api/types';

interface UseKeywordsResult {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  extract: (text?: string, file?: File) => Promise<void>;
  reset: () => void;
}

export const useKeywords = (): UseKeywordsResult => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = async (text?: string, file?: File) => {
    if (!text && !file) {
      setError('Debes proporcionar texto o un archivo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await extractKeywords({ text, file });
      setResult(response.result);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al extraer palabras clave');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    result,
    isLoading,
    error,
    extract,
    reset,
  };
};
