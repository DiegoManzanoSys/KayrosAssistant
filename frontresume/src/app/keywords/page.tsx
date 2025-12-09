'use client';

import { Card } from '@/components/ui/Card';
import { useKeywords } from '@/hooks/useKeywords';
import { KeywordsForm } from '@/components/features/Keywords/KeywordsForm';
import { KeywordsResult } from '@/components/features/Keywords/KeywordsResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function KeywordsPage() {
  const { result, isLoading, error, extract, reset } = useKeywords();

  const handleExtract = async (text?: string, file?: File) => {
    await extract(text, file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🔑 Extraer Palabras Clave</h1>
        <p className="mt-2 text-gray-600">
          Identifica las palabras y frases más importantes de un texto o documento
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Analizando texto y extrayendo palabras clave...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <KeywordsResult result={result} onReset={reset} />
      ) : (
        <Card>
          <KeywordsForm onSubmit={handleExtract} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
