import hashlib
from pathlib import Path
from schemas.schemas import ProcessResponse

RESPONSE_CACHE_DIR=Path('response_cache')
RESPONSE_CACHE_DIR.mkdir(exist_ok=True)

def get_cached_response(pdf_bytes: bytes) -> ProcessResponse | None:
    key = hashlib.sha256(pdf_bytes).hexdigest()
    path = RESPONSE_CACHE_DIR / f"{key}.json"
    if not path.exists():
        return None
    try:
        return ProcessResponse.model_validate_json(path.read_text(encoding="utf-8"))
    except Exception:
        return None 

def save_response_cache(pdf_bytes: bytes, response: ProcessResponse):
    key = hashlib.sha256(pdf_bytes).hexdigest()
    path = RESPONSE_CACHE_DIR / f"{key}.json"
    tmp_path = path.with_suffix(".tmp")

    tmp_path.write_text(response.model_dump_json(), encoding="utf-8")
    tmp_path.replace(path)