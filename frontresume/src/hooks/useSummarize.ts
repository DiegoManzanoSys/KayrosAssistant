'use client';

import { useState } from 'react';
import { summarizeDocument } from '@/lib/api/endpoints';
import { SummarizeRequest, SummarizeResponse } from '@/lib/api/types';
import { ApiErrorResponse } from '@/lib/api/types';

export const useSummarize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummarizeResponse | null>(null);

  const summarize = async (request: SummarizeRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await summarizeDocument(request);
      setResult(response);
      return response;
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setError(apiError.message || 'Error al procesar el documento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    summarize,
    isLoading,
    error,
    result,
    reset,
  };
};
