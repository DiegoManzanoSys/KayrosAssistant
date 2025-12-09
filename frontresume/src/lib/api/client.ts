import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiErrorResponse } from './types';

// Configuración de la URL base desde variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '60000', 10);

// Crear instancia de Axios configurada
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request (para futura autenticación si se necesita)
apiClient.interceptors.request.use(
  (config) => {
    // Aquí se pueden agregar tokens de autenticación en el futuro
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejo de errores estandarizado
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail: string }>) => {
    const apiError: ApiErrorResponse = {
      message: 'Error desconocido',
      status: error.response?.status || 500,
      detail: error.response?.data?.detail,
    };

    // Mensajes de error personalizados según código de estado
    switch (error.response?.status) {
      case 400:
        apiError.message = error.response.data?.detail || 'Solicitud incorrecta';
        break;
      case 413:
        apiError.message = 'Archivo demasiado grande (máx 10 MB)';
        break;
      case 422:
        apiError.message = error.response.data?.detail || 'No se pudo procesar el documento';
        break;
      case 500:
        apiError.message = 'Error en el servidor. Intenta nuevamente.';
        break;
      default:
        apiError.message = error.message || 'Error de conexión';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
