import os
import time
from typing import List
import ollama

# Configuración para Ollama
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:latest")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# División de texto para evitar límites
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


def call_ollama_api(prompt: str, max_tokens: int = 1024) -> str:
    """
    Llamada a Ollama usando el modelo local llama3.1.
    """
    try:
        # Configurar cliente de Ollama
        client = ollama.Client(host=OLLAMA_BASE_URL)
        
        # Realizar la llamada al modelo
        response = client.chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "num_predict": max_tokens,
                "temperature": 0.2,
            }
        )
        
        # Extraer el contenido de la respuesta
        return response['message']['content']
        
    except Exception as e:
        raise RuntimeError(f"Ollama API error: {str(e)}")


def summarize_text_with_ollama(
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
            partial = call_ollama_api(prompt, max_tokens=max_tokens)
        except Exception:
            time.sleep(1)
            partial = call_ollama_api(prompt, max_tokens=max_tokens)

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

    final = call_ollama_api(final_prompt, max_tokens=max_tokens)
    markdown = f"""\n## Resumen\n\n{final.strip()}\n"""
    return markdown
