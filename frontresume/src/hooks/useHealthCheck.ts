'use client';

import { useEffect, useState } from 'react';
import { healthCheck } from '@/lib/api/endpoints';

type HealthStatus = 'online' | 'offline' | 'checking';

export const useHealthCheck = () => {
  const [status, setStatus] = useState<HealthStatus>('checking');

  useEffect(() => {
    const check = async () => {
      try {
        const response = await healthCheck();
        setStatus(response.ok ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    };

    check();
    const interval = setInterval(check, 30000); // Check cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return status;
};
