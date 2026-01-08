@echo off
chcp 65001 >nul
echo ===================================================
echo ResumeAI - Iniciando (Modo Normal)
echo ===================================================
echo.

REM Guardar directorio actual
set "ROOT_DIR=%cd%"

echo ===================================================
echo [1/4] Verificando Backend
echo ===================================================
cd /d "%ROOT_DIR%\project"

REM Verificar si existe el entorno virtual
if not exist "venv\" (
    echo Creando entorno virtual de Python
    python -m venv venv
    echo Entorno virtual creado
)

REM Verificar .env
if not exist ".env" (
    echo.
    echo ADVERTENCIA: No se encontro .env en el backend
    echo Copiando desde .env.example
    copy .env.example .env >nul
    echo.
    echo IMPORTANTE: Configura OLLAMA en project\.env
    echo - OLLAMA_MODEL=llama3.1:latest
    echo - OLLAMA_BASE_URL=http://localhost:11434
    echo.
    pause
)

REM Verificar que Ollama este corriendo
echo Verificando Ollama
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Ollama no esta corriendo. Iniciando modelo llama3.1
    echo.
    
    REM Iniciar Ollama con el modelo llama3.1 en segundo plano (SIN VENTANA)
    start /b cmd /c "ollama run llama3.1" >nul 2>&1
    
    echo Esperando 8 segundos para que Ollama y el modelo carguen
    timeout /t 8 /nobreak >nul
    
    REM Verificar nuevamente
    powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -Method GET -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: No se pudo iniciar Ollama automaticamente
        echo Por favor:
        echo 1. Verifica que Ollama este instalado: ollama --version
        echo 2. Inicia manualmente en otra terminal: ollama run llama3.1
        echo 3. Si no tienes el modelo: ollama pull llama3.1:latest
        echo.
        pause
        exit /b 1
    ) else (
        echo Ollama iniciado correctamente en http://localhost:11434
        echo Modelo llama3.1 cargado y listo
    )
) else (
    echo Ollama ya esta corriendo en http://localhost:11434
)

REM Instalar dependencias si es necesario
if not exist "venv\Lib\site-packages\fastapi\" (
    echo Instalando dependencias del backend
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo Dependencias instaladas
) else (
    echo Dependencias del backend ya instaladas
)

REM Verificar que ollama esté instalado
call venv\Scripts\activate.bat
python -c "import ollama" >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando libreria ollama
    pip install ollama
    echo Libreria ollama instalada
) else (
    echo Libreria ollama instalada
)
call venv\Scripts\deactivate.bat

echo.
echo ===================================================
echo [2/4] Verificando Frontend
echo ===================================================
cd /d "%ROOT_DIR%\frontresume"

REM Verificar .env.local
if not exist ".env.local" (
    echo Creando .env.local para el frontend
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NEXT_PUBLIC_API_TIMEOUT=60000
    ) > .env.local
    echo .env.local creado
)

REM Verificar node_modules
if not exist "node_modules\" (
    echo Instalando dependencias del frontend
    call npm install
    echo Dependencias instaladas
) else (
    echo Dependencias del frontend ya instaladas
)

echo.
echo ===================================================
echo [3/4] Iniciando Backend (FastAPI en segundo plano)
echo ===================================================
cd /d "%ROOT_DIR%\project"

REM Crear logs directory si no existe
if not exist "logs\" mkdir logs

REM Iniciar backend en segundo plano SIN VENTANA
start /b cmd /c "cd /d %ROOT_DIR%\project && venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000 --log-level info > logs\backend.log 2>&1"

echo Backend iniciandose en segundo plano
echo URL: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo Hot Reload: ACTIVADO
echo Logs: project\logs\backend.log
echo.
echo Esperando 5 segundos para que el backend inicie
timeout /t 5 /nobreak >nul

echo.
echo ===================================================
echo [4/4] Iniciando Frontend (Next.js en segundo plano)
echo ===================================================
cd /d "%ROOT_DIR%\frontresume"

REM Limpiar caché de Next.js
if exist ".next\" (
    echo Limpiando cache de Next.js
    rmdir /s /q .next 2>nul
)

REM Iniciar frontend en segundo plano SIN VENTANA
start /b cmd /c "cd /d %ROOT_DIR%\frontresume && npm run dev > ..\project\logs\frontend.log 2>&1"

echo Frontend iniciandose en segundo plano
echo URL: http://localhost:3000
echo Fast Refresh: ACTIVADO
echo Logs: project\logs\frontend.log
echo.
echo Esperando 8 segundos para que el frontend compile
timeout /t 8 /nobreak >nul

echo.
echo ===================================================
echo TODO LISTO!
echo ===================================================
echo.
echo Aplicacion corriendo en:
echo - Backend:  http://localhost:8000
echo - Frontend: http://localhost:3000
echo - API Docs: http://localhost:8000/docs
echo.
echo Servicios ejecutandose EN SEGUNDO PLANO:
echo - Backend:  Sin ventana visible
echo - Frontend: Sin ventana visible
echo - Ollama:   Sin ventana visible
echo.
echo LOGS guardados en:
echo - Backend:  project\logs\backend.log
echo - Frontend: project\logs\frontend.log
echo - Ver logs en tiempo real: logs-only.bat
echo.
echo HOT RELOAD ACTIVADO:
echo - Backend:  Cambios en archivos .py se recargan automaticamente
echo - Frontend: Fast Refresh detecta cambios en componentes React
echo.
echo Para detener los servicios:
echo - Ejecuta stop-all.bat
echo.
echo Para ver consolas y logs en tiempo real:
echo - Ejecuta start-all-debug.bat
echo.
echo Abriendo navegador
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo ===================================================
echo Presiona cualquier tecla para cerrar esta ventana
echo ===================================================
pause >nul
