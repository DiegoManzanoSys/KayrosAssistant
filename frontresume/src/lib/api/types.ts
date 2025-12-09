// Tipos TypeScript basados en la documentación del backend API

// ============================================
// RESPONSE TYPES
// ============================================

export interface HealthCheckResponse {
  ok: boolean;
  service: string;
}

export interface SummarizeResponse {
  summary: string;
  summary_type: string;
  original_filename: string;
  length_original: number;
  length_summary: number;
}

export interface MarkdownResponse {
  result: string;
}

// ============================================
// REQUEST TYPES
// ============================================

export type SummaryType = 'general' | 'bullets' | 'tldr' | 'business' | 'academic';

export interface SummarizeRequest {
  file: File;
  summary_type?: SummaryType;
  max_tokens?: number;
}

export interface KeywordsRequest {
  text?: string;
  file?: File;
}

export interface EntitiesRequest {
  text?: string;
  file?: File;
}

export interface CompareTextsRequest {
  texts: string[];
}

export interface QuestionRequest {
  text?: string;
  file?: File;
  question: string;
}

export interface TopicModelingRequest {
  text?: string;
  file?: File;
  num_topics?: number;
}

export interface TextToBulletsRequest {
  text?: string;
  file?: File;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  detail: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  detail?: string;
}
