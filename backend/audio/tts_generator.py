from kokoro import KPipeline
import soundfile as sf
import numpy as np
import io

import threading
from concurrent.futures import as_completed,ThreadPoolExecutor
import os
import hashlib
from pathlib import Path


CACHE_DIR=Path(__file__).parent.parent/'audio_cache'
CACHE_DIR.mkdir(exist_ok=True,parents=True)


class TTSEngine:
    _instance=None
    _lock=threading.Lock()

    def __init__(self):
        self.pipeline = KPipeline(lang_code='a')
        self._synth_lock = threading.Lock(

    @classmethod
    def get_instance(cls) -> "TTSEngine":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance=TTSEngine()
        return cls._instance

    def synthesize(self,text:str,voice:str='af_heart') -> bytes:
        with self._synth_lock:
            generator=self.pipeline(text=text,voice=voice)
            audio_chuks=[audio for _,_,audio in generator]
            full_audio=np.concatenate(audio_chuks)
            buffer=io.BytesIO()
            sf.write(buffer,full_audio,24000,format='WAV')
            return buffer.getvalue()

def generate_audio(text:str,voice:str='af_heart') -> bytes:
    engine=TTSEngine.get_instance()
    return engine.synthesize(text,voice)


def get_or_generate_audio(text:str,cache_key:str | None=None) -> bytes:
    key=cache_key or hashlib.sha256(text.encode()).hexdigest()
    path=CACHE_DIR/f'{key}.wav'
    path.parent.mkdir(exist_ok=True,parents=True)

    if path.exists():
        with open(path,'rb')as f:
            return f.read()

    audio=generate_audio(text)
    with open(path,'wb') as f:
        f.write(audio)

    return audio

def get_or_generate_audio_url(text: str, cache_key: str) -> str:
    get_or_generate_audio(text, cache_key)
    return f"/audio/{cache_key}.wav"
