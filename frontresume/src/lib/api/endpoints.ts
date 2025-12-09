import apiClient from './client';
import {
  HealthCheckResponse,
  SummarizeRequest,
  SummarizeResponse,
  KeywordsRequest,
  EntitiesRequest,
  CompareTextsRequest,
  QuestionRequest,
  TopicModelingRequest,
  TextToBulletsRequest,
  MarkdownResponse,
} from './types';

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Health Check - Verificar estado del backend
 * GET /
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/');
  return response.data;
};

/**
 * Resumir documentos PDF o DOCX
 * POST /api/summarize
 */
export const summarizeDocument = async (
  request: SummarizeRequest
): Promise<SummarizeResponse> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('summary_type', request.summary_type || 'general');
  formData.append('max_tokens', String(request.max_tokens || 1024));

  const response = await apiClient.post<SummarizeResponse>('/api/summarize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // 5 minutos para documentos largos con Ollama
  });
  return response.data;
};

/**
 * Extraer palabras clave
 * POST /api/extract-keywords
 */
export const extractKeywords = async (
  request: KeywordsRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  } else if (request.file) {
    formData.append('file', request.file);
  }

  const response = await apiClient.post<MarkdownResponse>('/api/extract-keywords', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Extraer entidades nombradas
 * POST /api/extract-entities
 */
export const extractEntities = async (
  request: EntitiesRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  } else if (request.file) {
    formData.append('file', request.file);
  }

  const response = await apiClient.post<MarkdownResponse>('/api/extract-entities', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Comparar múltiples textos
 * POST /api/compare-texts
 */
export const compareTexts = async (
  request: CompareTextsRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  request.texts.forEach(text => {
    formData.append('texts', text);
  });

  const response = await apiClient.post<MarkdownResponse>('/api/compare-texts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Preguntas y respuestas sobre documentos
 * POST /api/question
 */
export const askQuestion = async (
  request: QuestionRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  }
  
  if (request.file) {
    formData.append('file', request.file);
  }
  
  formData.append('question', request.question);

  const response = await apiClient.post<MarkdownResponse>('/api/question', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Modelado de temas
 * POST /api/topic-modeling
 */
export const analyzeTopics = async (
  request: TopicModelingRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  }
  
  if (request.file) {
    formData.append('file', request.file);
  }
  
  if (request.num_topics) {
    formData.append('num_topics', request.num_topics.toString());
  }

  const response = await apiClient.post<MarkdownResponse>('/api/topic-modeling', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Convertir texto a bullets
 * POST /api/text-to-bullets
 */
export const textToBullets = async (
  request: TextToBulletsRequest
): Promise<MarkdownResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  }
  
  if (request.file) {
    formData.append('file', request.file);
  }

  const response = await apiClient.post<MarkdownResponse>('/api/text-to-bullets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
