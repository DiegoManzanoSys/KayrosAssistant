@echo off
chcp 65001 >nul

:menu
cls
color 0B
title 🤖 ResumeAI - Menu Principal

echo.
echo ═══════════════════════════════════════════════════════════
echo           🤖 ResumeAI - Menu Principal
echo ═══════════════════════════════════════════════════════════
echo.
echo  Gestión del Sistema:
echo  ────────────────────────────────────────────────────────
echo   [1] 🔍 Verificar requisitos del sistema
echo   [2] 📦 Instalar dependencias (primera vez)
echo   [3] 🚀 Iniciar aplicación (modo normal)
echo   [4] 🐛 Iniciar aplicación (modo debug con consolas)
echo   [5] 🛑 Detener aplicación
echo.
echo  Monitoreo y Logs:
echo  ────────────────────────────────────────────────────────
echo   [6] 📋 Ver logs de todos los servicios
echo   [7] 💚 Health check (estado de servicios)
echo.
echo  Documentación:
echo  ────────────────────────────────────────────────────────
echo   [8] 📖 Ver guía de instalación
echo   [9] 📚 Ver documentación de la API
echo   [A] 🌐 Abrir frontend en navegador
echo.
echo   [0] ❌ Salir
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p choice="Selecciona una opción (0-9,A): "

if "%choice%"=="1" (
    cls
    call check-requirements.bat
    pause
    goto menu
)

if "%choice%"=="2" (
    cls
    call install.bat
    pause
    goto menu
)

if "%choice%"=="3" (
    cls
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    🚀 Iniciando ResumeAI (Modo Normal)...
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Servicios se ejecutarán EN SEGUNDO PLANO (sin ventanas)
    echo Logs guardados en: project\logs\
    echo.
    pause
    call start-all.bat
    goto menu
)

if "%choice%"=="4" (
    cls
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    🐛 Iniciando ResumeAI (Modo Debug)...
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Se abrirán 3 ventanas CON LOGS VISIBLES:
    echo   • Ollama (LLM) - Puerto 11434
    echo   • Backend (FastAPI) - Puerto 8000
    echo   • Frontend (Next.js) - Puerto 3000
    echo.
    pause
    call start-all-debug.bat
    goto menu
)

if "%choice%"=="5" (
    cls
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    🛑 Deteniendo ResumeAI...
    echo ═══════════════════════════════════════════════════════════
    echo.
    call stop-all.bat
    pause
    goto menu
)

if "%choice%"=="6" (
    cls
    call logs-only.bat
    pause
    goto menu
)

if "%choice%"=="7" (
    cls
    call health-check.bat
    pause
    goto menu
)

if "%choice%"=="8" (
    cls
    if exist "README_INSTALACION.md" (
        type README_INSTALACION.md
    ) else (
        echo ⚠️  Archivo README_INSTALACION.md no encontrado
    )
    echo.
    pause
    goto menu
)

if "%choice%"=="9" (
    cls
    if exist "project\API_DOCUMENTATION.md" (
        echo.
        echo 📚 Abriendo documentación de la API...
        echo.
        start http://localhost:8000/docs
        echo ✓ Se abrió el navegador con la documentación Swagger
        echo.
        echo 💡 Si el servidor no está ejecutándose, primero ejecuta la opción [3] o [4]
        echo.
    ) else (
        echo ⚠️  Archivo API_DOCUMENTATION.md no encontrado
    )
    pause
    goto menu
)

if /i "%choice%"=="A" (
    cls
    echo.
    echo 🌐 Abriendo frontend en navegador...
    echo.
    start http://localhost:3000
    echo ✓ Se abrió el navegador
    echo.
    echo 💡 Si ves un error, asegúrate de haber ejecutado la opción [3] o [4]
    echo.
    pause
    goto menu
)

if "%choice%"=="0" (
    cls
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo    👋 ¡Hasta pronto!
    echo ═══════════════════════════════════════════════════════════
    echo.
    timeout /t 2 /nobreak >nul
    exit
)

echo.
echo ⚠️  Opción no válida. Selecciona un número del 0 al 9.
timeout /t 2 /nobreak >nul
goto menu
