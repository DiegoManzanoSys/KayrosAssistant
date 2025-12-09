'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { topicModelingSchema, TopicModelingFormData } from '@/lib/schemas/api-schemas';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface TopicsFormProps {
  onSubmit: (text?: string, file?: File, numTopics?: number) => void;
  isLoading: boolean;
  error: string | null;
}

export const TopicsForm: React.FC<TopicsFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(topicModelingSchema),
    defaultValues: {
      num_topics: 3,
    },
  });

  const handleFormSubmit = (data: any) => {
    if (inputMode === 'text' && data.text) {
      onSubmit(data.text, undefined, data.num_topics);
    } else if (inputMode === 'file' && selectedFile) {
      onSubmit(undefined, selectedFile, data.num_topics);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Toggle entre texto y archivo */}
      <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => {
            setInputMode('text');
            setSelectedFile(null);
          }}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            inputMode === 'text'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✍️ Texto directo
        </button>
        <button
          type="button"
          onClick={() => {
            setInputMode('file');
            reset();
          }}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            inputMode === 'file'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 Archivo PDF/DOCX
        </button>
      </div>

      {/* Input de texto o archivo */}
      {inputMode === 'text' ? (
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Texto para analizar
          </label>
          <textarea
            id="text"
            {...register('text')}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Escribe o pega el texto para identificar sus tópicos principales..."
            disabled={isLoading}
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
          )}
        </div>
      ) : (
        <div>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            acceptedFormats=".pdf,.docx"
            maxSizeMB={10}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Número de tópicos */}
      <div>
        <label htmlFor="num_topics" className="block text-sm font-medium text-gray-700 mb-2">
          Número de tópicos a identificar
        </label>
        <input
          id="num_topics"
          type="number"
          {...register('num_topics', { valueAsNumber: true })}
          min={1}
          max={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.num_topics && (
          <p className="mt-1 text-sm text-red-600">{errors.num_topics.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Entre 1 y 10 tópicos</p>
      </div>

      {/* Error general */}
      {error && <ErrorAlert message={error} />}

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || (inputMode === 'file' && !selectedFile)}
        >
          {isLoading ? '🔄 Analizando...' : '🎯 Analizar Tópicos'}
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
