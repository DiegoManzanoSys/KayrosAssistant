# 📚 Stack Tecnológico - ResumeAI

Documentación completa de todas las tecnologías y librerías utilizadas en el proyecto.

---

## 🎯 Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│                  http://localhost:3000                   │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (Axios)
┌──────────────────────▼──────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│                  http://localhost:8000                   │
└──────────────────────┬──────────────────────────────────┘
                       │ Python SDK
┌──────────────────────▼──────────────────────────────────┐
│                  OLLAMA (Local LLM)                      │
│                  http://localhost:11434                  │
│                 Model: llama3.1:latest                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ FRONTEND - Next.js 16.0.5

### Framework Principal
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Next.js** | 16.0.5 | Framework React con App Router, Server Components, y optimizaciones automáticas |
| **React** | 19.2.0 | Librería UI con hooks y componentes funcionales |
| **React DOM** | 19.2.0 | Renderizado de componentes React en el navegador |
| **TypeScript** | ^5 | Superset de JavaScript con tipado estático |

### HTTP Client & Validación
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Axios** | ^1.13.2 | Cliente HTTP con interceptores, manejo de errores y FormData |
| **Zod** | ^4.1.13 | Validación de esquemas TypeScript-first |

### Formularios
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React Hook Form** | ^7.68.0 | Gestión de formularios con validación y rendimiento optimizado |
| **@hookform/resolvers** | ^5.2.2 | Resolvers para integrar Zod con React Hook Form |

### UI & Estilos
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Tailwind CSS** | ^4 | Framework CSS utility-first para diseño responsive |
| **@tailwindcss/postcss** | ^4 | Plugin PostCSS para Tailwind |
| **React Markdown** | ^10.1.0 | Renderizado de Markdown a React components |

### PDF Export
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **jsPDF** | ^3.0.4 | Generación de documentos PDF del lado del cliente |
| **html2canvas** | ^1.4.1 | Captura de elementos HTML como imágenes para PDF |

### DevTools
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **ESLint** | ^9 | Linter para código JavaScript/TypeScript |
| **eslint-config-next** | 16.0.5 | Configuración ESLint optimizada para Next.js |
| **Babel React Compiler** | 1.0.0 | Compilador experimental de React para optimizaciones |

---

## ⚙️ BACKEND - FastAPI

### Framework Principal
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **FastAPI** | >=0.95.0 | Framework web moderno para APIs con validación automática |
| **Uvicorn** | >=0.20.0 (standard) | Servidor ASGI de alto rendimiento con WebSockets |
| **Pydantic** | >=1.10.0 | Validación de datos y settings management |

### Procesamiento de Documentos
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **pdfplumber** | >=0.7.6 | Extracción de texto de archivos PDF |
| **python-docx** | >=0.8.11 | Lectura y escritura de archivos .docx (Word) |

### AI & LLM
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Ollama** | >=0.1.0 | SDK de Python para interactuar con modelos locales Ollama |
| **llama3.1:latest** | 4.9 GB | Modelo de lenguaje de Meta ejecutado localmente |

### Utilidades
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **python-multipart** | >=0.0.6 | Parsing de FormData para subida de archivos |
| **python-dotenv** | >=1.0.0 | Carga de variables de entorno desde .env |
| **requests** | >=2.28.0 | Cliente HTTP para Python |

### Testing
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **pytest** | >=7.0.0 | Framework de testing para Python |

---

## 🤖 MODELO DE IA - Ollama

### Configuración
| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **Modelo** | llama3.1:latest | Modelo de lenguaje de Meta (Llama 3.1) |
| **Tamaño** | 4.9 GB | Espacio en disco requerido |
| **Host** | http://localhost:11434 | Servidor local de Ollama |
| **Temperature** | 0.2 | Control de aleatoriedad (más bajo = más determinista) |
| **Max Tokens** | 512-2048 | Límite de tokens por respuesta |

