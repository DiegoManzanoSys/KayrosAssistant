'use client';

import React, { useRef } from 'react';
import { Card, MarkdownRenderer, Button } from '@/components/ui';
import { SummarizeResponse } from '@/lib/api/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Crear un contenedor temporal con el contenido
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // Ancho A4
      tempDiv.style.padding = '20mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Crear contenido con estilos
      tempDiv.innerHTML = `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #3B82F6;">
          <h1 style="color: #3B82F6; margin: 0 0 10px 0; font-size: 24px;">📄 Resumen de Documento</h1>
          <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Archivo:</strong> ${result.original_filename}</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Tipo de resumen:</strong> ${result.summary_type}</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Reducción:</strong> ${reductionPercentage}% (${result.length_original} → ${result.length_summary} caracteres)</p>
        </div>
        <div style="line-height: 1.6; color: #333; font-size: 11px;">
          ${contentRef.current.innerHTML}
        </div>
      `;
      
      document.body.appendChild(tempDiv);

      // Capturar como canvas
      const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      } as any);

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Descargar
      pdf.save(`resumen_${result.original_filename.replace(/\.[^/.]+$/, '')}.pdf`);
      
      // Limpiar
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Intenta descargar en formato Markdown.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
    alert('Resumen copiado al portapapeles');
  };

  return (
    <div className="space-y-4">
      {/* Estadísticas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">📊 Estadísticas</h3>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              📋 Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadMarkdown}>
              📝 MD
            </Button>
            <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
              📄 PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={onReset}>
              🔄 Nuevo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Archivo</div>
            <div className="text-lg font-bold text-gray-800 truncate" title={result.original_filename}>
              {result.original_filename}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Tipo</div>
            <div className="text-lg font-bold text-gray-800 capitalize">
              {result.summary_type}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Original</div>
            <div className="text-lg font-bold text-gray-800">
              {result.length_original.toLocaleString()} chars
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Reducción</div>
            <div className="text-lg font-bold text-gray-800">
              {reductionPercentage}%
            </div>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Longitud comparada:</span>
          </div>
          <div className="relative h-6 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 transition-all"
              style={{ width: '100%' }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
                Original: {result.length_original}
              </span>
            </div>
            <div
              className="absolute h-full bg-green-600 transition-all"
              style={{ width: `${(result.length_summary / result.length_original) * 100}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
                Resumen: {result.length_summary}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen */}
      <Card title="📝 Resumen Generado">
        <div ref={contentRef} className="bg-gray-50 p-6 rounded-lg">
          <MarkdownRenderer content={result.summary} />
        </div>
      </Card>
    </div>
  );
};
