@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════
echo    🛑 Deteniendo ResumeAI - Backend y Frontend
echo ═══════════════════════════════════════════════════════
echo.

echo 🔍 Buscando procesos...
echo.

REM Detener procesos de Node (Frontend)
echo 🌐 Deteniendo Frontend (Node.js)...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Frontend detenido
) else (
    echo ℹ️  No se encontraron procesos de Node.js
)
echo.

REM Detener procesos de Python/Uvicorn (Backend)
echo 🖥️  Deteniendo Backend (Python/Uvicorn)...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq ResumeAI Backend*" 2>nul
taskkill /F /IM python.exe /FI "COMMANDLINE eq *uvicorn*" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Backend detenido
) else (
    echo ℹ️  No se encontraron procesos de Python/Uvicorn
)
echo.

REM Liberar puertos si están ocupados
echo 🔌 Verificando puertos...
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3000 aún en uso, liberando...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do taskkill /F /PID %%a 2>nul
)

netstat -ano | findstr ":8000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 8000 aún en uso, liberando...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000"') do taskkill /F /PID %%a 2>nul
)

echo.
echo ═══════════════════════════════════════════════════════
echo ✅ Servicios detenidos
echo ═══════════════════════════════════════════════════════
echo.
pause
