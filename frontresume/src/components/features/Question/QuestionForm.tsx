'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema, QuestionFormData } from '@/lib/schemas/api-schemas';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface QuestionFormProps {
  onSubmit: (context: string, question: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const handleFormSubmit = (data: QuestionFormData) => {
    onSubmit(data.context, data.question);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Contexto */}
      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
          Contexto o texto base <span className="text-red-500">*</span>
        </label>
        <textarea
          id="context"
          {...register('context')}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Escribe o pega el texto sobre el cual quieres hacer preguntas..."
          disabled={isLoading}
        />
        {errors.context && (
          <p className="mt-1 text-sm text-red-600">{errors.context.message}</p>
        )}
      </div>

      {/* Pregunta */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Tu pregunta <span className="text-red-500">*</span>
        </label>
        <input
          id="question"
          type="text"
          {...register('question')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="¿Qué quieres saber sobre este texto?"
          disabled={isLoading}
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
        )}
      </div>

      {/* Error general */}
      {error && <ErrorAlert message={error} />}

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? '🔄 Procesando...' : '💬 Obtener Respuesta'}
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
