# app/services/extractor.py
import pdfplumber
from docx import Document
from typing import List

def extract_text_from_pdf(path: str) -> str:
    """
    Extrae texto de un PDF intentando página por página.
    """
    text_pages: List[str] = []
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_pages.append(page_text)
    except Exception as e:
        # En producción registra el error
        raise RuntimeError(f"PDF extraction failed: {e}")
    return "\n\n".join(text_pages).strip()

def extract_text_from_docx(path: str) -> str:
    """
    Extrae texto de .docx por párrafo.
    """
    try:
        doc = Document(path)
        paragraphs = [p.text for p in doc.paragraphs if p.text and p.text.strip() != ""]
        return "\n\n".join(paragraphs).strip()
    except Exception as e:
        raise RuntimeError(f"DOCX extraction failed: {e}")
