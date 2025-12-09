import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_PDF_DOCX = ['.pdf', '.docx'];
const ACCEPTED_TEXT = ['.txt'];

/**
 * Schema para validar resumen de documentos
 */
export const summarizeSchema = z.object({
  file: z
    .instanceof(File, { message: 'Debes seleccionar un archivo' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'El archivo debe ser menor a 10 MB'
    )
    .refine(
      (file) => ACCEPTED_PDF_DOCX.some(ext => file.name.toLowerCase().endsWith(ext)),
      'Solo se aceptan archivos PDF o DOCX'
    ),
  summary_type: z.enum(['general', 'bullets', 'tldr', 'business', 'academic']),
  max_tokens: z.number().min(256).max(2048),
});

/**
 * Schema para validar extracción de keywords/entities
 */
export const textOrFileSchema = z.object({
  text: z.string().optional(),
  file: z.instanceof(File).optional(),
}).refine(
  (data) => data.text || data.file,
  'Debes proporcionar texto o un archivo'
);

/**
 * Schema para comparar textos
 */
export const compareTextsSchema = z.object({
  texts: z
    .array(z.string().min(10, 'Cada texto debe tener al menos 10 caracteres'))
    .min(2, 'Debes proporcionar al menos 2 textos')
    .max(5, 'Máximo 5 textos para comparar'),
});

/**
 * Schema para preguntas sobre documentos
 */
export const questionSchema = z.object({
  file: z
    .instanceof(File, { message: 'Debes seleccionar un archivo' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'El archivo debe ser menor a 10 MB'
    ),
  question: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres'),
});

/**
 * Schema para modelado de temas
 */
export const topicModelingSchema = z.object({
  text: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
}).refine(
  (data) => data.text || (data.files && data.files.length > 0),
  'Debes proporcionar texto o archivos'
);

/**
 * Schema para convertir texto a bullets
 */
export const textToBulletsSchema = z.object({
  text: z.string().min(50, 'El texto debe tener al menos 50 caracteres'),
});

// Tipos inferidos de los schemas
export type SummarizeFormData = z.infer<typeof summarizeSchema>;
export type TextOrFileFormData = z.infer<typeof textOrFileSchema>;
export type CompareTextsFormData = z.infer<typeof compareTextsSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type TopicModelingFormData = z.infer<typeof topicModelingSchema>;
export type TextToBulletsFormData = z.infer<typeof textToBulletsSchema>;
