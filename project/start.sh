#!/bin/bash

echo "==================================="
echo "Document Summarizer API"
echo "==================================="
echo ""

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
    echo ""
fi

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo ""
echo "Instalando dependencias..."
pip install -r requirements.txt

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo ""
    echo "ADVERTENCIA: No se encontró el archivo .env"
    echo "Por favor, copia .env.example a .env y configura tus API keys"
    echo ""
    read -p "Presiona Enter para continuar..."
    exit 1
fi

# Iniciar servidor
echo ""
echo "==================================="
echo "Iniciando servidor..."
echo "API disponible en: http://localhost:8000"
echo "Documentación: http://localhost:8000/docs"
echo "==================================="
echo ""
uvicorn app.main:app --reload
