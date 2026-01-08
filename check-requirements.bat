@echo off
color 0E
title Verificador de Requisitos - ResumeAI

setlocal EnableExtensions EnableDelayedExpansion

echo ============================================================
echo   VERIFICADOR DE REQUISITOS - ResumeAI
echo ============================================================
echo.
echo Este script verifica que tengas todos los programas
echo necesarios para ejecutar ResumeAI.
echo.
echo ============================================================
echo.

set "ALL_OK=1"
set "WARNINGS=0"

echo Verificando requisitos basicos...
echo ============================================================
echo.

REM ------------------------------------------------------------
REM [1/3] Python
REM ------------------------------------------------------------
echo [1/3] Verificando Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Python esta instalado

    pip --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo    OK: pip disponible
    ) else (
        echo    ADVERTENCIA: pip no disponible
        set "WARNINGS=1"
    )
) else (
    echo ERROR: Python NO esta instalado
    echo https://www.python.org/downloads/
    set "ALL_OK=0"
)
echo.

REM ------------------------------------------------------------
REM [2/3] Node.js
REM ------------------------------------------------------------
echo [2/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo OK: Node.js esta instalado

    npm --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo    OK: npm disponible
    ) else (
        echo    ADVERTENCIA: npm no disponible
        set "WARNINGS=1"
    )
) else (
    echo ERROR: Node.js NO esta instalado
    echo https://nodejs.org/
    set "ALL_OK=0"
)
echo.

REM ------------------------------------------------------------
REM [3/3] Ollama
REM ------------------------------------------------------------
echo [3/3] Verificando Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama NO esta instalado
    echo https://ollama.ai/download
    set "ALL_OK=0"
    goto SUMMARY
)

echo OK: Ollama instalado

echo Verificando servicio Ollama...
netstat -an | findstr ":11434" >nul
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Ollama no esta ejecutandose
    echo Ejecuta: ollama serve
    set "WARNINGS=1"
    goto SUMMARY
)

echo OK: Servicio Ollama activo

echo Verificando modelo llama3.1...
ollama list 2>nul | findstr "llama3.1" >nul
if %errorlevel% equ 0 (
    echo OK: Modelo llama3.1 descargado
) else (
    echo ADVERTENCIA: Modelo llama3.1 NO descargado
    echo Ejecuta: ollama pull llama3.1
    set "WARNINGS=1"
)
echo.

:SUMMARY
echo ============================================================
if "%ALL_OK%"=="1" (
    if "%WARNINGS%"=="0" (
        echo TODOS LOS REQUISITOS ESTAN CUMPLIDOS
    ) else (
        echo REQUISITOS CUMPLIDOS CON ADVERTENCIAS
    )
    echo Ejecuta: install.bat
) else (
    echo FALTAN REQUISITOS OBLIGATORIOS
)
echo ============================================================
echo.

pause
endlocal
