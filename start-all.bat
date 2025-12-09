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
    echo ⚠️  IMPORTANTE: Configura tu GROQ_API_KEY en project\.env
    echo.
    pause
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
echo 🚀 [3/4] Iniciando Backend (FastAPI)...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\project"

REM Iniciar backend en una nueva ventana
start "ResumeAI Backend - FastAPI" cmd /k "cd /d "%ROOT_DIR%\project" && venv\Scripts\activate.bat && echo ✓ Backend iniciado en http://localhost:8000 && echo ✓ Documentación en http://localhost:8000/docs && echo. && uvicorn app.main:app --reload --port 8000"

echo ✓ Backend iniciándose en segundo plano...
echo   📍 URL: http://localhost:8000
echo   📚 Docs: http://localhost:8000/docs
echo.
echo ⏳ Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════
echo 🌐 [4/4] Iniciando Frontend (Next.js)...
echo ═══════════════════════════════════════════════════════
cd /d "%ROOT_DIR%\frontresume"

REM Limpiar caché de Next.js
if exist ".next\" (
    echo 🧹 Limpiando caché de Next.js...
    rmdir /s /q .next 2>nul
)

REM Iniciar frontend en una nueva ventana
start "ResumeAI Frontend - Next.js" cmd /k "cd /d "%ROOT_DIR%\frontresume" && echo ✓ Frontend iniciado en http://localhost:3000 && echo. && npm run dev"

echo ✓ Frontend iniciándose en segundo plano...
echo   📍 URL: http://localhost:3000
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
echo 💡 Dos ventanas se han abierto:
echo    1. ResumeAI Backend - FastAPI  (puerto 8000)
echo    2. ResumeAI Frontend - Next.js (puerto 3000)
echo.
echo 🛑 Para detener los servicios:
echo    • Cierra ambas ventanas
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
