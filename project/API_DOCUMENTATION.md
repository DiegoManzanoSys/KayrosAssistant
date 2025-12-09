# 📚 Documentación Completa de la API - ResumeAI Backend

## 📋 Índice

1. [Información General](#información-general)
2. [Configuración y Base URL](#configuración-y-base-url)
3. [Rutas Disponibles](#rutas-disponibles)
   - [Root - Health Check](#1-root---health-check)
   - [Resumir Documentos](#2-resumir-documentos)
   - [Extraer Palabras Clave](#3-extraer-palabras-clave)
   - [Extraer Entidades](#4-extraer-entidades)
   - [Comparar Textos](#5-comparar-textos)
   - [Preguntas y Respuestas](#6-preguntas-y-respuestas)
   - [Modelado de Temas](#7-modelado-de-temas)
   - [Convertir Texto a Bullets](#8-convertir-texto-a-bullets)
4. [Códigos de Estado HTTP](#códigos-de-estado-http)
5. [Manejo de Errores](#manejo-de-errores)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📌 Información General

**Nombre del Servicio:** ResumeAI - PDF/DOCX Summarizer  
**Framework:** FastAPI  
**Versión de Python:** 3.11+  
**Modelo de IA:** Groq API (compound-mini)

### Características Principales

- ✅ Extracción de texto de archivos PDF y DOCX
- ✅ Resúmenes personalizados con múltiples estilos
- ✅ Extracción de palabras clave y entidades
- ✅ Análisis comparativo de textos
- ✅ Sistema de preguntas y respuestas sobre documentos
- ✅ Modelado de temas y clustering de contenido
- ✅ Conversión de texto largo a bullets
- ✅ Manejo automático de documentos grandes (chunking inteligente)

---

## 🌐 Configuración y Base URL

### URLs Base

**Desarrollo Local:**
```
http://localhost:8000
```

**Producción:**
```
https://tu-dominio.com
```

### CORS Configurado

Por defecto, la API acepta peticiones desde:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Variables de Entorno Requeridas

```env
GROQ_API_KEY=tu_api_key_de_groq
```

---

## 🛣️ Rutas Disponibles

### 1. Root - Health Check

#### `GET /`

Verifica que el servicio está funcionando correctamente.

**URL Completa:**
```
GET http://localhost:8000/
```

**Parámetros:** Ninguno

**Headers:** Ninguno requerido

**Respuesta Exitosa:**
```json
{
  "ok": true,
  "service": "ResumeAI Backend"
}
```

**Código de Estado:** `200 OK`

**Ejemplo cURL:**
```bash
curl -X GET "http://localhost:8000/"
```

**Ejemplo JavaScript (fetch):**
```javascript
fetch('http://localhost:8000/')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Ejemplo Python (requests):**
```python
import requests

response = requests.get('http://localhost:8000/')
print(response.json())
```

---

### 2. Resumir Documentos

#### `POST /api/summarize`

Resume documentos PDF o DOCX con diferentes estilos de resumen.

**URL Completa:**
```
POST http://localhost:8000/api/summarize
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | ✅ Sí | Archivo PDF o DOCX (máx. 10 MB) |
| `summary_type` | String | ❌ No | Tipo de resumen (default: "general") |
| `max_tokens` | Integer | ❌ No | Longitud máxima del resumen (default: 1024) |

#### Tipos de Resumen Disponibles

| Valor | Descripción |
|-------|-------------|
| `general` | Resumen general claro y coherente |
| `bullets` | Resumen en formato de lista (máx. 8 bullets) |
| `tldr` | Resumen ultra-corto (máx. 2 oraciones) |
| `business` | Enfoque en implicaciones de negocio |
| `academic` | Enfoque académico (metodología, conclusiones) |

#### Respuesta Exitosa

**Código:** `200 OK`

**Modelo de Respuesta:**
```json
{
  "summary": "## Resumen\n\n[Contenido del resumen en formato Markdown]",
  "summary_type": "general",
  "original_filename": "documento.pdf",
  "length_original": 15420,
  "length_summary": 892
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `summary` | String | Resumen generado en formato Markdown |
| `summary_type` | String | Tipo de resumen aplicado |
| `original_filename` | String | Nombre del archivo original |
| `length_original` | Integer | Longitud en caracteres del texto original |
| `length_summary` | Integer | Longitud en caracteres del resumen |

#### Errores Posibles

**400 Bad Request:**
```json
{
  "detail": "Only .pdf and .docx supported"
}
```

**413 Request Entity Too Large:**
```json
{
  "detail": "File too large"
}
```

**422 Unprocessable Entity:**
```json
{
  "detail": "No text could be extracted from the document"
}
```

#### Ejemplos de Uso

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/summarize" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.pdf" \
  -F "summary_type=bullets" \
  -F "max_tokens=512"
```

**JavaScript (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('summary_type', 'bullets');
formData.append('max_tokens', '512');

fetch('http://localhost:8000/api/summarize', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.summary));
```

**Python (requests):**
```python
import requests

with open('document.pdf', 'rb') as f:
    files = {'file': f}
    data = {
        'summary_type': 'bullets',
        'max_tokens': 512
    }
    response = requests.post(
        'http://localhost:8000/api/summarize',
        files=files,
        data=data
    )
    print(response.json())
```

**Axios (TypeScript/React):**
```typescript
const handleSummarize = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('summary_type', 'general');
  formData.append('max_tokens', '1024');

  try {
    const response = await axios.post(
      'http://localhost:8000/api/summarize',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### 3. Extraer Palabras Clave

#### `POST /api/extract-keywords`

Extrae las palabras clave más importantes de un texto o documento.

**URL Completa:**
```
POST http://localhost:8000/api/extract-keywords
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `text` | String | ⚠️ Condicional* | Texto plano para analizar |
| `file` | File | ⚠️ Condicional* | Archivo de texto para analizar |

*Nota: Debes proporcionar `text` O `file`, no ambos.*

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "- Inteligencia Artificial\n- Machine Learning\n- Deep Learning\n- Redes Neuronales\n- Procesamiento de Lenguaje Natural\n- Computer Vision\n- Algoritmos de clasificación"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Lista de palabras clave en formato Markdown (bullets) |

#### Características Especiales

- ✅ **Chunking automático:** Si el texto es mayor a 2500 caracteres, se divide automáticamente
- ✅ **Deduplicación inteligente:** Combina y elimina palabras clave duplicadas
- ✅ **Ordenamiento por relevancia:** Las palabras clave están ordenadas por importancia

#### Ejemplos de Uso

**cURL con texto:**
```bash
curl -X POST "http://localhost:8000/api/extract-keywords" \
  -H "Content-Type: multipart/form-data" \
  -F "text=La inteligencia artificial es una rama de la informática..."
```

**cURL con archivo:**
```bash
curl -X POST "http://localhost:8000/api/extract-keywords" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.txt"
```

**JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('text', 'Tu texto aquí...');

fetch('http://localhost:8000/api/extract-keywords', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

# Con texto
response = requests.post(
    'http://localhost:8000/api/extract-keywords',
    data={'text': 'Tu texto aquí...'}
)

# Con archivo
with open('document.txt', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/extract-keywords',
        files={'file': f}
    )

print(response.json()['markdown'])
```

---

### 4. Extraer Entidades

#### `POST /api/extract-entities`

Extrae entidades nombradas del texto (Personas, Organizaciones, Lugares, Fechas).

**URL Completa:**
```
POST http://localhost:8000/api/extract-entities
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `text` | String | ⚠️ Condicional* | Texto plano para analizar |
| `file` | File | ⚠️ Condicional* | Archivo de texto para analizar |

*Nota: Debes proporcionar `text` O `file`, no ambos.*

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "### Personas\n- Steve Jobs (Persona)\n- Bill Gates (Persona)\n\n### Organizaciones\n- Apple Inc. (Organización)\n- Microsoft (Organización)\n\n### Lugares\n- Silicon Valley (Lugar)\n- Seattle (Lugar)\n\n### Fechas\n- 2007 (Fecha)\n- Enero 2024 (Fecha)"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Lista de entidades organizadas por tipo en formato Markdown |

#### Tipos de Entidades Detectadas

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| Personas | Nombres de individuos | "Steve Jobs", "Albert Einstein" |
| Organizaciones | Empresas, instituciones | "Apple Inc.", "NASA" |
| Lugares | Ciudades, países, regiones | "Nueva York", "España" |
| Fechas | Fechas, años, períodos | "2024", "Enero 15" |

#### Características Especiales

- ✅ **Deduplicación automática:** Elimina entidades duplicadas
- ✅ **Agrupación por tipo:** Organiza las entidades en categorías
- ✅ **Chunking para textos largos:** Procesa documentos grandes eficientemente

#### Ejemplos de Uso

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/extract-entities" \
  -H "Content-Type: multipart/form-data" \
  -F "text=Apple fue fundada por Steve Jobs en Cupertino en 1976..."
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('text', 'Apple fue fundada por Steve Jobs...');

fetch('http://localhost:8000/api/extract-entities', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

data = {
    'text': 'Apple fue fundada por Steve Jobs en Cupertino en 1976...'
}

response = requests.post(
    'http://localhost:8000/api/extract-entities',
    data=data
)

print(response.json()['markdown'])
```

---

### 5. Comparar Textos

#### `POST /api/compare-texts`

Compara dos o más textos analizando similitudes y diferencias.

**URL Completa:**
```
POST http://localhost:8000/api/compare-texts
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `texts` | Array[String] | ✅ Sí | Lista de textos a comparar (mínimo 2) |

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "# Análisis Comparativo\n\n## Similitudes\n\n- Ambos textos hablan sobre...\n- Comparten el tema de...\n\n## Diferencias\n\n### Texto 1\n- Enfoque en...\n\n### Texto 2\n- Enfoque en...\n\n## Conclusión\n\n[Resumen de la comparación]"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Análisis comparativo completo en formato Markdown |

#### Características Especiales

- ✅ **Comparación múltiple:** Puede comparar más de 2 textos simultáneamente
- ✅ **Resumen automático:** Textos muy largos se resumen antes de comparar
- ✅ **Análisis estructurado:** Organiza similitudes y diferencias claramente

#### Ejemplos de Uso

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/compare-texts" \
  -H "Content-Type: multipart/form-data" \
  -F "texts=Primer texto sobre IA..." \
  -F "texts=Segundo texto sobre ML..."
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('texts', 'Primer texto sobre IA...');
formData.append('texts', 'Segundo texto sobre ML...');
formData.append('texts', 'Tercer texto sobre DL...');

fetch('http://localhost:8000/api/compare-texts', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

data = {
    'texts': [
        'Primer texto sobre inteligencia artificial...',
        'Segundo texto sobre machine learning...',
        'Tercer texto sobre deep learning...'
    ]
}

response = requests.post(
    'http://localhost:8000/api/compare-texts',
    data=data
)

print(response.json()['markdown'])
```

**Axios (TypeScript):**
```typescript
const compareTexts = async (texts: string[]) => {
  const formData = new FormData();
  texts.forEach(text => {
    formData.append('texts', text);
  });

  const response = await axios.post(
    'http://localhost:8000/api/compare-texts',
    formData
  );
  
  return response.data.markdown;
};
```

---

### 6. Preguntas y Respuestas

#### `POST /api/question`

Responde preguntas sobre el contenido de un documento.

**URL Completa:**
```
POST http://localhost:8000/api/question
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | ✅ Sí | Archivo de texto/documento |
| `question` | String | ✅ Sí | Pregunta sobre el contenido del documento |

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "# Respuesta\n\n[Respuesta detallada a la pregunta basada en el contenido del documento]\n\n## Evidencia\n\n- Punto 1 del documento que apoya la respuesta\n- Punto 2 del documento que apoya la respuesta"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Respuesta completa en formato Markdown |

#### Características Especiales

- ✅ **Comprensión contextual:** Analiza el documento completo para responder
- ✅ **Documentos largos:** Resume documentos extensos antes de responder
- ✅ **Respuestas fundamentadas:** Incluye evidencia del documento
- ✅ **Formato estructurado:** Respuesta organizada y fácil de leer

#### Ejemplos de Uso

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/question" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/document.txt" \
  -F "question=¿Cuáles son las principales conclusiones del documento?"
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('question', '¿Cuál es el tema principal del documento?');

fetch('http://localhost:8000/api/question', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

with open('document.txt', 'rb') as f:
    files = {'file': f}
    data = {'question': '¿Cuáles son las principales conclusiones?'}
    
    response = requests.post(
        'http://localhost:8000/api/question',
        files=files,
        data=data
    )
    
    print(response.json()['markdown'])
```

**React Component Example:**
```typescript
import React, { useState } from 'react';
import axios from 'axios';

const QuestionAnswer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !question) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/question',
        formData
      );
      setAnswer(response.data.markdown);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Tu pregunta..."
      />
      <button type="submit">Preguntar</button>
      {answer && <div dangerouslySetInnerHTML={{ __html: answer }} />}
    </form>
  );
};
```

---

### 7. Modelado de Temas

#### `POST /api/topic-modeling`

Detecta y agrupa temas principales en textos largos o múltiples documentos.

**URL Completa:**
```
POST http://localhost:8000/api/topic-modeling
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `text` | String | ❌ No | Texto plano para analizar |
| `files` | Array[File] | ❌ No | Múltiples archivos de texto |

*Nota: Debes proporcionar al menos `text` o `files`*

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "# Temas Principales\n\n## 1. Inteligencia Artificial\n\n- Aplicaciones en la industria\n- Ética y regulaciones\n- Desarrollo futuro\n\n## 2. Machine Learning\n\n- Algoritmos supervisados\n- Redes neuronales\n- Casos de uso prácticos\n\n## 3. Procesamiento de Datos\n\n- Big Data\n- Análisis en tiempo real\n- Almacenamiento distribuido"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Temas principales con puntos de apoyo en formato Markdown |

#### Características Especiales

- ✅ **Análisis multi-documento:** Puede analizar múltiples archivos simultáneamente
- ✅ **Clustering inteligente:** Agrupa temas relacionados
- ✅ **Puntos de apoyo:** Cada tema incluye 2-3 bullets explicativos
- ✅ **Deduplicación:** Fusiona temas similares automáticamente

#### Ejemplos de Uso

**cURL con texto:**
```bash
curl -X POST "http://localhost:8000/api/topic-modeling" \
  -H "Content-Type: multipart/form-data" \
  -F "text=Texto largo con múltiples temas..."
```

**cURL con múltiples archivos:**
```bash
curl -X POST "http://localhost:8000/api/topic-modeling" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@document1.txt" \
  -F "files=@document2.txt" \
  -F "files=@document3.txt"
```

**JavaScript:**
```javascript
const formData = new FormData();

// Opción 1: Con texto
formData.append('text', 'Texto largo con múltiples temas...');

// Opción 2: Con múltiples archivos
const files = document.getElementById('fileInput').files;
for (let i = 0; i < files.length; i++) {
  formData.append('files', files[i]);
}

fetch('http://localhost:8000/api/topic-modeling', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

# Con texto
response = requests.post(
    'http://localhost:8000/api/topic-modeling',
    data={'text': 'Texto largo con múltiples temas...'}
)

# Con múltiples archivos
files = [
    ('files', open('doc1.txt', 'rb')),
    ('files', open('doc2.txt', 'rb')),
    ('files', open('doc3.txt', 'rb'))
]

response = requests.post(
    'http://localhost:8000/api/topic-modeling',
    files=files
)

print(response.json()['markdown'])
```

---

### 8. Convertir Texto a Bullets

#### `POST /api/text-to-bullets`

Convierte texto largo en una lista concisa de bullets.

**URL Completa:**
```
POST http://localhost:8000/api/text-to-bullets
```

**Content-Type:** `multipart/form-data`

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `text` | String | ✅ Sí | Texto a convertir en bullets |

#### Respuesta Exitosa

**Código:** `200 OK`

**Estructura:**
```json
{
  "markdown": "- Punto principal 1: descripción concisa\n- Punto principal 2: descripción concisa\n- Punto principal 3: descripción concisa\n- Punto principal 4: descripción concisa\n- Punto principal 5: descripción concisa"
}
```

**Campos de Respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `markdown` | String | Lista de bullets en formato Markdown (máx. 12) |

#### Características Especiales

- ✅ **Límite de bullets:** Máximo 12 bullets en la lista final
- ✅ **Ordenamiento por importancia:** Los bullets están ordenados por relevancia
- ✅ **Concisión:** Cada bullet es claro y directo
- ✅ **Textos largos:** Procesa documentos extensos dividiéndolos en chunks

#### Ejemplos de Uso

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/text-to-bullets" \
  -H "Content-Type: multipart/form-data" \
  -F "text=Texto largo que necesita ser resumido en bullets..."
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('text', 'Tu texto largo aquí...');

fetch('http://localhost:8000/api/text-to-bullets', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data.markdown));
```

**Python:**
```python
import requests

data = {
    'text': '''
    Este es un texto muy largo que contiene mucha información
    sobre diversos temas y necesita ser resumido en puntos clave
    para una mejor comprensión y lectura rápida...
    '''
}

response = requests.post(
    'http://localhost:8000/api/text-to-bullets',
    data=data
)

print(response.json()['markdown'])
```

**Axios (TypeScript):**
```typescript
const convertToBullets = async (text: string): Promise<string> => {
  const formData = new FormData();
  formData.append('text', text);

  try {
    const response = await axios.post<{ markdown: string }>(
      'http://localhost:8000/api/text-to-bullets',
      formData
    );
    return response.data.markdown;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Uso
const bullets = await convertToBullets('Tu texto largo...');
console.log(bullets);
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| `200` | OK | Solicitud exitosa |
| `400` | Bad Request | Formato de archivo no válido o parámetros incorrectos |
| `413` | Payload Too Large | Archivo demasiado grande (máx. 10 MB) |
| `422` | Unprocessable Entity | No se pudo extraer texto del documento |
| `500` | Internal Server Error | Error en el servidor o API de IA |

---

## ⚠️ Manejo de Errores

### Estructura de Error Estándar

```json
{
  "detail": "Descripción del error"
}
```

### Errores Comunes

#### Error 400 - Formato No Soportado
```json
{
  "detail": "Only .pdf and .docx supported"
}
```
**Causa:** Intentaste subir un archivo que no es PDF ni DOCX.  
**Solución:** Usa solo archivos `.pdf` o `.docx`.

#### Error 413 - Archivo Muy Grande
```json
{
  "detail": "File too large"
}
```
**Causa:** El archivo excede los 10 MB.  
**Solución:** Reduce el tamaño del archivo o divídelo en partes más pequeñas.

#### Error 422 - Sin Texto Extraíble
```json
{
  "detail": "No text could be extracted from the document"
}
```
**Causa:** El documento está vacío o el texto no se pudo extraer.  
**Solución:** Verifica que el documento contenga texto legible.

#### Error 500 - API Key No Configurada
```json
{
  "detail": "GROQ_API_KEY no está definido en variables de entorno"
}
```
**Causa:** La variable de entorno `GROQ_API_KEY` no está configurada.  
**Solución:** Configura la API key en el archivo `.env`.

---

## 💡 Ejemplos de Uso Completos

### Ejemplo 1: Resumir PDF en formato bullets

```javascript
async function summarizePDF(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('summary_type', 'bullets');
  formData.append('max_tokens', '512');

  try {
    const response = await fetch('http://localhost:8000/api/summarize', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }

    const data = await response.json();
    console.log('Resumen:', data.summary);
    console.log('Longitud original:', data.length_original);
    console.log('Longitud resumen:', data.length_summary);
    
    return data;
  } catch (error) {
    console.error('Error al resumir:', error.message);
  }
}

// Uso
const fileInput = document.getElementById('pdfInput');
summarizePDF(fileInput.files[0]);
```

### Ejemplo 2: Extraer palabras clave y entidades

```python
import requests

def analyze_document(file_path):
    with open(file_path, 'rb') as f:
        # Extraer palabras clave
        response_keywords = requests.post(
            'http://localhost:8000/api/extract-keywords',
            files={'file': f}
        )
        keywords = response_keywords.json()['markdown']
        
    with open(file_path, 'rb') as f:
        # Extraer entidades
        response_entities = requests.post(
            'http://localhost:8000/api/extract-entities',
            files={'file': f}
        )
        entities = response_entities.json()['markdown']
    
    print("=== PALABRAS CLAVE ===")
    print(keywords)
    print("\n=== ENTIDADES ===")
    print(entities)
    
    return keywords, entities

# Uso
analyze_document('mi_documento.txt')
```

### Ejemplo 3: Sistema completo de análisis de documentos

```typescript
import axios from 'axios';

interface SummaryResponse {
  summary: string;
  summary_type: string;
  original_filename: string;
  length_original: number;
  length_summary: number;
}

interface MarkdownResponse {
  markdown: string;
}

class DocumentAnalyzer {
  private baseURL = 'http://localhost:8000/api';

  async summarize(
    file: File,
    summaryType: 'general' | 'bullets' | 'tldr' | 'business' | 'academic' = 'general',
    maxTokens: number = 1024
  ): Promise<SummaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('summary_type', summaryType);
    formData.append('max_tokens', maxTokens.toString());

    const response = await axios.post<SummaryResponse>(
      `${this.baseURL}/summarize`,
      formData
    );

    return response.data;
  }

  async extractKeywords(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/extract-keywords`,
      formData
    );

    return response.data.markdown;
  }

  async extractEntities(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/extract-entities`,
      formData
    );

    return response.data.markdown;
  }

  async askQuestion(file: File, question: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/question`,
      formData
    );

    return response.data.markdown;
  }

  async analyzeTopics(files: File[]): Promise<string> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/topic-modeling`,
      formData
    );

    return response.data.markdown;
  }

  async compareTexts(texts: string[]): Promise<string> {
    const formData = new FormData();
    texts.forEach(text => {
      formData.append('texts', text);
    });

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/compare-texts`,
      formData
    );

    return response.data.markdown;
  }

  async textToBullets(text: string): Promise<string> {
    const formData = new FormData();
    formData.append('text', text);

    const response = await axios.post<MarkdownResponse>(
      `${this.baseURL}/text-to-bullets`,
      formData
    );

    return response.data.markdown;
  }

  async fullAnalysis(file: File) {
    try {
      console.log('Iniciando análisis completo...');

      // Resumir documento
      const summary = await this.summarize(file, 'general');
      console.log('✓ Resumen generado');

      // Extraer palabras clave
      const keywords = await this.extractKeywords(file);
      console.log('✓ Palabras clave extraídas');

      // Extraer entidades
      const entities = await this.extractEntities(file);
      console.log('✓ Entidades extraídas');

      return {
        summary: summary.summary,
        keywords,
        entities,
        metadata: {
          filename: summary.original_filename,
          originalLength: summary.length_original,
          summaryLength: summary.length_summary
        }
      };
    } catch (error) {
      console.error('Error en análisis completo:', error);
      throw error;
    }
  }
}

// Uso
const analyzer = new DocumentAnalyzer();

// Análisis completo
const file = document.getElementById('fileInput').files[0];
const analysis = await analyzer.fullAnalysis(file);
console.log(analysis);

// O usar funciones individuales
const summary = await analyzer.summarize(file, 'bullets');
const keywords = await analyzer.extractKeywords(file);
const answer = await analyzer.askQuestion(file, '¿Cuál es el tema principal?');
```

### Ejemplo 4: CLI en Python

```python
#!/usr/bin/env python3
import requests
import argparse
import sys

class ResumeAIClient:
    def __init__(self, base_url='http://localhost:8000/api'):
        self.base_url = base_url
    
    def summarize(self, file_path, summary_type='general', max_tokens=1024):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {
                'summary_type': summary_type,
                'max_tokens': max_tokens
            }
            response = requests.post(
                f'{self.base_url}/summarize',
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()
    
    def extract_keywords(self, file_path):
        with open(file_path, 'rb') as f:
            response = requests.post(
                f'{self.base_url}/extract-keywords',
                files={'file': f}
            )
            response.raise_for_status()
            return response.json()['markdown']
    
    def extract_entities(self, file_path):
        with open(file_path, 'rb') as f:
            response = requests.post(
                f'{self.base_url}/extract-entities',
                files={'file': f}
            )
            response.raise_for_status()
            return response.json()['markdown']
    
    def ask_question(self, file_path, question):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'question': question}
            response = requests.post(
                f'{self.base_url}/question',
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()['markdown']

def main():
    parser = argparse.ArgumentParser(description='Cliente CLI para ResumeAI')
    parser.add_argument('command', choices=[
        'summarize', 'keywords', 'entities', 'question'
    ])
    parser.add_argument('file', help='Ruta al archivo')
    parser.add_argument('--type', default='general', 
                       help='Tipo de resumen (para summarize)')
    parser.add_argument('--question', help='Pregunta (para question)')
    parser.add_argument('--url', default='http://localhost:8000/api',
                       help='URL base de la API')
    
    args = parser.parse_args()
    client = ResumeAIClient(args.url)
    
    try:
        if args.command == 'summarize':
            result = client.summarize(args.file, args.type)
            print(result['summary'])
            print(f"\nLongitud original: {result['length_original']}")
            print(f"Longitud resumen: {result['length_summary']}")
        
        elif args.command == 'keywords':
            result = client.extract_keywords(args.file)
            print(result)
        
        elif args.command == 'entities':
            result = client.extract_entities(args.file)
            print(result)
        
        elif args.command == 'question':
            if not args.question:
                print("Error: --question es requerido", file=sys.stderr)
                sys.exit(1)
            result = client.ask_question(args.file, args.question)
            print(result)
    
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

**Uso del CLI:**
```bash
# Resumir documento
python cli.py summarize document.pdf --type bullets

# Extraer palabras clave
python cli.py keywords document.pdf

# Extraer entidades
python cli.py entities document.pdf

# Hacer una pregunta
python cli.py question document.pdf --question "¿Cuál es el tema principal?"
```

---

## 📝 Notas Técnicas Importantes

### Límites y Restricciones

1. **Tamaño máximo de archivo:** 10 MB
2. **Formatos soportados:** PDF, DOCX
3. **Chunk size:** 2500 caracteres por chunk
4. **Max tokens por defecto:** 1024
5. **Máximo de bullets:** 12 en respuesta final

### Procesamiento de Textos Largos

La API implementa un sistema de **chunking inteligente**:

1. Si el texto ≤ 2500 caracteres → procesamiento directo
2. Si el texto > 2500 caracteres:
   - Divide el texto en chunks
   - Procesa cada chunk individualmente
   - Combina y deduplica resultados
   - Genera respuesta final consolidada

### Formato de Salida

Todas las respuestas de análisis se devuelven en **formato Markdown** para:
- ✅ Fácil renderizado en interfaces web
- ✅ Estructura clara y legible
- ✅ Compatible con múltiples frameworks (React, Vue, etc.)
- ✅ Exportable a HTML, PDF, etc.

### Modelo de IA

- **Proveedor:** Groq
- **Modelo:** compound-mini
- **Temperatura:** 0.2 (respuestas más consistentes y predecibles)
- **Timeout:** 1000 segundos

### Reintentos Automáticos

La API implementa reintentos automáticos en caso de fallo temporal de la API de IA.

---

## 🔐 Seguridad y Mejores Prácticas

### Recomendaciones

1. **En Producción:**
   - Configura CORS específicamente para tu dominio
   - Implementa rate limiting
   - Usa HTTPS
   - Valida y sanitiza inputs del usuario

2. **API Keys:**
   - Nunca expongas tu `GROQ_API_KEY` en el frontend
   - Usa variables de entorno
   - Rota las keys periódicamente

3. **Validación de Archivos:**
   - La API valida formato y tamaño
   - Considera escaneo antivirus adicional en producción

4. **Manejo de Errores:**
   - Implementa manejo de errores robusto en tu cliente
   - Muestra mensajes amigables al usuario
   - Registra errores para debugging

---

## 📖 Recursos Adicionales

- **Documentación Interactiva (Swagger):** `http://localhost:8000/docs`
- **Documentación Alternativa (ReDoc):** `http://localhost:8000/redoc`
- **OpenAPI Schema:** `http://localhost:8000/openapi.json`

---

## 🆘 Soporte y Contacto

Si encuentras problemas o tienes preguntas:

1. Revisa la documentación interactiva en `/docs`
2. Verifica que todas las variables de entorno estén configuradas
3. Consulta los logs del servidor para errores detallados

---

**Última actualización:** Diciembre 2025  
**Versión de la API:** 1.0
