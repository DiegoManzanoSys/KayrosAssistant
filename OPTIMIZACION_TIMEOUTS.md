# ⚡ Optimización de Timeouts para Ollama

## 🔍 Problema Identificado

```
⚠️ Error: timeout of 60000ms exceeded
```

Este error ocurre porque **Ollama ejecuta el modelo LLM localmente**, lo cual puede tardar más de 60 segundos dependiendo de:
- Tamaño del documento
- Hardware disponible (CPU vs GPU)
- Complejidad del análisis
- Carga del sistema

---

## ✅ Soluciones Implementadas

### 1. **Frontend - Timeout Extendido**

**Archivo:** `frontresume/.env.local`
```env
# Antes
NEXT_PUBLIC_API_TIMEOUT=60000  # 1 minuto

# Ahora
NEXT_PUBLIC_API_TIMEOUT=300000 # 5 minutos
```

**Archivo:** `frontresume/src/lib/api/endpoints.ts`
```typescript
export const summarizeDocument = async (
  request: SummarizeRequest
): Promise<SummarizeResponse> => {
  // ...
  const response = await apiClient.post<SummarizeResponse>('/api/summarize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // ⭐ 5 minutos para documentos largos con Ollama
  });
  return response.data;
};
```

### 2. **Manejo de Errores de Timeout Mejorado**

**Archivo:** `frontresume/src/lib/api/client.ts`
```typescript
// Mensajes específicos para timeouts
case 504:
  apiError.message = 'Tiempo de espera agotado. El documento puede ser muy grande...';
  break;

// Detección de timeout de Axios
if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
  apiError.message = 'Tiempo de espera agotado. Ollama está tardando mucho...';
}
```

### 3. **Instalación de Librería Ollama**

```bash
cd project
venv\Scripts\activate
pip install ollama
```

✅ **Ollama 0.6.1** instalado correctamente

---

## 🚀 Cómo Aplicar los Cambios

### Opción 1: Reiniciar con start-all.bat
```bash
# Detener servicios actuales
stop-all.bat

# Reiniciar todo
start-all.bat
```

### Opción 2: Reinicio Manual

**Frontend:**
```bash
cd frontresume
# Detener (Ctrl+C en la terminal)
npm run dev
```

**Backend:**
```bash
cd project
venv\Scripts\activate
uvicorn app.main:app --reload
```

---

## ⏱️ Tiempos Estimados de Procesamiento

| Tamaño del Documento | Hardware | Tiempo Estimado |
|----------------------|----------|-----------------|
| 1-2 páginas (PDF) | CPU | 10-30 segundos |
| 1-2 páginas (PDF) | GPU | 5-15 segundos |
| 5-10 páginas (PDF) | CPU | 30-90 segundos |
| 5-10 páginas (PDF) | GPU | 15-45 segundos |
| 20+ páginas (PDF) | CPU | 2-5 minutos |
| 20+ páginas (PDF) | GPU | 1-2 minutos |

> **Nota:** Estos tiempos son aproximados y dependen de tu hardware específico.

---

## 🎯 Recomendaciones de Uso

### 1. **Documentos Grandes**
Si tienes documentos muy grandes (>20 páginas):
- Usa el tipo de resumen `tldr` o `bullets` (más rápido)
- Reduce `max_tokens` a 512 o menos
- Considera dividir el documento

### 2. **Acelerar Ollama con GPU**

Si tienes una GPU NVIDIA:
```bash
# Verificar que Ollama use GPU
ollama list

# Debería mostrar: "GPU: NVIDIA ..."
```

Si no detecta GPU:
1. Instala NVIDIA CUDA Toolkit
2. Reinicia Ollama: `ollama serve`

### 3. **Ajustar Parámetros del Modelo**

**Archivo:** `project/app/services/ai_client.py`
```python
# Para respuestas más rápidas
response = client.chat(
    model=OLLAMA_MODEL,
    messages=[...],
    options={
        "num_predict": 512,      # ⬇️ Reduce tokens = más rápido
        "temperature": 0.2,
        "num_ctx": 2048,         # ⬇️ Contexto más pequeño
    }
)
```

### 4. **Modelos Alternativos Más Rápidos**

