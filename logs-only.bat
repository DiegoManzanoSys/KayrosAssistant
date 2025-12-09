@echo off
chcp 65001 >nul
title 📊 ResumeAI - Monitor de Logs

echo ═══════════════════════════════════════════════════════
echo    📊 ResumeAI - Monitor de Logs en Tiempo Real
echo ═══════════════════════════════════════════════════════
echo.
echo Este script muestra los logs del backend y frontend
echo en ventanas separadas para facilitar el debugging.
echo.
echo ⚠️  IMPORTANTE: Los servicios ya deben estar corriendo
echo    Si no están corriendo, ejecuta start-all.bat primero
echo.
pause

set "ROOT_DIR=%cd%"

REM Abrir logs del backend
echo.
echo 📂 Abriendo logs del Backend...
if exist "project\logs\" (
    start "📋 Backend Logs" cmd /k "cd /d "%ROOT_DIR%\project\logs" && title 📋 Backend Logs && color 0A && echo Monitoreando logs del backend... && echo. && powershell -Command "Get-Content -Path 'uvicorn.log' -Wait -Tail 50" 2>nul || echo ⚠️ Archivo de log no encontrado. El backend debe estar corriendo."
) else (
    echo ⚠️ Directorio de logs no encontrado. Iniciando monitor directo...
    start "📋 Backend Logs" cmd /k "title 📋 Backend Logs && color 0A && echo Backend debe generar logs... && pause"
)

REM Abrir logs del frontend
echo 📂 Abriendo logs del Frontend...
start "📋 Frontend Logs" cmd /k "cd /d "%ROOT_DIR%\frontresume" && title 📋 Frontend Logs && color 0B && echo Logs de Next.js están en la ventana principal de npm run dev && echo. && echo Para ver logs detallados: && echo   npm run dev -- --debug && echo. && pause"

echo.
echo ═══════════════════════════════════════════════════════
echo ✅ Ventanas de logs abiertas
echo ═══════════════════════════════════════════════════════
echo.
echo 💡 Dos ventanas de monitoreo:
echo    1. 📋 Backend Logs  (verde)
echo    2. 📋 Frontend Logs (azul)
echo.
echo 🔄 Los logs se actualizan automáticamente
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
