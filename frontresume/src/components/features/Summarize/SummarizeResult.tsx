'use client';

import React, { useRef } from 'react';
import { Card, MarkdownRenderer, Button } from '@/components/ui';
import { SummarizeResponse } from '@/lib/api/types';

interface SummarizeResultProps {
  result: SummarizeResponse;
  onReset: () => void;
}

export const SummarizeResult: React.FC<SummarizeResultProps> = ({ result, onReset }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const reductionPercentage = (
    ((result.length_original - result.length_summary) / result.length_original) * 100
  ).toFixed(1);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([result.summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen_${result.original_filename.replace(/\.[^/.]+$/, '')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
    alert('Resumen copiado al portapapeles');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Estadísticas */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-md">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-800">Estadísticas del Resumen</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
            >
              <span>📋</span> Copiar
            </button>
            <button 
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
            >
              <span>📝</span> MD
            </button>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <span>🔄</span> Nuevo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="text-sm font-medium opacity-90 mb-1">📁 Archivo</div>
            <div className="text-base font-bold truncate" title={result.original_filename}>
              {result.original_filename}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="text-sm font-medium opacity-90 mb-1">🎯 Tipo</div>
            <div className="text-base font-bold capitalize">
              {result.summary_type === 'general' ? 'General' : result.summary_type}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="text-sm font-medium opacity-90 mb-1">📜 Original</div>
            <div className="text-base font-bold">
              {result.length_original.toLocaleString()} caracteres
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="text-sm font-medium opacity-90 mb-1">✨ Reducción</div>
            <div className="text-base font-bold">
              {reductionPercentage}%
            </div>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div>
          <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
            <span>📊 Comparación de longitud</span>
            <span className="text-blue-600">{result.length_summary.toLocaleString()} / {result.length_original.toLocaleString()}</span>
          </div>
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: '100%' }}
            >
              <span className="text-xs text-white font-semibold drop-shadow">
                Original
              </span>
            </div>
            <div
              className="absolute h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out delay-300 flex items-center justify-center shadow-lg"
              style={{ width: `${(result.length_summary / result.length_original) * 100}%` }}
            >
              <span className="text-xs text-white font-semibold drop-shadow">
                Resumen ({reductionPercentage}% reducido)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-xl shadow-md">
            📝
          </div>
          <h3 className="text-xl font-bold text-gray-800">Resumen Generado</h3>
        </div>
        <div ref={contentRef} className="prose prose-lg max-w-none bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl border border-gray-200">
          <MarkdownRenderer content={result.summary} />
        </div>
      </div>
    </div>
  );
};
