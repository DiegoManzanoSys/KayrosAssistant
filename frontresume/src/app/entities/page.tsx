'use client';

import { Card } from '@/components/ui/Card';
import { useEntities } from '@/hooks/useEntities';
import { EntitiesForm } from '@/components/features/Entities/EntitiesForm';
import { EntitiesResult } from '@/components/features/Entities/EntitiesResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EntitiesPage() {
  const { result, isLoading, error, extract, reset } = useEntities();

  const handleExtract = async (text?: string, file?: File) => {
    await extract(text, file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏷️ Extraer Entidades Nombradas</h1>
        <p className="mt-2 text-gray-600">
          Identifica personas, lugares, organizaciones, fechas y otros elementos importantes
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Analizando texto y extrayendo entidades...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <EntitiesResult result={result} onReset={reset} />
      ) : (
        <Card>
          <EntitiesForm onSubmit={handleExtract} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
