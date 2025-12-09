@echo off
echo ===================================
echo Document Summarizer API
echo ===================================
echo.

REM Verificar si existe el entorno virtual
if not exist "venv\" (
    echo Creando entorno virtual...
    python -m venv venv
    echo.
)

REM Verificar si existe .env
if not exist ".env" (
    echo.
    echo ADVERTENCIA: No se encontró el archivo .env
    echo Por favor, copia .env.example a .env y configura tus API keys
    echo.
    pause
    exit /b
)

REM Cargar variables de entorno desde .env
echo Cargando configuración...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if not "%%a"=="" if not "%%a:~0,1"=="#" (
        set "%%a=%%b"
    )
)

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate.bat

REM Instalar dependencias si es necesario
if not exist "venv\Lib\site-packages\fastapi" (
    echo.
    echo Instalando dependencias...
    pip install -r requirements.txt
)

REM Iniciar servidor
echo.
echo ===================================
echo Iniciando servidor...
echo API disponible en: http://localhost:8000
echo Documentación: http://localhost:8000/docs
echo ===================================
echo.
uvicorn app.main:app --reload
