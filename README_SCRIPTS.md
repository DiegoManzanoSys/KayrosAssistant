# 🚀 Scripts de Inicio Rápido

Este directorio contiene scripts para iniciar y detener fácilmente el proyecto completo.

## 📜 Scripts Disponibles

### `start-all.bat` - Iniciar Todo
Inicia automáticamente tanto el backend (FastAPI) como el frontend (Next.js).

**Uso:**
```cmd
start-all.bat
```

**Lo que hace:**
1. ✅ Verifica y crea el entorno virtual de Python si no existe
2. ✅ Verifica archivos `.env` y `.env.local`
3. ✅ Instala dependencias si es necesario (backend y frontend)
4. ✅ Inicia el backend en puerto 8000
5. ✅ Espera 5 segundos
6. ✅ Inicia el frontend en puerto 3000
7. ✅ Abre automáticamente el navegador

**Servicios iniciados:**
- 🖥️ Backend: `http://localhost:8000`
- 🌐 Frontend: `http://localhost:3000`
- 📚 API Docs: `http://localhost:8000/docs`

### `stop-all.bat` - Detener Todo
Detiene todos los servicios de backend y frontend.

**Uso:**
```cmd
stop-all.bat
```

**Lo que hace:**
1. 🛑 Detiene todos los procesos de Node.js (frontend)
2. 🛑 Detiene todos los procesos de Python/Uvicorn (backend)
3. 🔌 Libera los puertos 3000 y 8000 si están ocupados

## ⚙️ Requisitos Previos

### Backend (Python)
- Python 3.11+ instalado
- Archivo `.env` configurado con `GROQ_API_KEY`

### Frontend (Node.js)
- Node.js 18+ instalado
- npm instalado

## 🔧 Primera Vez

Si es la primera vez que ejecutas el proyecto:

1. **Configura el backend:**
   ```cmd
   cd project
   copy .env.example .env
   # Edita .env y agrega tu GROQ_API_KEY
   ```

2. **Ejecuta el script:**
   ```cmd
   start-all.bat
   ```

El script se encargará de:
- Crear el entorno virtual
- Instalar todas las dependencias
- Configurar archivos necesarios
- Iniciar ambos servicios

## 📋 Notas

- Las ventanas del backend y frontend se abren en ventanas separadas
- No cierres la ventana principal hasta que los servicios estén corriendo
- Puedes cerrar la ventana principal después de que se abra el navegador
- Para detener los servicios, ejecuta `stop-all.bat` o cierra las ventanas de backend/frontend

## 🐛 Solución de Problemas

### Puerto en uso
Si ves un error de puerto en uso:
```cmd
stop-all.bat
start-all.bat
```

### Dependencias faltantes
El script instalará automáticamente las dependencias, pero si hay problemas:

**Backend:**
```cmd
cd project
venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```cmd
cd frontresume
npm install
```

### Backend no inicia
Verifica que tu `GROQ_API_KEY` esté configurado en `project\.env`

## 🎯 Flujo de Trabajo Recomendado

1. Iniciar proyecto: `start-all.bat`
2. Desarrollar/probar
3. Detener proyecto: `stop-all.bat`
4. Reiniciar si es necesario: `start-all.bat`
