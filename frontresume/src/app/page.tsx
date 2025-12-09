'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';

export default function Home() {
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Bienvenido a ResumeAI
      </h1>
      
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Funcionalidades Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold mb-1">Resumir Documentos</h3>
            <p className="text-sm text-gray-600">
              Genera resúmenes de archivos PDF y DOCX con diferentes estilos
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🔑</div>
            <h3 className="font-semibold mb-1">Palabras Clave</h3>
            <p className="text-sm text-gray-600">
              Extrae las palabras más relevantes de tus textos
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="font-semibold mb-1">Entidades</h3>
            <p className="text-sm text-gray-600">
              Identifica personas, organizaciones, lugares y fechas
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold mb-1">Comparar Textos</h3>
            <p className="text-sm text-gray-600">
              Analiza similitudes y diferencias entre documentos
            </p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-2xl mb-2">❓</div>
            <h3 className="font-semibold mb-1">Preguntas</h3>
            <p className="text-sm text-gray-600">
              Haz preguntas sobre el contenido de tus documentos
            </p>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Temas</h3>
            <p className="text-sm text-gray-600">
              Detecta y agrupa los temas principales
            </p>
          </div>
          
          <div className="p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold mb-1">A Bullets</h3>
            <p className="text-sm text-gray-600">
              Convierte textos largos en listas concisas
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Cómo Usar</h2>
      </Card>
    </div>
  );
}
