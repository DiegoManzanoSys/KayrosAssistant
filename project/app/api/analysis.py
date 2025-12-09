from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from app.services.ai_client import call_groq_api, chunk_text, CHUNK_SIZE_CHARS

router = APIRouter()

def get_text(text: Optional[str], file: Optional[UploadFile]) -> str:
    if text:
        return text
    if file:
        return file.file.read().decode("utf-8", errors="ignore")
    return ""


def _call_over_chunks(text: str, per_chunk_prompt_fn, combine_prompt_fn: Optional[call_groq_api.__class__] = None):
    """
    Helper: divide `text` en chunks y llama a `per_chunk_prompt_fn(chunk)` para cada uno.
    - per_chunk_prompt_fn: función(chunk) -> prompt_str
    - combine_prompt_fn: función(list_of_responses) -> final_markdown (si se pasa, recibe lista de respuestas y debe devolver string);
      si no se pasa, concatena respuestas y devuelve la unión.
    Devuelve un string Markdown.
    """
    if not text or text.strip() == "":
        return ""

    chunks = chunk_text(text)
    partials = []

    for chunk in chunks:
        prompt = per_chunk_prompt_fn(chunk)
        try:
            resp = call_groq_api(prompt)
        except Exception:
            # un retry simple
            resp = call_groq_api(prompt)
        partials.append(resp.strip())

    if combine_prompt_fn:
        return combine_prompt_fn(partials)

    # Default: unir parciales y devolverlos como un solo bloque Markdown
    return "\n\n".join(partials)

