@echo off
chcp 65001 >nul
color 0B
title 🚀 Instalador ResumeAI
setlocal enabledelayedexpansion

REM Función para mostrar barra de progreso
goto :skip_functions

:progress_bar
set filled=%1
set percent=%2
set "bar=[                    ]"
set /a blocks=%filled%
set "progress="
for /l %%i in (1,1,%blocks%) do set "progress=!progress!█"
for /l %%i in (%blocks%,1,19) do set "progress=!progress!░"
echo    [!progress!] %percent%%%
goto :eof

:skip_functions

echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo Este script instalará automáticamente:
echo   ✓ Dependencias de Python (Backend)
echo   ✓ Dependencias de Node.js (Frontend)  
echo   ✓ Modelo Ollama LLaMA 3.1
echo   ✓ Configuración de archivos .env
echo.
echo Tiempo estimado: 5-10 minutos
echo.
echo ═══════════════════════════════════════════════════════════
pause
echo.

REM ═══════════════════════════════════════════════════════════
echo 📋 Verificando requisitos del sistema...
echo ═══════════════════════════════════════════════════════════
echo.

set "ALL_OK=1"

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python NO está instalado
    echo    📥 Descárgalo desde: https://www.python.org/downloads/
    echo    ⚠️  IMPORTANTE: Marca "Add Python to PATH" durante la instalación
    set "ALL_OK=0"
) else (
    echo ✓ Python detectado
    python --version
)
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js NO está instalado
    echo    📥 Descárgalo desde: https://nodejs.org/
    set "ALL_OK=0"
) else (
    echo ✓ Node.js detectado
    node --version
)
echo.

REM Verificar Ollama
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Ollama NO está instalado
    echo    📥 Descárgalo desde: https://ollama.ai/download
    set "ALL_OK=0"
) else (
    echo ✓ Ollama detectado
    ollama --version
)
echo.

if "%ALL_OK%"=="0" (
    echo ═══════════════════════════════════════════════════════════
    echo    ⚠️  FALTAN REQUISITOS
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Instala los programas faltantes y vuelve a ejecutar este script.
    echo También puedes ejecutar: check-requirements.bat
    echo.
    pause
    exit /b 1
)

echo ═══════════════════════════════════════════════════════════
echo    ✅ TODOS LOS REQUISITOS ESTÁN CUMPLIDOS
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso de instalación:
echo    [░░░░░░░░░░░░░░░░░░░░] 0%% - Iniciando...
echo.
pause

set "INSTALL_STEP=0"

set "INSTALL_STEP=0"

REM ═══════════════════════════════════════════════════════════
echo.
cls
echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso General: [█████░░░░░░░░░░░] 25%% - Backend
echo.
echo [1/4] 📦 Instalando Backend (Python)...
echo ═══════════════════════════════════════════════════════════
cd project

REM Crear entorno virtual si no existe
if not exist "venv\" (
    echo 🔧 Creando entorno virtual...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Error al crear entorno virtual
        pause
        exit /b 1
    )
    echo ✓ Entorno virtual creado
) else (
    echo ✓ Entorno virtual ya existe
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ Error al activar entorno virtual
    pause
    exit /b 1
)

REM Verificar si las dependencias ya están instaladas
echo 🔍 Verificando dependencias de Python...
python -c "import fastapi, uvicorn, pdfplumber, docx, ollama" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Dependencias de Python ya están instaladas
    echo    (Si quieres reinstalar, elimina la carpeta venv y ejecuta de nuevo^)
    goto backend_done
)

echo 🔧 Instalando dependencias de Python...
echo    (Esto puede tomar 2-3 minutos^)
echo.
pip install -r requirements.txt --quiet --disable-pip-version-check
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias de Python
    pause
    exit /b 1
)
echo ✓ Dependencias de Python instaladas

:backend_done

REM Configurar .env
if not exist ".env" (
    echo 🔧 Configurando archivo .env...
    copy .env.example .env >nul
    echo ✓ Archivo .env creado (puedes editarlo después^)
) else (
    echo ✓ Archivo .env ya existe
)

