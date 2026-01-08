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
        "general": """Genera un resumen profesional y completo del siguiente texto siguiendo estas directrices:
- Estructura el resumen en párrafos bien organizados
- Identifica y mantén todos los puntos clave e ideas principales
- Usa un lenguaje claro, coherente y formal
- Mantén la secuencia lógica del contenido original
- Incluye datos importantes, cifras o referencias relevantes
- Usa títulos y subtítulos en Markdown cuando sea apropiado
- El resultado debe ser comprensible sin leer el texto original""",

        "bullets": """Genera un resumen en formato de lista de bullets siguiendo ESTRICTAMENTE estas reglas:
- Crea EXACTAMENTE entre 5 y 8 bullets (ni más, ni menos)
- Cada bullet debe ser conciso pero completo (1-2 líneas máximo)
- Usa el formato Markdown de bullets (-)
- Cada bullet debe capturar UNA idea o punto clave específico
- Prioriza los puntos más importantes del texto
- NO uses sub-bullets ni listas anidadas
- Empieza cada bullet con un verbo de acción o concepto clave en negritas
Ejemplo de formato esperado:
- **Concepto clave**: Descripción concisa del punto
- **Otro punto importante**: Explicación breve""",

        "tldr": """Genera un TL;DR (Too Long; Didn't Read) siguiendo EXACTAMENTE estas reglas:
- Escribe ÚNICAMENTE DOS ORACIONES
- Primera oración: El punto principal o hallazgo más importante
- Segunda oración: La conclusión o acción clave
- Cada oración debe ser directa, clara y completa
- No uses bullets, solo texto corrido
- Máximo 40-50 palabras en total
- Captura la esencia absoluta del documento
Ejemplo: "El documento analiza el impacto de la IA en la productividad empresarial, demostrando incrementos del 30% en eficiencia. Las organizaciones que adopten estas tecnologías en los próximos 2 años tendrán ventajas competitivas significativas.""",

        "business": """Genera un resumen ejecutivo de negocios siguiendo estas directrices:
- Comienza con el contexto de negocio y problema principal
- Identifica CLARAMENTE: oportunidades, riesgos, y métricas clave
- Incluye una sección de "Implicaciones de Negocio" con insights estratégicos
- Añade una sección de "Acciones Recomendadas" con pasos concretos priorizados
- Usa formato Markdown con títulos y bullets donde sea apropiado
- Enfócate en ROI, ventajas competitivas, impacto financiero, y decisiones estratégicas
- Estructura: Contexto → Hallazgos clave → Implicaciones → Recomendaciones
- Usa lenguaje ejecutivo y orientado a resultados""",

        "academic": """Genera un resumen académico siguiendo el formato científico estándar:
- **Introducción/Contexto**: Tema principal y objetivos de investigación
- **Metodología**: Enfoque, técnicas y herramientas utilizadas (si aplica)
- **Hallazgos Principales**: Resultados y descubrimientos clave con datos
- **Conclusiones**: Interpretación de resultados e implicaciones teóricas/prácticas
- **Limitaciones y Futuras Líneas**: Si el texto las menciona
Usa terminología académica apropiada, cita hallazgos específicos con datos cuando estén disponibles, y mantén un tono formal y objetivo. Estructura todo en formato Markdown con secciones claramente definidas.""",
    }

    inst = instructions.get(summary_type, instructions["general"])
    markdown_note = "\n\nDevuelve ÚNICAMENTE el resumen en formato Markdown, sin introducción ni texto adicional. El resumen debe ser autocontenido y profesional."
    return f"{inst}\n{markdown_note}\n\nTexto a resumir:\n{chunk}\n\nResumen:"


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
        return partial_summaries[0].strip()

    # síntesis final - con instrucciones específicas según el tipo
    combined = "\n\n---\n\n".join(partial_summaries)
    
    synthesis_instructions = {
        "general": "Fusiona estos resúmenes parciales en un resumen único y coherente, manteniendo la estructura profesional con párrafos bien organizados. Mantén todos los puntos clave y datos importantes.",
        
        "bullets": "Fusiona estos resúmenes parciales en UNA SOLA LISTA de 5-8 bullets. Combina y prioriza los puntos más importantes, eliminando duplicados. Usa el formato:\n- **Concepto**: Descripción\nSin sub-bullets ni listas anidadas.",
        
        "tldr": "Fusiona estos resúmenes parciales en EXACTAMENTE DOS ORACIONES que capturen la esencia completa del documento. Primera oración: punto principal. Segunda oración: conclusión o acción clave.",
        
        "business": "Fusiona estos resúmenes parciales en un resumen ejecutivo unificado con las secciones: Contexto → Hallazgos clave → Implicaciones de Negocio → Acciones Recomendadas. Mantén el enfoque en ROI, estrategia y decisiones.",
        
        "academic": "Fusiona estos resúmenes parciales en un resumen académico coherente con las secciones: Introducción/Contexto → Metodología → Hallazgos Principales → Conclusiones. Mantén el tono formal y objetivo.",
    }
    
    synthesis_inst = synthesis_instructions.get(summary_type, synthesis_instructions["general"])

    final_prompt = (
        f"{synthesis_inst}\n\n"
        f"Resúmenes parciales a fusionar:\n\n{combined}\n\n"
        f"Devuelve ÚNICAMENTE el resumen final fusionado en formato Markdown, sin introducción ni texto adicional.\n\n"
        f"Resumen final:"
    )

    final = call_ollama_api(final_prompt, max_tokens=max_tokens)
    return final.strip()