Si `llama3.1:latest` es muy lento, prueba modelos más pequeños:

```bash
# Llama 3.2 (más rápido, menor tamaño)
ollama pull llama3.2:latest

# Mistral (alternativa rápida)
ollama pull mistral:latest

# Cambiar en .env
OLLAMA_MODEL=llama3.2:latest
```

---

## 📊 Configuración Actual

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **API Timeout Global** | 300,000 ms | 5 minutos |
| **Summarize Timeout** | 300,000 ms | 5 minutos |
| **Chunk Size** | 2,500 chars | Tamaño de división de texto |
| **Max Tokens** | 1,024 | Tokens por chunk |
| **Temperature** | 0.2 | Consistencia del modelo |

---

## 🐛 Troubleshooting

### Error Persiste Después de 5 Minutos

**Problema:** Documento demasiado grande o hardware muy lento.

**Solución:**
1. Reduce el tamaño del documento
2. Usa `summary_type: "tldr"` para resúmenes más cortos
3. Reduce `max_tokens` a 256-512
4. Considera usar un modelo más pequeño

### Ollama No Responde

**Problema:** Ollama no está corriendo o se quedó colgado.

**Solución:**
```bash
# Windows
taskkill /IM ollama.exe /F
ollama serve

# Verificar
ollama list
```

### Backend Se Queda Procesando

**Problema:** El proceso de Uvicorn se quedó esperando respuesta de Ollama.

**Solución:**
```bash
# Reiniciar backend
cd project
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Frontend Muestra "Loading" Infinitamente

**Problema:** El timeout se alcanzó pero el UI no se actualizó.

**Solución:**
```bash
# Limpiar caché de Next.js
cd frontresume
Remove-Item -Path .next -Recurse -Force
npm run dev
```

---

## 📈 Monitoreo de Rendimiento

### Ver Logs de Ollama
```bash
# Windows (buscar proceso)
Get-Process ollama

# Ver logs en tiempo real
ollama serve
```

### Ver Logs del Backend
Los logs de FastAPI muestran el tiempo de procesamiento:
```
INFO:     127.0.0.1:XXXX - "POST /api/summarize HTTP/1.1" 200 OK
```

### Medir Tiempo en el Frontend
Abre DevTools → Network → Busca `/api/summarize` → Ver "Time"

---

## 🔧 Configuración Avanzada

### Aumentar Timeout Solo para Endpoints Específicos

Si otros endpoints son más rápidos, puedes mantener timeouts diferentes:

```typescript
// endpoints.ts

// Resumen: 5 minutos
export const summarizeDocument = async (...) => {
  const response = await apiClient.post(..., {
    timeout: 300000, // 5 min
  });
};

// Keywords: 2 minutos (más rápido)
export const extractKeywords = async (...) => {
  const response = await apiClient.post(..., {
    timeout: 120000, // 2 min
  });
};
```

### Timeout Dinámico Según Tamaño del Archivo

```typescript
export const summarizeDocument = async (
  request: SummarizeRequest
): Promise<SummarizeResponse> => {
  const fileSizeMB = request.file.size / (1024 * 1024);
  
  // 1 minuto por cada MB
  const dynamicTimeout = Math.max(60000, fileSizeMB * 60000);
  
  const response = await apiClient.post(..., {
    timeout: dynamicTimeout,
  });
};
```

---

## ✅ Checklist de Verificación

Después de aplicar cambios:

- [ ] Frontend reiniciado con nuevo `.env.local`
- [ ] Backend reiniciado con `ollama` instalado
- [ ] Ollama corriendo en http://localhost:11434
- [ ] Modelo `llama3.1:latest` descargado
- [ ] Probado con un documento pequeño (1-2 páginas)
- [ ] Probado con un documento mediano (5-10 páginas)
- [ ] Errores de timeout ya no aparecen

---

## 📚 Referencias

- [Documentación de Ollama](https://ollama.com/docs)
- [Axios Timeout Configuration](https://axios-http.com/docs/req_config)
- [FastAPI Timeouts](https://fastapi.tiangolo.com/)

---

**Última actualización:** 8 de Diciembre, 2025

**Estado:** ✅ Timeouts extendidos a 5 minutos