@router.post("/extract-keywords")
async def extract_keywords(text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    """
    Extrae palabras clave usando LLM (Groq API).
    """
    input_text = get_text(text, file)

    def per_chunk_prompt(chunk):
        return (
            "Extrae las palabras clave más importantes del siguiente texto. "
            "Devuelve el resultado en formato Markdown, como una lista de bullets (una palabra o frase por bullet).\n\n"
            f"Texto:\n{chunk}\n\nPalabras clave:"
        )

    def combine(partials: List[str]) -> str:
        # pedimos al LLM que combine y deduplice las listas parciales
        joined = "\n\n".join(partials)
        prompt = (
            "Combina y deduplica las siguientes listas de palabras clave. "
            "Devuelve el resultado en formato Markdown, como una lista de bullets única y ordenada por relevancia.\n\n"
            f"Listas parciales:\n{joined}\n\nLista única de palabras clave:"
        )
        return call_groq_api(prompt)

    # Si texto es pequeño, un solo llamado; si no, usar chunking + combinación
    if len(input_text) <= CHUNK_SIZE_CHARS:
        prompt = per_chunk_prompt(input_text)
        markdown = call_groq_api(prompt)
    else:
        markdown = _call_over_chunks(input_text, per_chunk_prompt, combine)

    return {"markdown": markdown}
async def extract_entities(text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    """
    Extrae entidades nombradas usando LLM (Groq API). Maneja textos grandes por chunks.
    """
    input_text = get_text(text, file)

    def per_chunk_prompt(chunk):
        return (
            "Extrae las entidades nombradas (Personas, Organizaciones, Lugares, Fechas) del siguiente texto. "
            "Devuelve el resultado en formato Markdown con bullets ' - Nombre (Tipo)'.\n\n"
            f"Texto:\n{chunk}\n\nEntidades:"
        )

    def combine(partials: List[str]) -> str:
        joined = "\n\n".join(partials)
        prompt = (
            "Combina y deduplica las siguientes listas parciales de entidades y organiza por tipo. "
            "Devuelve el resultado en formato Markdown con bullets.\n\n"
            f"Listas parciales:\n{joined}\n\nEntidades combinadas:"
        )
        return call_groq_api(prompt)

    if len(input_text) <= CHUNK_SIZE_CHARS:
        markdown = call_groq_api(per_chunk_prompt(input_text))
    else:
        markdown = _call_over_chunks(input_text, per_chunk_prompt, combine)

    return {"markdown": markdown}

@router.post("/compare-texts")
async def compare_texts(texts: List[str] = Form(...)):
    """
    Compara dos o más textos y devuelve similitud/diferencias usando LLM.
    """
    markdown_instruction = "Devuelve el resultado en formato de documento Markdown, bien organizado y visualmente atractivo."
    # Si algún texto es muy grande, hacemos un paso de resumen por texto antes de comparar
    safe_texts = []
    for t in texts:
        if len(t) <= CHUNK_SIZE_CHARS:
            safe_texts.append(t)
        else:
            parts = []
            for c in chunk_text(t):
                sum_prompt = (
                    "Resume el siguiente texto en 2-3 oraciones manteniendo puntos clave. Devuelve solo el resumen.\n\n"
                    f"Texto:\n{c}\n\nResumen:"
                )
                parts.append(call_groq_api(sum_prompt).strip())
            safe_texts.append("\n\n".join(parts))

    prompt_safe = (
        f"Compara los siguientes textos y analiza similitudes y diferencias. {markdown_instruction}\n\n"
        + "\n\n".join([f"Texto {i+1}:\n{text}" for i, text in enumerate(safe_texts)])
        + "\n\nResumen de comparación:"
    )
    markdown = call_groq_api(prompt_safe)
    return {"markdown": markdown}

@router.post("/question")
async def question_answer(file: UploadFile = File(...), question: str = Form(...)):
    """
    Responde preguntas sobre el contenido de un documento usando LLM.
    """
    markdown_instruction = "Devuelve el resultado en formato de documento Markdown, bien organizado y visualmente atractivo."
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    # Si el documento es grande, primero resumimos por chunks y luego respondemos sobre la síntesis
    if len(text) <= CHUNK_SIZE_CHARS:
        prompt = (
            f"Responde la siguiente pregunta sobre el texto proporcionado. {markdown_instruction}\n\n"
            f"Texto:\n{text}\n\nPregunta: {question}\n\nRespuesta:"
        )
        markdown = call_groq_api(prompt)
        return {"markdown": markdown}

    summaries = []
    for c in chunk_text(text):
        sum_prompt = (
            "Resume el siguiente fragmento en 2-3 oraciones, enfocándote en ideas que podrían ayudar a responder una pregunta sobre el documento. Devuelve solo el resumen.\n\n"
            f"Texto:\n{c}\n\nResumen:"
        )
        summaries.append(call_groq_api(sum_prompt).strip())

    combined_summary = "\n\n".join(summaries)
    final_prompt = (
        f"Usando el siguiente resumen combinado del documento, responde la pregunta solicitada. {markdown_instruction}\n\n"
        f"Resumen combinado:\n{combined_summary}\n\nPregunta: {question}\n\nRespuesta:"
    )
    markdown = call_groq_api(final_prompt)
    return {"markdown": markdown}

@router.post("/topic-modeling")
async def topic_modeling(text: Optional[str] = Form(None), files: Optional[List[UploadFile]] = File(None)):
    """
    Agrupa temas en texto largo o múltiples documentos usando LLM.
    """
    markdown_instruction = "Devuelve el resultado en formato de documento Markdown, bien organizado y visualmente atractivo."
    all_texts = []
    if text:
        all_texts.append(text)
    if files:
        for file in files:
            content = await file.read()
            all_texts.append(content.decode("utf-8", errors="ignore"))
    joined_text = "\n\n".join(all_texts)

    def per_chunk_prompt(chunk):
        return (
            "Detecta los temas principales en el siguiente texto y devuelve una lista ordenada de temas con 2-3 bullets de apoyo por tema. Devuelve resultado en Markdown.\n\n"
            f"Texto:\n{chunk}\n\nTemas:"
        )

    def combine(partials: List[str]) -> str:
        joined = "\n\n".join(partials)
        prompt = (
            "Fusiona y sintetiza las listas parciales de temas en una lista final de temas principales, deduplicando y agregando 1-2 bullets explicativos por tema. Devuelve Markdown.\n\n"
            f"Listas parciales:\n{joined}\n\nTemas finales:"
        )
        return call_groq_api(prompt)

    if len(joined_text) <= CHUNK_SIZE_CHARS:
        markdown = call_groq_api(per_chunk_prompt(joined_text))
    else:
        markdown = _call_over_chunks(joined_text, per_chunk_prompt, combine)

    return {"markdown": markdown}

@router.post("/text-to-bullets")
async def text_to_bullets(text: str = Form(...)):
    """
    Resume texto largo en bullets usando LLM.
    """
    markdown_instruction = "Devuelve el resultado en formato de documento Markdown, bien organizado y visualmente atractivo."
    def per_chunk_prompt(chunk):
        return (
            f"Resume el siguiente texto en bullets claros y concisos. {markdown_instruction}\n\nTexto:\n{chunk}\n\nBullets:"
        )

    def combine(partials: List[str]) -> str:
        joined = "\n\n".join(partials)
        prompt = (
            "Combina las siguientes listas parciales de bullets en una única lista concisa de máximo 12 bullets, ordenados por importancia. Devuelve Markdown.\n\n"
            f"Listas parciales:\n{joined}\n\nBullets combinados:"
        )
        return call_groq_api(prompt)

    if len(text) <= CHUNK_SIZE_CHARS:
        markdown = call_groq_api(per_chunk_prompt(text))
    else:
        markdown = _call_over_chunks(text, per_chunk_prompt, combine)

    return {"markdown": markdown}
