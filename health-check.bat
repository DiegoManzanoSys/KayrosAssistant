@echo off
chcp 65001 >nul
color 0A
title 💚 Health Check - ResumeAI

echo ═══════════════════════════════════════════════════════════
echo    💚 HEALTH CHECK - ResumeAI
echo ═══════════════════════════════════════════════════════════
echo.
echo Verificando estado de todos los servicios...
echo.

set "ALL_OK=1"

REM ═══════════════════════════════════════════════════════════
echo [1/3] Verificando Backend (FastAPI)...
echo ═══════════════════════════════════════════════════════════

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Backend: ONLINE
    echo    URL: http://localhost:8000
    echo    API Docs: http://localhost:8000/docs
    
    REM Verificar endpoint específico
    powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8000' -Method GET -TimeoutSec 5; if ($response.ok -eq $true) { Write-Host '    Status: OK - Service running' } else { Write-Host '    Status: Degraded' } } catch { Write-Host '    Status: Error' }" 2>nul
) else (
    echo ❌ Backend: OFFLINE
    echo    El servidor FastAPI no está respondiendo
    echo    💡 Ejecuta: start-all.bat
    set "ALL_OK=0"
)
echo.

REM ═══════════════════════════════════════════════════════════
echo [2/3] Verificando Frontend (Next.js)...
echo ═══════════════════════════════════════════════════════════

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Frontend: ONLINE
    echo    URL: http://localhost:3000
    echo    Status: Serving pages
) else (
    echo ❌ Frontend: OFFLINE
    echo    El servidor Next.js no está respondiendo
    echo    💡 Ejecuta: start-all.bat
    set "ALL_OK=0"
)
echo.

REM ═══════════════════════════════════════════════════════════
echo [3/3] Verificando Ollama (LLM Service)...
echo ═══════════════════════════════════════════════════════════

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:11434/api/tags' -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Ollama: ONLINE
    echo    URL: http://localhost:11434
    
    REM Verificar modelo llama3.1
    ollama list | findstr "llama3.1" >nul 2>&1
    if %errorlevel% equ 0 (
        echo    Status: Model llama3.1 loaded
        
        REM Mostrar información del modelo
        for /f "tokens=1,2,3" %%a in ('ollama list ^| findstr "llama3.1"') do (
            echo    Model: %%a
            echo    Size: %%c
        )
    ) else (
        echo    ⚠️  Model llama3.1 not found
        echo    💡 Ejecuta: ollama pull llama3.1
        set "ALL_OK=0"
    )
) else (
    echo ❌ Ollama: OFFLINE
    echo    El servicio Ollama no está respondiendo
    echo    💡 Ejecuta: ollama serve
    set "ALL_OK=0"
)
echo.

REM ═══════════════════════════════════════════════════════════
echo ═══════════════════════════════════════════════════════════
echo    📊 RESUMEN DEL HEALTH CHECK
echo ═══════════════════════════════════════════════════════════
echo.

if "%ALL_OK%"=="1" (
    echo ✅ TODOS LOS SERVICIOS ESTÁN FUNCIONANDO CORRECTAMENTE
    echo.
    echo 🎉 ResumeAI está listo para usar:
    echo    • Frontend: http://localhost:3000
    echo    • API Backend: http://localhost:8000/docs
    echo    • Ollama: http://localhost:11434
) else (
    echo ⚠️  ALGUNOS SERVICIOS NO ESTÁN DISPONIBLES
    echo.
    echo 💡 Soluciones:
    echo    1. Ejecuta: start-all.bat
    echo    2. Verifica los logs: logs-only.bat
    echo    3. Reinicia los servicios: stop-all.bat && start-all.bat
)
echo.
echo ═══════════════════════════════════════════════════════════

REM ═══════════════════════════════════════════════════════════
echo.
echo 📈 Información adicional del sistema:
echo ═══════════════════════════════════════════════════════════
echo.

REM Mostrar procesos relacionados
echo 🔍 Procesos activos:
tasklist | findstr /i "python node ollama uvicorn" 2>nul
if %errorlevel% neq 0 (
    echo    No se encontraron procesos de ResumeAI ejecutándose
)
echo.

REM Mostrar puertos en uso
echo 🔌 Puertos en uso:
netstat -ano | findstr ":3000 :8000 :11434" 2>nul
if %errorlevel% neq 0 (
    echo    No hay puertos de ResumeAI en uso
)
echo.

echo ═══════════════════════════════════════════════════════════
echo.
