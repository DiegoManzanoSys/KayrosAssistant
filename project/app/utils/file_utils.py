# app/utils/file_utils.py
import os
import tempfile
from typing import Optional

TMP_DIR = os.getenv("TMP_DIR", "/tmp/resumeai")

os.makedirs(TMP_DIR, exist_ok=True)

def save_upload_temp(filename: str, content: bytes) -> str:
    """
    Guarda el archivo en un path temporal y devuelve la ruta.
    """
    safe_name = filename.replace(" ", "_")
    fd, path = tempfile.mkstemp(prefix="upload_", suffix="_" + safe_name, dir=TMP_DIR)
    with os.fdopen(fd, "wb") as f:
        f.write(content)
    return path

def remove_file_silently(path: Optional[str]):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass
