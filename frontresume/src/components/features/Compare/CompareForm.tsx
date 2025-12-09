'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface CompareFormProps {
  onSubmit: (texts: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

export const CompareForm: React.FC<CompareFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = () => {
    const texts = [text1, text2, text3].filter(t => t.trim() !== '');
    
    if (texts.length < 2) {
      return;
    }
    
    onSubmit(texts);
  };

  const handleReset = () => {
    setText1('');
    setText2('');
    setText3('');
  };

  const isValid = text1.trim() !== '' && text2.trim() !== '';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Texto 1 */}
        <div>
          <label htmlFor="text1" className="block text-sm font-medium text-gray-700 mb-2">
            Texto 1 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Primer texto a comparar..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Texto 2 */}
        <div>
          <label htmlFor="text2" className="block text-sm font-medium text-gray-700 mb-2">
            Texto 2 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Segundo texto a comparar..."
            disabled={isLoading}
            required
          />
        </div>

        {/* Texto 3 (opcional) */}
        <div>
          <label htmlFor="text3" className="block text-sm font-medium text-gray-700 mb-2">
            Texto 3 <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea
            id="text3"
            value={text3}
            onChange={(e) => setText3(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tercer texto a comparar (opcional)..."
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Error general */}
      {error && <ErrorAlert message={error} />}

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !isValid}
        >
          {isLoading ? '🔄 Comparando...' : '🔍 Comparar Textos'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          Limpiar
        </Button>
      </div>
    </form>
  );
};
