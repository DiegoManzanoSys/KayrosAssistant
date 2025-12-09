import { useState } from 'react';
import { analyzeTopics } from '@/lib/api/endpoints';
import { ApiErrorResponse } from '@/lib/api/types';

interface UseTopicsResult {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  analyze: (text?: string, file?: File, numTopics?: number) => Promise<void>;
  reset: () => void;
}

export const useTopics = (): UseTopicsResult => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (text?: string, file?: File, numTopics: number = 3) => {
    if (!text && !file) {
      setError('Debes proporcionar texto o un archivo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeTopics({ text, file, num_topics: numTopics });
      setResult(response.result);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al analizar tópicos');
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
    analyze,
    reset,
  };
};
