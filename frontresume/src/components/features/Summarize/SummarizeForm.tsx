'use client';

import React, { useState } from 'react';
import { Button, FileUpload, ErrorAlert, Card } from '@/components/ui';
import { SummaryType } from '@/lib/api/types';

interface SummarizeFormProps {
  onSubmit: (file: File, summaryType: SummaryType, maxTokens: number) => void;
  isLoading: boolean;
  error: string | null;
}

export const SummarizeForm: React.FC<SummarizeFormProps> = ({ onSubmit, isLoading, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [summaryType] = useState<SummaryType>('general');
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
          📄
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resumir Documento</h2>
          <p className="text-sm text-gray-600">Genera resúmenes inteligentes con IA</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload de archivo */}
        <FileUpload
          acceptedFormats=".pdf,.docx"
          onFileSelect={handleFileChange}
          selectedFile={file}
          error={fileError || undefined}
          maxSizeMB={10}
        />

        {file && !fileError && (
          <div className="bg-white border-2 border-green-500 p-4 rounded-xl shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                ✓
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          </div>
        )}

        {/* Longitud del resumen */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700">
              Longitud del resumen
            </label>
            <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
              {maxTokens}
            </span>
          </div>
          <input
            type="range"
            min="256"
            max="2048"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((maxTokens - 256) / (2048 - 256)) * 100}%, #E0E7FF ${((maxTokens - 256) / (2048 - 256)) * 100}%, #E0E7FF 100%)`
            }}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-center flex-1">
              <div className="text-xs font-medium text-gray-900">Corto</div>
              <div className="text-xs text-gray-500">256</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs font-medium text-gray-900">Medio</div>
              <div className="text-xs text-gray-500">1024</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xs font-medium text-gray-900">Largo</div>
              <div className="text-xs text-gray-500">2048</div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && <ErrorAlert message={error} />}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!file || !!fileError || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando documento...</span>
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              <span>Generar Resumen</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
