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
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center animate-fadeIn">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg mx-auto transform hover:scale-110 transition-transform duration-300">
            📄
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Resumir Documentos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sube un archivo PDF o DOCX y genera un resumen inteligente con IA en segundos
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
