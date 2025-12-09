# Document Summarizer API

Backend construido con FastAPI para procesar y resumir documentos PDF y DOCX utilizando APIs de Inteligencia Artificial (Grok, OpenAI, Claude, Gemini).

## 🚀 Tecnologías

- **Python 3.11+**
- **FastAPI** - Framework web moderno y rápido
- **Uvicorn** - Servidor ASGI
- **pdfplumber** - Extracción de texto de PDFs
- **python-docx** - Extracción de texto de archivos Word
- **Pydantic** - Validación de datos
- **Docker** - Containerización
- **APIs de IA**: Grok / OpenAI / Claude / Gemini

## 📂 Estructura del Proyecto

```
project/
├── app/
│   ├── main.py                 # Aplicación principal de FastAPI
│   ├── api/
│   │   └── summarize.py        # Endpoint de resumen
│   ├── services/
│   │   ├── extractor.py        # Extracción de texto de documentos
│   │   └── ai_client.py        # Cliente para APIs de IA
│   ├── schemas/
│   │   └── summary_schema.py   # Modelos Pydantic
│   └── utils/
│       └── file_utils.py       # Utilidades para archivos
├── requirements.txt            # Dependencias Python
├── Dockerfile                  # Configuración Docker
├── .env.example               # Ejemplo de variables de entorno
└── README.md                  # Este archivo
```

## 🔧 Instalación

### Opción 1: Local (sin Docker)

1. **Clonar el repositorio y navegar al proyecto**
   ```bash
   cd project
   ```

2. **Crear un entorno virtual**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   
   # Editar .env y añadir tu API key
   ```

5. **Iniciar el servidor**
   ```bash
   uvicorn app.main:app --reload
   ```

   La API estará disponible en: `http://localhost:8000`

### Opción 2: Docker

1. **Construir la imagen**
   ```bash
   docker build -t document-summarizer .
   ```

2. **Ejecutar el contenedor**
   ```bash
   docker run -d -p 8000:8000 \
     -e AI_PROVIDER=grok \
     -e AI_API_KEY=tu_api_key_aqui \
     --name summarizer \
     document-summarizer
   ```

   La API estará disponible en: `http://localhost:8000`

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Proveedor de IA (grok, openai, claude, gemini)
AI_PROVIDER=grok

# API Key del proveedor seleccionado
AI_API_KEY=tu_api_key_aqui
```

### Obtener API Keys

- **Grok**: https://x.ai/api
- **OpenAI**: https://platform.openai.com/api-keys
- **Claude**: https://console.anthropic.com/
- **Gemini**: https://makersuite.google.com/app/apikey

## 📡 Uso de la API

### Endpoint Principal

**POST** `/api/summarize`

Procesa un archivo PDF o DOCX y retorna un resumen generado por IA.

**Parámetros:**
- `file` (form-data): Archivo PDF o DOCX a procesar

**Respuesta exitosa (200):**
```json
{
  "filename": "documento.pdf",
  "original_length": 5000,
  "summary": "Este documento trata sobre...",
  "success": true
}
```

### Ejemplos de uso

#### cURL
```bash
curl -X POST "http://localhost:8000/api/summarize" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/al/documento.pdf"
```

#### Python
```python
import requests

url = "http://localhost:8000/api/summarize"
files = {"file": open("documento.pdf", "rb")}

response = requests.post(url, files=files)
print(response.json())
```

#### JavaScript (Fetch)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8000/api/summarize', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### Otros Endpoints

- **GET** `/` - Información de la API
- **GET** `/health` - Health check
- **GET** `/docs` - Documentación interactiva (Swagger UI)
- **GET** `/redoc` - Documentación alternativa (ReDoc)

## 🧪 Testing

```bash
pytest
```

## 🚢 Deploy

### Railway

1. Instalar Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login y deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Configurar variables de entorno en el dashboard de Railway:
   - `AI_PROVIDER`
   - `AI_API_KEY`

### Render

1. Conectar tu repositorio en [render.com](https://render.com)
2. Crear un nuevo Web Service
3. Configurar:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Añadir variables de entorno en la configuración

## 📝 Limitaciones

- Tamaño máximo de archivo: 10 MB
- Formatos soportados: PDF, DOCX
- El texto extraído se limita a 8000 caracteres para las APIs de IA

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🐛 Reportar Issues

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en GitHub.

## 📧 Contacto

Tu Nombre - [tu@email.com](mailto:tu@email.com)

Link del proyecto: [https://github.com/tu-usuario/document-summarizer](https://github.com/tu-usuario/document-summarizer)
