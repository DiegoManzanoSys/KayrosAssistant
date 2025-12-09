import os
import time
from typing import List
import requests

# Configuración para Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# división de texto para evitar límites
CHUNK_SIZE_CHARS = 2500


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE_CHARS) -> List[str]:
    """
    Divide textos grandes en partes más pequeñas para evitar límites de tokens.
    """
    text = text.strip()
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = min(len(text), start + chunk_size)

        # intenta cortar en salto de línea
        if end < len(text):
            nl = text.rfind("\n", start, end)
            if nl > start:
                end = nl

        chunks.append(text[start:end].strip())
        start = end

    return chunks


def build_prompt(chunk: str, summary_type: str):
    """
    Prompt según el tipo de resumen.
    """
    instructions = {
        "general": "Resume el siguiente texto de forma clara y coherente, manteniendo los puntos clave.",
        "bullets": "Resume el siguiente texto usando bullets (no más de 8).",
        "tldr": "Proporciona un TL;DR en máximo dos oraciones.",
        "business": "Resume el texto con foco en implicaciones de negocio y acciones recomendadas.",
        "academic": "Resume el contenido con enfoque en puntos principales, metodología y conclusiones.",
    }

    inst = instructions.get(summary_type, instructions["general"])
    markdown_note = "Devuelve el resumen en formato Markdown, bien estructurado y como documento formal."
    return f"{inst}\n{markdown_note}\n\nTexto:\n{chunk}\n\nResumen:"


def call_groq_api(prompt: str, max_tokens: int = 1024) -> str:
    """
    Llamada correcta a la API de Groq, usando modelos válidos.
    """
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY no está definido en variables de entorno")

    payload = {
        "model": "groq/compound-mini",  
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.2,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    resp = requests.post(GROQ_API_URL, json=payload, headers=headers, timeout=1000)

    if resp.status_code != 200:
        raise RuntimeError(f"Groq API error: {resp.status_code} - {resp.text}")

    data = resp.json()

    try:
        return data["choices"][0]["message"]["content"]
    except:
        raise RuntimeError(f"Formato inesperado de respuesta: {data}")


def summarize_text_with_groq(
        text: str,
        summary_type: str = "general",
        max_tokens: int = 1024
) -> str:
    """
    Divide el texto en chunks, resume cada chunk y luego combina todo.
    """
    chunks = chunk_text(text)
    partial_summaries = []

    for i, chunk in enumerate(chunks):
        prompt = build_prompt(chunk, summary_type)

        try:
            partial = call_groq_api(prompt, max_tokens=max_tokens)
        except Exception:
            time.sleep(1)
            partial = call_groq_api(prompt, max_tokens=max_tokens)

        partial_summaries.append(partial.strip())

    # si solo fue un resumen
    if len(partial_summaries) == 1:
        markdown = f"""\n## Resumen\n\n{partial_summaries[0].strip()}\n"""
        return markdown

    # síntesis final
    combined = "\n\n".join(partial_summaries)

    final_prompt = (
        f"Fusiona y sintetiza los siguientes resúmenes parciales "
        f"en un resumen único, coherente y compacto (tipo: {summary_type}):\n\n"
        f"{combined}\n\nResumen final:"
    )

    final = call_groq_api(final_prompt, max_tokens=max_tokens)
    markdown = f"""\n## Resumen\n\n{final.strip()}\n"""
    return markdown
