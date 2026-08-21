from pydantic import BaseModel
from typing import Literal,Optional

class Block(BaseModel):
    type:Literal['text','visual_description','table_description']
    content:str

class PageResult(BaseModel):
    page_number:int
    blocks:list[Block]

class ProcessResponse(BaseModel):
    filename:str
    pages:list[PageResult]


class TTSRequest(BaseModel):
    text:str
    cache_key:str

class DescriptionList(BaseModel):
    descriptions:list[str]

