# 🚀 Guía de Inicio Rápido

## Primeros Pasos (5 minutos)

### 1. Configurar API Key

Copia el archivo de ejemplo y configúralo:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
notepad .env
```

**Linux/Mac:**
```bash
cp .env.example .env
nano .env
```

Edita el archivo `.env` y añade tu API key:
```env
AI_PROVIDER=grok
AI_API_KEY=tu_api_key_real_aqui
```

### 2. Iniciar el Servidor

**Opción A - Script Automático (Recomendado)**

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Opción B - Manual**
```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --reload
```

### 3. Probar la API

Abre tu navegador en: **http://localhost:8000/docs**

Verás la documentación interactiva de Swagger UI.

## 🧪 Probar con cURL

```bash
curl -X POST "http://localhost:8000/api/summarize" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@tu_documento.pdf"
```

## 🐳 Iniciar con Docker

```bash
# Construir imagen
docker build -t document-summarizer .

# Ejecutar
docker run -d -p 8000:8000 \
  -e AI_PROVIDER=grok \
  -e AI_API_KEY=tu_api_key \
  document-summarizer
```

## 📝 Endpoints Disponibles

- **POST** `/api/summarize` - Resumir documento
- **GET** `/` - Info de la API
- **GET** `/health` - Health check
- **GET** `/docs` - Documentación Swagger
- **GET** `/redoc` - Documentación ReDoc

## ❓ Solución de Problemas

### Error: "API_KEY no configurada"
- Verifica que el archivo `.env` existe y contiene `AI_API_KEY`

### Error: "ModuleNotFoundError"
- Asegúrate de haber activado el entorno virtual
- Ejecuta: `pip install -r requirements.txt`

### El servidor no inicia
- Verifica que el puerto 8000 no esté en uso
- Usa otro puerto: `uvicorn app.main:app --port 8001`

## 🎯 Próximos Pasos

1. Lee el **README.md** completo para más detalles
2. Explora la documentación en `/docs`
3. Revisa el código en `app/` para personalizarlo
4. Añade tus propios tests en `tests/`

## 💡 Tips

- Usa **Swagger UI** (`/docs`) para probar la API sin código
- El servidor se recarga automáticamente con `--reload`
- Los archivos temporales se borran automáticamente
- Máximo tamaño de archivo: **10 MB**

¡Listo para usar! 🎉
