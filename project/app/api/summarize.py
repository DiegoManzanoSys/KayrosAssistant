# app/api/summarize.py
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from typing import Optional
from app.schemas.summary_schema import SummarizeRequest, SummarizeResponse
from app.services.extractor import extract_text_from_pdf, extract_text_from_docx
from app.services.ai_client import summarize_text_with_ollama
from app.utils.file_utils import save_upload_temp, remove_file_silently

router = APIRouter()

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB (ajusta si quieres)

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(
    file: UploadFile = File(...),
    summary_type: Optional[str] = Form("general"),  # e.g., general, bullets, tldr, business
    max_tokens: Optional[int] = Form(1024),  # desired summary length (model dependent)
):
    # Validate file type
    filename = file.filename.lower()
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .pdf and .docx supported")

    # Optional: check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
    # save temp
    tmp_path = save_upload_temp(file.filename, contents)

    try:
        # Extract text
        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(tmp_path)
        else:
            text = extract_text_from_docx(tmp_path)

        if not text or text.strip() == "":
            raise HTTPException(status_code=422, detail="No text could be extracted from the document")

        # Call AI summarizer (Ollama)
        summary = summarize_text_with_ollama(text, summary_type=summary_type, max_tokens=max_tokens)

        return SummarizeResponse(
            summary=summary,
            summary_type=summary_type,
            original_filename=file.filename,
            length_original=len(text),
            length_summary=len(summary),
        )
    finally:
        remove_file_silently(tmp_path)
