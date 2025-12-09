'use client';

import { Card } from '@/components/ui/Card';
import { useQuestion } from '@/hooks/useQuestion';
import { QuestionForm } from '@/components/features/Question/QuestionForm';
import { QuestionResult } from '@/components/features/Question/QuestionResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function QuestionPage() {
  const { result, isLoading, error, ask, reset } = useQuestion();

  const handleAsk = async (context: string, question: string) => {
    await ask(context, question);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💬 Preguntas y Respuestas</h1>
        <p className="mt-2 text-gray-600">
          Haz preguntas sobre un texto y obtén respuestas basadas en su contenido
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Analizando contexto y generando respuesta...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <QuestionResult result={result} onReset={reset} />
      ) : (
        <Card>
          <QuestionForm onSubmit={handleAsk} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
