'use client';

import { Card } from '@/components/ui/Card';
import { useCompare } from '@/hooks/useCompare';
import { CompareForm } from '@/components/features/Compare/CompareForm';
import { CompareResult } from '@/components/features/Compare/CompareResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ComparePage() {
  const { result, isLoading, error, compare, reset } = useCompare();

  const handleCompare = async (texts: string[]) => {
    await compare(texts);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚖️ Comparar Textos</h1>
        <p className="mt-2 text-gray-600">
          Analiza similitudes, diferencias y temas comunes entre múltiples textos
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Comparando textos y analizando diferencias...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <CompareResult result={result} onReset={reset} />
      ) : (
        <Card>
          <CompareForm onSubmit={handleCompare} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
