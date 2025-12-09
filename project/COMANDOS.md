# 📋 Comandos Útiles

## 🚀 Iniciar el Proyecto

### Opción 1: Script Automático (Recomendado)
```cmd
start.bat
```

### Opción 2: Activar entorno y ejecutar manualmente
```cmd
activate.bat
uvicorn app.main:app --reload
```

### Opción 3: Comando directo (sin activar)
```cmd
venv\Scripts\uvicorn.exe app.main:app --reload
```

## 🔧 Gestión del Entorno Virtual

### Activar entorno virtual
```cmd
venv\Scripts\activate
```

### Desactivar entorno virtual
```cmd
deactivate
```

### Ver librerías instaladas
```cmd
venv\Scripts\pip.exe list
```

### Instalar nueva librería
```cmd
venv\Scripts\pip.exe install nombre-libreria
```

### Actualizar requirements.txt
```cmd
venv\Scripts\pip.exe freeze > requirements.txt
```

## 🧪 Testing

### Ejecutar todos los tests
```cmd
venv\Scripts\pytest.exe
```

### Ejecutar tests con más detalles
```cmd
venv\Scripts\pytest.exe -v
```

### Ejecutar un test específico
```cmd
venv\Scripts\pytest.exe tests/test_extractor.py
```

## 🌐 URLs del Proyecto

Una vez iniciado el servidor:

- **API Principal**: http://localhost:8000
- **Documentación Swagger**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📝 Configuración

### Editar variables de entorno
```cmd
notepad .env
```

Variables disponibles:
- `AI_PROVIDER`: grok, openai, claude, gemini
- `AI_API_KEY`: Tu API key del proveedor seleccionado

## 🐳 Docker

### Construir imagen
```cmd
docker build -t document-summarizer .
```

### Ejecutar contenedor
```cmd
docker run -d -p 8000:8000 ^
  -e AI_PROVIDER=grok ^
  -e AI_API_KEY=tu_api_key ^
  --name summarizer ^
  document-summarizer
```

### Ver logs del contenedor
```cmd
docker logs -f summarizer
```

### Detener contenedor
```cmd
docker stop summarizer
```

### Eliminar contenedor
```cmd
docker rm summarizer
```

## 🧹 Limpieza

### Eliminar archivos caché de Python
```cmd
rd /s /q __pycache__
rd /s /q app\__pycache__
rd /s /q app\api\__pycache__
rd /s /q app\services\__pycache__
rd /s /q app\schemas\__pycache__
rd /s /q app\utils\__pycache__
```

### Recrear entorno virtual
```cmd
rd /s /q venv
python -m venv venv
venv\Scripts\pip.exe install -r requirements.txt
```

## 📦 Git

### Inicializar repositorio
```cmd
git init
git add .
git commit -m "Initial commit"
```

### Ignorar archivos (ya configurado en .gitignore)
- venv/
- .env
- __pycache__/
- *.pyc

## 🔍 Debugging

### Ver versión de Python
```cmd
venv\Scripts\python.exe --version
```

### Verificar imports
```cmd
venv\Scripts\python.exe -c "import fastapi; print(fastapi.__version__)"
```

### Modo debug de Uvicorn
```cmd
venv\Scripts\uvicorn.exe app.main:app --reload --log-level debug
```

## 📊 Monitoreo

### Ver procesos de Python activos
```cmd
tasklist | findstr python
```

### Matar proceso en puerto 8000 (si está ocupado)
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

## 💡 Tips Rápidos

- **Hot Reload**: El flag `--reload` recarga automáticamente al cambiar código
- **Puerto personalizado**: `--port 8001`
- **Host externo**: `--host 0.0.0.0` para acceder desde otras máquinas
- **Workers**: `--workers 4` para producción

¡Listo para desarrollar! 🎉
