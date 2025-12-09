'use client';

import React, { useState } from 'react';
import { Button, FileUpload, ErrorAlert, Card } from '@/components/ui';
import { SummaryType } from '@/lib/api/types';

interface SummarizeFormProps {
  onSubmit: (file: File, summaryType: SummaryType, maxTokens: number) => void;
  isLoading: boolean;
  error: string | null;
}

const summaryTypes: { value: SummaryType; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'Resumen claro y coherente' },
  { value: 'bullets', label: 'Bullets', description: 'Lista de puntos clave (máx 8)' },
  { value: 'tldr', label: 'TL;DR', description: 'Resumen ultra-corto (2 oraciones)' },
  { value: 'business', label: 'Negocios', description: 'Enfoque en implicaciones de negocio' },
  { value: 'academic', label: 'Académico', description: 'Metodología y conclusiones' },
];

export const SummarizeForm: React.FC<SummarizeFormProps> = ({ onSubmit, isLoading, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>('general');
  const [maxTokens, setMaxTokens] = useState(1024);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setFileError(null);

    if (selectedFile) {
      // Validar formato
      const validExtensions = ['.pdf', '.docx'];
      const isValidFormat = validExtensions.some(ext => 
        selectedFile.name.toLowerCase().endsWith(ext)
      );

      if (!isValidFormat) {
        setFileError('Solo se aceptan archivos PDF o DOCX');
        return;
      }

      // Validar tamaño (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setFileError('El archivo debe ser menor a 10 MB');
        return;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Debes seleccionar un archivo');
      return;
    }

    if (fileError) return;

    onSubmit(file, summaryType, maxTokens);
  };

  return (
    <Card title="📄 Resumir Documento">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload de archivo */}
        <FileUpload
          accept=".pdf,.docx"
          onChange={handleFileChange}
          label="Selecciona tu documento"
          error={fileError || undefined}
          maxSize={10}
        />

        {file && !fileError && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            ✓ Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}

        {/* Tipo de resumen */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipo de resumen
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summaryTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSummaryType(type.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  summaryType === type.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-800">{type.label}</div>
                <div className="text-xs text-gray-600 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Max tokens slider */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Longitud del resumen: <strong>{maxTokens}</strong> tokens
          </label>
          <input
            type="range"
            min="256"
            max="2048"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Corto (256)</span>
            <span>Medio (1024)</span>
            <span>Largo (2048)</span>
          </div>
        </div>

        {/* Error display */}
        {error && <ErrorAlert message={error} />}

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!file || !!fileError || isLoading}
          className="w-full"
        >
          {isLoading ? 'Procesando documento...' : 'Generar Resumen'}
        </Button>
      </form>
    </Card>
  );
};
