'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keywordsSchema, KeywordsFormData } from '@/lib/schemas/api-schemas';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface KeywordsFormProps {
  onSubmit: (text?: string, file?: File) => void;
  isLoading: boolean;
  error: string | null;
}

export const KeywordsForm: React.FC<KeywordsFormProps> = ({
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
  } = useForm<KeywordsFormData>({
    resolver: zodResolver(keywordsSchema),
  });

  const handleFormSubmit = (data: KeywordsFormData) => {
    if (inputMode === 'text' && data.text) {
      onSubmit(data.text, undefined);
    } else if (inputMode === 'file' && selectedFile) {
      onSubmit(undefined, selectedFile);
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
            placeholder="Escribe o pega el texto del cual quieres extraer palabras clave..."
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

      {/* Error general */}
      {error && <ErrorAlert message={error} />}

      {/* Botones */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || (inputMode === 'file' && !selectedFile)}
        >
          {isLoading ? '🔄 Extrayendo...' : '🔍 Extraer Palabras Clave'}
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
