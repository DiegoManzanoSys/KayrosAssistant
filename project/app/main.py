# app/main.py
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import summarize, analysis

# Cargar variables de entorno desde .env
load_dotenv()

app = FastAPI(title="ResumeAI - PDF/DOCX Summarizer")

# CORS (ajusta en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(summarize.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")

@app.get("/")
def root():
    return {"ok": True, "service": "ResumeAI Backend"}
