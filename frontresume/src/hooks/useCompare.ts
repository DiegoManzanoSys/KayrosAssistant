import { useState } from 'react';
import { compareTexts } from '@/lib/api/endpoints';
import { ApiErrorResponse } from '@/lib/api/types';

interface UseCompareResult {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  compare: (texts: string[]) => Promise<void>;
  reset: () => void;
}

export const useCompare = (): UseCompareResult => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (texts: string[]) => {
    if (texts.length < 2) {
      setError('Debes proporcionar al menos 2 textos para comparar');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await compareTexts({ texts });
      setResult(response.result);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al comparar textos');
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
    compare,
    reset,
  };
};
