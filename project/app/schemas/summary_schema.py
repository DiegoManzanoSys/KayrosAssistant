# app/schemas/summary_schema.py
from pydantic import BaseModel, Field
from typing import Optional

class SummarizeRequest(BaseModel):
    summary_type: Optional[str] = Field("general", description="Tipo de resumen: general | bullets | tldr | business | academic")
    max_tokens: Optional[int] = Field(1024, description="Longitud máxima pedida al modelo (depende del proveedor)")

class SummarizeResponse(BaseModel):
    summary: str
    summary_type: str
    original_filename: str
    length_original: int
    length_summary: int