### Ventajas de Ollama
- ✅ **100% Local** - Sin dependencias de APIs externas
- ✅ **Gratuito** - Sin costos de uso
- ✅ **Privado** - Los datos no salen de tu máquina
- ✅ **Sin límites** - No hay rate limiting

---

## 🗂️ Estructura de Carpetas

```
PortfolioBack/
│
├── frontresume/                    # Frontend Next.js
│   ├── src/
│   │   ├── app/                   # App Router (pages)
│   │   │   ├── layout.tsx         # Layout principal
│   │   │   ├── page.tsx           # Página home
│   │   │   └── summarize/         # Página de resúmenes
│   │   ├── components/
│   │   │   ├── ui/                # Componentes UI reutilizables
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorAlert.tsx
│   │   │   │   └── MarkdownRenderer.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── features/
│   │   │       └── Summarize/
│   │   │           ├── SummarizeForm.tsx
│   │   │           └── SummarizeResult.tsx
│   │   ├── hooks/
│   │   │   ├── useHealthCheck.ts  # Hook para health check
│   │   │   └── useSummarize.ts    # Hook para resumir
│   │   └── lib/
│   │       ├── api/
│   │       │   ├── client.ts      # Axios instance
│   │       │   └── endpoints.ts   # API endpoints
│   │       └── schemas/
│   │           └── api-schemas.ts # Zod schemas
│   ├── public/                    # Assets estáticos
│   ├── .env.local                 # Variables de entorno
│   └── package.json
│
├── project/                        # Backend FastAPI
│   ├── app/
│   │   ├── main.py                # Entry point
│   │   ├── api/
│   │   │   ├── analysis.py        # Endpoints de análisis
│   │   │   └── summarize.py       # Endpoint de resúmenes
│   │   ├── services/
│   │   │   ├── ai_client.py       # Cliente Ollama
│   │   │   └── extractor.py       # Extracción de texto
│   │   ├── schemas/
│   │   │   └── summary_schema.py  # Pydantic models
│   │   └── utils/
│   │       └── file_utils.py      # Utilidades de archivos
│   ├── tests/                     # Tests unitarios
│   ├── venv/                      # Entorno virtual Python
│   ├── .env                       # Variables de entorno
│   ├── requirements.txt           # Dependencias Python
│   └── Dockerfile
│
├── start-all.bat                  # Script de inicio
├── stop-all.bat                   # Script de parada
└── MIGRACION_OLLAMA.md           # Documentación Ollama
```

---

## 🔌 API Endpoints

### Backend (FastAPI)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servicio |
| POST | `/api/summarize` | Resumir documento (PDF/DOCX) |
| POST | `/api/extract-keywords` | Extraer palabras clave |
| POST | `/api/extract-entities` | Extraer entidades nombradas |
| POST | `/api/compare-texts` | Comparar dos textos |
| POST | `/api/question` | Responder preguntas sobre texto |
| POST | `/api/topic-modeling` | Análisis de tópicos |
| POST | `/api/text-to-bullets` | Convertir texto a bullets |

📚 Documentación interactiva: http://localhost:8000/docs

---

## 🌐 Configuración de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=60000
```

### Backend (.env)
```env
# Ollama Configuration
OLLAMA_MODEL=llama3.1:latest
OLLAMA_BASE_URL=http://localhost:11434

# Temporary Directory
TMP_DIR=/tmp/resumeai
```

---

## 🚀 Comandos de Inicio

### Inicio Automático
```bash
# Windows
start-all.bat

# Esto inicia:
# 1. Backend (FastAPI) → http://localhost:8000
# 2. Frontend (Next.js) → http://localhost:3000
# 3. Abre navegador automáticamente
```

### Inicio Manual

**Backend:**
```bash
cd project
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontresume
npm install
npm run dev
```

**Ollama:**
```bash
# Iniciar servidor
ollama serve

