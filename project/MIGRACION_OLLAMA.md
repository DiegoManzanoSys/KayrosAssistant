# 🔄 Migración a Ollama - Modelo Local

## 📝 Cambios Realizados

El backend ha sido refactorizado para usar **Ollama** con el modelo **llama3.1:latest** en lugar de Groq API.

### ✅ Ventajas de Ollama

- 🚀 **100% Local** - No necesitas API keys ni conexión a internet
- 💰 **Gratuito** - Sin costos de API
- 🔒 **Privado** - Tus datos no salen de tu máquina
- ⚡ **Rápido** - Procesamiento local sin latencia de red

## 📦 Requisitos Previos

### 1. Instalar Ollama

**Windows:**
```powershell
# Descargar desde: https://ollama.com/download
# O usar winget:
winget install Ollama.Ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**macOS:**
```bash
brew install ollama
```

### 2. Descargar el Modelo llama3.1

```bash
ollama pull llama3.1:latest
```

### 3. Verificar que Ollama está corriendo

```bash
ollama list
```

Deberías ver:
```
NAME               ID              SIZE      MODIFIED
llama3.1:latest    46e0c10c039e    4.9 GB    X seconds ago
```

## ⚙️ Configuración

### Archivo `.env`

El archivo `.env` ya no requiere `GROQ_API_KEY`. Ahora usa:

```env
# Configuración de Ollama
OLLAMA_MODEL=llama3.1:latest
OLLAMA_BASE_URL=http://localhost:11434
TMP_DIR=/tmp/resumeai
```

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `OLLAMA_MODEL` | Modelo de Ollama a usar | `llama3.1:latest` |
| `OLLAMA_BASE_URL` | URL del servidor Ollama | `http://localhost:11434` |

## 🔧 Cambios Técnicos

### Archivos Modificados

1. **`requirements.txt`**
   - ❌ Eliminado: `requests` (para Groq)
   - ✅ Agregado: `ollama>=0.1.0`

2. **`app/services/ai_client.py`**
   - ❌ Eliminado: `call_groq_api()`
   - ✅ Agregado: `call_ollama_api()`
   - ❌ Eliminado: `summarize_text_with_groq()`
   - ✅ Agregado: `summarize_text_with_ollama()`

3. **`app/api/summarize.py`**
   - Actualizado para usar `summarize_text_with_ollama()`

4. **`app/api/analysis.py`**
   - Actualizado para usar `call_ollama_api()`

### Función Principal

```python
def call_ollama_api(prompt: str, max_tokens: int = 1024) -> str:
    """
    Llamada a Ollama usando el modelo local llama3.1.
    """
    try:
        client = ollama.Client(host=OLLAMA_BASE_URL)
        
        response = client.chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "num_predict": max_tokens,
                "temperature": 0.2,
            }
        )
        
        return response['message']['content']
        
    except Exception as e:
        raise RuntimeError(f"Ollama API error: {str(e)}")
```

## 🚀 Cómo Usar

### Paso 1: Asegurar que Ollama esté corriendo

```bash
# En una terminal, iniciar Ollama (si no está corriendo)
ollama serve
```

### Paso 2: Instalar dependencias actualizadas

```bash
cd project
venv\Scripts\activate
pip install -r requirements.txt
```

### Paso 3: Iniciar el backend

```bash
# Opción 1: Usar start.bat
start.bat

# Opción 2: Manual
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Paso 4: Usar desde el frontend

El frontend ya está configurado para conectarse al backend en `http://localhost:8000`. No requiere cambios.

## 🎯 Rendimiento

### Comparación Groq vs Ollama

| Métrica | Groq (Nube) | Ollama (Local) |
|---------|-------------|----------------|
| Latencia | ~1-3s | ~2-5s* |
| Costo | $$ | Gratis |
| Privacidad | ❌ | ✅ |
| Requiere Internet | ✅ | ❌ |
| Límites de API | ✅ | ❌ |

*Depende de tu hardware (GPU/CPU)

### Optimización

Para mejor rendimiento con Ollama:

1. **Usar GPU** (si está disponible):
   ```bash
   # Ollama detecta automáticamente CUDA/ROCm
   ollama list
   ```

2. **Ajustar parámetros**:
   ```python
   options={
       "num_predict": 512,  # Menos tokens = más rápido
       "temperature": 0.2,   # Menor temperatura = más determinista
   }
   ```

## 🔄 Otros Modelos Disponibles

Puedes cambiar el modelo en `.env`:

```bash
# Modelos disponibles en Ollama
ollama list

# Ejemplos de modelos alternativos:
OLLAMA_MODEL=llama3.2:latest     # Más rápido, menor tamaño
OLLAMA_MODEL=mistral:latest      # Alternativa a llama
OLLAMA_MODEL=codellama:latest    # Especializado en código
```

Descargar nuevos modelos:
```bash
ollama pull llama3.2:latest
ollama pull mistral:latest
```

## 🐛 Solución de Problemas

### Error: "Ollama API error: ..."

**Problema**: Ollama no está corriendo.

**Solución**:
```bash
ollama serve
```

### Error: "Model not found"

**Problema**: El modelo no está descargado.

**Solución**:
```bash
ollama pull llama3.1:latest
```

### Respuestas lentas

**Problema**: CPU no optimizado.

**Solución**:
- Usar un modelo más pequeño: `ollama pull llama3.2:latest`
- Verificar que Ollama use GPU si está disponible

### Puerto 11434 en uso

**Problema**: Ollama ya está corriendo o el puerto está ocupado.

**Solución**:
```bash
# Windows
netstat -ano | findstr :11434
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:11434 | xargs kill -9
```

## 📚 Recursos

- [Documentación de Ollama](https://ollama.com/docs)
- [Modelos Disponibles](https://ollama.com/library)
- [Python SDK de Ollama](https://github.com/ollama/ollama-python)

## ✅ Checklist de Migración

- [x] Instalar Ollama
- [x] Descargar modelo llama3.1:latest
- [x] Actualizar `.env` (eliminar GROQ_API_KEY)
- [x] Instalar nuevas dependencias (`pip install -r requirements.txt`)
- [x] Verificar que Ollama esté corriendo
- [x] Iniciar backend
- [x] Probar endpoints desde frontend

## 🎉 ¡Listo!

Ahora tu aplicación funciona 100% localmente sin depender de APIs externas.
