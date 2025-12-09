'use client';

import React from 'react';
import { SummarizeForm } from '@/components/features/Summarize/SummarizeForm';
import { SummarizeResult } from '@/components/features/Summarize/SummarizeResult';
import { useSummarize } from '@/hooks/useSummarize';
import { SummaryType } from '@/lib/api/types';

export default function SummarizePage() {
  const { summarize, isLoading, error, result, reset } = useSummarize();

  const handleSubmit = async (file: File, summaryType: SummaryType, maxTokens: number) => {
    try {
      await summarize({ file, summary_type: summaryType, max_tokens: maxTokens });
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Resumir Documentos
        </h1>
        <p className="text-gray-600">
          Sube un archivo PDF o DOCX y genera un resumen inteligente con IA
        </p>
      </div>

      {!result ? (
        <SummarizeForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <SummarizeResult result={result} onReset={reset} />
      )}
    </div>
  );
}
