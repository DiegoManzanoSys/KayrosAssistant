"""
Tests para el módulo extractor
"""
import pytest
from app.services.extractor import extract_text_from_file

def test_extract_text_from_pdf():
    """Test básico para extracción de PDF"""
    # Este test necesita un archivo PDF de prueba
    # Por ahora es un placeholder
    pass

def test_extract_text_from_docx():
    """Test básico para extracción de DOCX"""
    # Este test necesita un archivo DOCX de prueba
    # Por ahora es un placeholder
    pass

def test_unsupported_extension():
    """Test para extensiones no soportadas"""
    with pytest.raises(ValueError):
        extract_text_from_file("/fake/path.txt", ".txt")
