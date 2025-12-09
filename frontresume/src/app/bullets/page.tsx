'use client';

import { Card } from '@/components/ui/Card';
import { useBullets } from '@/hooks/useBullets';
import { BulletsForm } from '@/components/features/Bullets/BulletsForm';
import { BulletsResult } from '@/components/features/Bullets/BulletsResult';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function BulletsPage() {
  const { result, isLoading, error, convert, reset } = useBullets();

  const handleConvert = async (text?: string, file?: File) => {
    await convert(text, file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📝 Texto a Bullets</h1>
        <p className="mt-2 text-gray-600">
          Convierte párrafos largos en listas de puntos claros y concisos
        </p>
      </div>

      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Convirtiendo texto a formato de bullets...</p>
            <p className="mt-2 text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </Card>
      ) : result ? (
        <BulletsResult result={result} onReset={reset} />
      ) : (
        <Card>
          <BulletsForm onSubmit={handleConvert} isLoading={isLoading} error={error} />
        </Card>
      )}
    </div>
  );
}
