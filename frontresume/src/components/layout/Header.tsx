'use client';

import React from 'react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export const Header: React.FC = () => {
  const healthStatus = useHealthCheck();

  const statusConfig = {
    online: { color: 'bg-green-500', text: 'En línea', icon: '✓' },
    offline: { color: 'bg-red-500', text: 'Desconectado', icon: '✕' },
    checking: { color: 'bg-yellow-500', text: 'Verificando...', icon: '...' },
  };

  const status = statusConfig[healthStatus];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">ResumeAI</h1>
            <p className="text-sm text-gray-500">Análisis inteligente de documentos</p>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.color} animate-pulse`}></div>
            <span className="text-sm text-gray-600">{status.text}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
