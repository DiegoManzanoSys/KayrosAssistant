import { useState } from 'react';
import { textToBullets } from '@/lib/api/endpoints';
import { ApiErrorResponse } from '@/lib/api/types';

interface UseBulletsResult {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  convert: (text?: string, file?: File) => Promise<void>;
  reset: () => void;
}

export const useBullets = (): UseBulletsResult => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async (text?: string, file?: File) => {
    if (!text && !file) {
      setError('Debes proporcionar texto o un archivo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await textToBullets({ text, file });
      setResult(response.result);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al convertir a bullets');
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
    convert,
    reset,
  };
};
