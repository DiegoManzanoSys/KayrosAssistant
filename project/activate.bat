@echo off
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo.
echo ================================
echo Entorno virtual activado
echo ================================
echo.
echo Para iniciar el servidor ejecuta:
echo   uvicorn app.main:app --reload
echo.
echo O simplemente ejecuta:
echo   start.bat
echo.
