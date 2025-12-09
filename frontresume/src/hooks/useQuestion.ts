import { useState } from 'react';
import { askQuestion } from '@/lib/api/endpoints';
import { ApiErrorResponse } from '@/lib/api/types';

interface UseQuestionResult {
  result: string | null;
  isLoading: boolean;
  error: string | null;
  ask: (context: string, question: string) => Promise<void>;
  reset: () => void;
}

export const useQuestion = (): UseQuestionResult => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async (context: string, question: string) => {
    if (!context || !question) {
      setError('Debes proporcionar tanto el contexto como la pregunta');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await askQuestion({ text: context, question });
      setResult(response.result);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al procesar la pregunta');
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
    ask,
    reset,
  };
};