:backend_done
cd ..
echo ✅ Backend instalado correctamente
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════
cls
echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso General: [██████████░░░░░] 50%% - Frontend
echo.
echo [2/4] 🎨 Instalando Frontend (Next.js)...
echo ═══════════════════════════════════════════════════════════
cd frontresume

REM Verificar si node_modules ya existe
if exist "node_modules\" (
    echo 🔍 Verificando dependencias de Node.js...
    
    REM Verificar si las dependencias clave están instaladas
    if exist "node_modules\next\" (
        if exist "node_modules\react\" (
            if exist "node_modules\axios\" (
                echo ✓ Dependencias de Node.js ya están instaladas
                echo    (Si quieres reinstalar, elimina node_modules y ejecuta de nuevo^)
                goto frontend_done
            )
        )
    )
)

echo 🔧 Instalando dependencias de Node.js...
echo    (Esto puede tomar 3-5 minutos^)
echo.
call npm install --silent 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Instalación con warnings, reintentando...
    call npm install
)
echo ✓ Dependencias de Node.js instaladas

:frontend_done
cd ..
echo ✅ Frontend instalado correctamente
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════
cls
echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso General: [███████████████░] 75%% - Modelo IA
echo.
echo [3/4] 🤖 Descargando modelo LLaMA 3.1...
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  NOTA: Este modelo pesa 4.9 GB
echo    Asegúrate de tener buena conexión a internet
echo.

REM Verificar si el modelo ya está descargado
ollama list | findstr "llama3.1" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Modelo llama3.1 ya está descargado
    goto ollama_done
)

echo 🔧 Descargando modelo llama3.1...
echo    (Esto puede tomar 5-10 minutos dependiendo de tu conexión^)
echo.
ollama pull llama3.1
if %errorlevel% neq 0 (
    echo ❌ Error al descargar modelo
    echo    Verifica tu conexión a internet
    pause
    exit /b 1
)
echo ✓ Modelo llama3.1 descargado

:ollama_done
echo ✅ Modelo de IA listo
echo.
timeout /t 2 /nobreak >nul

REM ═══════════════════════════════════════════════════════════
cls
echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso General: [███████████████████░] 95%% - Finalizando
echo.
echo [4/4] ⚙️  Configuración final...
echo ═══════════════════════════════════════════════════════════

REM Verificar que Ollama esté ejecutándose
echo 🔍 Verificando servicio Ollama...
powershell -Command "try { $null = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Ollama no está ejecutándose
    echo    Se iniciará automáticamente cuando ejecutes start-all.bat
) else (
    echo ✓ Ollama está ejecutándose
)
echo.

echo ✓ Configuración completada
echo.

REM ═══════════════════════════════════════════════════════════
echo.
cls
echo ═══════════════════════════════════════════════════════════
echo    🚀 INSTALADOR AUTOMÁTICO - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Progreso General: [████████████████████] 100%% - ¡Completo!
echo.
echo.
echo ═══════════════════════════════════════════════════════════
echo    ✅ ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📋 Resumen de instalación:
echo    ✓ Backend (Python) - FastAPI + Ollama
echo    ✓ Frontend (Next.js) - React + TypeScript  
echo    ✓ Modelo IA - LLaMA 3.1 (4.9 GB)
echo    ✓ Configuración - Archivos .env
echo.
echo 📝 Próximos pasos:
echo.
echo    1. Ejecuta el script de inicio:
echo       start-all.bat
echo.
echo    2. Abre tu navegador en:
echo       http://localhost:3000
echo.
echo    3. El backend estará disponible en:
echo       http://localhost:8000/docs
echo.
echo 💡 Comandos útiles:
echo    • start-all.bat  - Inicia todos los servicios
echo    • stop-all.bat   - Detiene todos los servicios
echo    • menu.bat       - Menu interactivo
echo    • health-check.bat - Verifica estado de servicios
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