# Descargar modelo
ollama pull llama3.1:latest

# Verificar modelos
ollama list
```

---

## 📊 Características Implementadas

### ✅ Fase 0-2: Infraestructura
- [x] Configuración de Next.js 16 con App Router
- [x] Cliente Axios con interceptores
- [x] Validación con Zod
- [x] 6 componentes UI reutilizables
- [x] Layout con Header y Sidebar
- [x] Health check con indicador de estado

### ✅ Fase 3: Resumir Documentos
- [x] Formulario de subida de archivos
- [x] Procesamiento de PDF y DOCX
- [x] 5 tipos de resumen (general, bullets, TL;DR, business, academic)
- [x] Visualización de resultados en Markdown
- [x] Estadísticas de reducción de texto
- [x] Exportación a PDF multi-página
- [x] Descarga de Markdown

### 🔄 Próximas Fases
- [ ] Fase 4: Extraer Palabras Clave
- [ ] Fase 5: Extraer Entidades
- [ ] Fase 6: Comparar Textos
- [ ] Fase 7: Preguntas y Respuestas
- [ ] Fase 8: Modelado de Tópicos
- [ ] Fase 9: Texto a Bullets
- [ ] Fase 10: Diseño responsive final

---

## 🛠️ Herramientas de Desarrollo

### Linting & Formatting
- **ESLint** - Análisis estático de código
- **Prettier** (integrado en Next.js) - Formateo automático

### DevTools
- **Next.js DevTools** - Debugging de React/Next.js
- **FastAPI Swagger UI** - Testing interactivo de API
- **React DevTools** - Inspección de componentes

### Testing
- **pytest** - Testing del backend
- **Manual Testing** - Testing del frontend (por decisión del usuario)

---

## 📦 Requisitos del Sistema

### Software Requerido
| Software | Versión Mínima | Propósito |
|----------|----------------|-----------|
| **Python** | 3.9+ | Backend runtime |
| **Node.js** | 18+ | Frontend runtime |
| **npm** | 8+ | Gestor de paquetes frontend |
| **Ollama** | Latest | Runtime de LLM local |

### Hardware Recomendado
| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **RAM** | 8 GB | 16 GB+ |
| **Disco** | 10 GB libres | 20 GB+ |
| **CPU** | 4 cores | 8 cores+ |
| **GPU** | N/A | NVIDIA CUDA / AMD ROCm |

> **Nota:** Ollama puede usar GPU para acelerar la inferencia del modelo.

---

## 🔐 Seguridad

### Validaciones Implementadas
- ✅ Tamaño máximo de archivo: **10 MB**
- ✅ Tipos de archivo permitidos: **.pdf, .docx**
- ✅ Validación de esquemas con Zod/Pydantic
- ✅ Sanitización de inputs
- ✅ CORS configurado correctamente

### Privacidad
- ✅ **100% Local** - Ningún dato se envía a servicios externos
- ✅ **Sin tracking** - No hay analytics ni telemetría
- ✅ **Sin logs sensibles** - Solo logs de desarrollo

---

## 📖 Documentación Adicional

- [QUICKSTART.md](project/QUICKSTART.md) - Guía rápida de inicio
- [MIGRACION_OLLAMA.md](project/MIGRACION_OLLAMA.md) - Migración de Groq a Ollama
- [README_SCRIPTS.md](README_SCRIPTS.md) - Documentación de scripts

---

## 👥 Contribución

### Convenciones de Código

**TypeScript/React:**
- Componentes funcionales con TypeScript
- Hooks personalizados prefijados con `use`
- Props tipadas con interfaces
- Componentes en PascalCase

**Python:**
- PEP 8 style guide
- Type hints en funciones
- Docstrings descriptivos
- Snake_case para funciones/variables

---

## 📝 Licencia

Este proyecto es privado y de uso educativo/portfolio.

---

**Última actualización:** 8 de Diciembre, 2025
