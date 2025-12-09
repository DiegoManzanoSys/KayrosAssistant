@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════
echo    🚀 ResumeAI - Iniciando Backend y Frontend
echo ═══════════════════════════════════════════════════════
echo.

REM Guardar directorio actual
set "ROOT_DIR=%cd%"

REM ═══════════════════════════════════════════════════════
echo 📦 [1/4] Verificando Backend...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\project"

REM Verificar si existe el entorno virtual
if not exist "venv\" (
    echo ⚠️  Creando entorno virtual de Python...
    python -m venv venv
    echo ✓ Entorno virtual creado
)

REM Verificar .env
if not exist ".env" (
    echo.
    echo ⚠️  ADVERTENCIA: No se encontró .env en el backend
    echo    Copiando desde .env.example...
    copy .env.example .env >nul
    echo.
    echo ⚠️  IMPORTANTE: Configura OLLAMA en project\.env
    echo    - OLLAMA_MODEL=llama3.1:latest
    echo    - OLLAMA_BASE_URL=http://localhost:11434
    echo.
    pause
)

REM Verificar que Ollama esté corriendo
echo 🔍 Verificando Ollama...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  ADVERTENCIA: No se pudo verificar Ollama automáticamente
    echo    Si Ollama está corriendo, puedes continuar ^(presiona una tecla^).
    echo    Si no está corriendo:
    echo    1. Abre una terminal y ejecuta: ollama serve
    echo    2. Verifica en: http://localhost:11434
    echo    3. Descarga el modelo: ollama pull llama3.1:latest
    echo.
    echo 💡 Presiona cualquier tecla para continuar de todas formas...
    pause >nul
) else (
    echo ✓ Ollama está corriendo en http://localhost:11434
)

REM Instalar dependencias si es necesario
if not exist "venv\Lib\site-packages\fastapi\" (
    echo 📥 Instalando dependencias del backend...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo ✓ Dependencias instaladas
) else (
    echo ✓ Dependencias del backend ya instaladas
)

REM Verificar que ollama esté instalado
call venv\Scripts\activate.bat
python -c "import ollama" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Instalando librería ollama...
    pip install ollama
    echo ✓ Librería ollama instalada
) else (
    echo ✓ Librería ollama instalada
)
call venv\Scripts\deactivate.bat

echo.
echo ═══════════════════════════════════════════════════════
echo 🖥️  [2/4] Verificando Frontend...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\frontresume"

REM Verificar .env.local
if not exist ".env.local" (
    echo ⚠️  Creando .env.local para el frontend...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NEXT_PUBLIC_API_TIMEOUT=60000
    ) > .env.local
    echo ✓ .env.local creado
)

REM Verificar node_modules
if not exist "node_modules\" (
    echo 📥 Instalando dependencias del frontend...
    call npm install
    echo ✓ Dependencias instaladas
) else (
    echo ✓ Dependencias del frontend ya instaladas
)

echo.
echo ═══════════════════════════════════════════════════════
echo 🚀 [3/4] Iniciando Backend (FastAPI con Hot Reload)...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\project"

REM Crear logs directory si no existe
if not exist "logs\" mkdir logs

REM Iniciar backend en una nueva ventana con logs visibles
start "🔧 Backend - FastAPI [LOGS]" cmd /k "cd /d "%ROOT_DIR%\project" && title 🔧 Backend - FastAPI [LOGS] && color 0A && venv\Scripts\activate.bat && echo. && echo ═══════════════════════════════════════════════════════ && echo    🚀 BACKEND - FastAPI con Hot Reload && echo ═══════════════════════════════════════════════════════ && echo. && echo ✓ URL:  http://localhost:8000 && echo ✓ Docs: http://localhost:8000/docs && echo ✓ Hot Reload: ACTIVADO (--reload) && echo. && echo 📊 Logs en tiempo real: && echo ─────────────────────────────────────────────────────── && echo. && uvicorn app.main:app --reload --port 8000 --log-level info"

echo ✓ Backend iniciándose con hot reload...
echo   📍 URL: http://localhost:8000
echo   📚 Docs: http://localhost:8000/docs
echo   🔄 Hot Reload: ACTIVADO
echo   📊 Logs: Visibles en ventana "Backend - FastAPI [LOGS]"
echo.
echo ⏳ Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════
echo 🌐 [4/4] Iniciando Frontend (Next.js con Hot Reload)...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\frontresume"

REM Limpiar caché de Next.js
if exist ".next\" (
    echo 🧹 Limpiando caché de Next.js...
    rmdir /s /q .next 2>nul
)

REM Iniciar frontend en una nueva ventana con logs visibles
start "⚛️ Frontend - Next.js [LOGS]" cmd /k "cd /d "%ROOT_DIR%\frontresume" && title ⚛️ Frontend - Next.js [LOGS] && color 0B && echo. && echo ═══════════════════════════════════════════════════════ && echo    🌐 FRONTEND - Next.js con Fast Refresh && echo ═══════════════════════════════════════════════════════ && echo. && echo ✓ URL: http://localhost:3000 && echo ✓ Fast Refresh: ACTIVADO (automático) && echo ✓ TypeScript: Check en tiempo real && echo. && echo 📊 Logs en tiempo real: && echo ─────────────────────────────────────────────────────── && echo. && npm run dev"

echo ✓ Frontend iniciándose con fast refresh...
echo   📍 URL: http://localhost:3000
echo   🔄 Fast Refresh: ACTIVADO
echo   📊 Logs: Visibles en ventana "Frontend - Next.js [LOGS]"
echo.
echo ⏳ Esperando 8 segundos para que el frontend compile...
timeout /t 8 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════
echo ✅ ¡Todo listo!
echo ═══════════════════════════════════════════════════════
echo.
echo 🎯 Aplicación corriendo en:
echo    • Backend:  http://localhost:8000
echo    • Frontend: http://localhost:3000
echo    • API Docs: http://localhost:8000/docs
echo.
echo 💡 Dos ventanas CON LOGS se han abierto:
echo    1. 🔧 Backend - FastAPI [LOGS]  (verde) - Puerto 8000
echo    2. ⚛️ Frontend - Next.js [LOGS] (azul)  - Puerto 3000
echo.
echo 🔄 HOT RELOAD ACTIVADO:
echo    • Backend:  Cambios en archivos .py se recargan automáticamente
echo    • Frontend: Fast Refresh detecta cambios en componentes React
echo.
echo 📊 LOGS EN TIEMPO REAL:
echo    • Todas las peticiones HTTP aparecen en la ventana del backend
echo    • Compilación y errores aparecen en la ventana del frontend
echo    • TypeScript errors se muestran en tiempo real
echo.
echo 🛑 Para detener los servicios:
echo    • Ejecuta stop-all.bat
echo    • O cierra ambas ventanas de logs
echo    • O presiona Ctrl+C en cada ventana
echo.
echo 🌐 Abriendo navegador...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo ═══════════════════════════════════════════════════════
echo Presiona cualquier tecla para cerrar esta ventana...
echo ═══════════════════════════════════════════════════════
pause >nul
