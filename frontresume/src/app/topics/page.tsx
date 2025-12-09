'use client';

import { Card } from '@/components/ui/Card';
import { useTopics } from '@/hooks/useTopics';
import { TopicsForm } from '@/components/features/Topics/TopicsForm';
import { TopicsResult } from '@/components/features/Topics/TopicsResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TopicsPage() {
  const { result, isLoading, error, analyze, reset } = useTopics();

  const handleAnalyze = async (text?: string, file?: File, numTopics?: number) => {
    await analyze(text, file, numTopics);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎯 Modelado de Tópicos</h1>
        <p className="mt-2 text-gray-600">
          Identifica los temas principales y su importancia en un texto o documento
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Analizando texto e identificando tópicos...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <TopicsResult result={result} onReset={reset} />
      ) : (
        <Card>
          <TopicsForm onSubmit={handleAnalyze} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
