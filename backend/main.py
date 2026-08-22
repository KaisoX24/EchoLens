from fastapi import FastAPI,UploadFile
from schemas.schemas import Block,PageResult,ProcessResponse,TTSRequest
from reasoning.table_describer import describe_tables_batch
from reasoning.vision_describer import describe_images_batch
from reasoning.text_cleaner import clean_text
from audio.tts_generator import get_or_generate_audio_url
from cache_responses import get_cached_response,save_response_cache
import pymupdf
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import re

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://echolens-azure.vercel.app",
        "https://echolens-git-main-kaisox24s-projects.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio",StaticFiles(directory='audio_cache'),name='audio')

@app.post("/process",response_model=ProcessResponse)
async def process_pdf(file:UploadFile) -> ProcessResponse:
    "Process and return the image data"
    pdf_bytes= await file.read()
    cached=get_cached_response(pdf_bytes)
    if cached:
        return cached
    
    doc=pymupdf.open(stream=pdf_bytes,filetype='pdf')
    page=len(doc)
    pages_result=[]

    for i in range(page):
        page=doc[i]
        blocks=[]
        
        page_text=page.get_text().strip()
        if page_text:
            cleaned_text=clean_text(page_text)
            blocks.append(Block(
                type='text',
                content=cleaned_text
            ))

        tables = page.find_tables()
        all_rows = []
        for table in tables:
            rows = table.extract()
            if len(rows) >= 2 and len(rows[0] if rows else []) >= 2:
                all_rows.append(rows)

        if all_rows:
            table_description=describe_tables_batch(all_rows)
            for desc in table_description:
                blocks.append(Block(
                    type='table_description',
                    content=desc
                ))

        image_list=page.get_images(full=True)
        images_data=[]
        for img in image_list:
            xref=img[0]
            base_image=doc.extract_image(xref=xref)
            images_data.append((base_image['image'],base_image['ext']))

        if images_data:
            descrption=describe_images_batch(images_data)
            for desc in descrption:
                blocks.append(Block(
                    type='visual_description',
                    content=desc
                ))


        pages_result.append(PageResult(
            page_number=i+1,
            blocks=blocks))
        
    response=ProcessResponse(filename=file.filename,pages=pages_result)
    save_response_cache(pdf_bytes,response)
    return response
    

@app.post('/tts')
def text_to_speech(payload:TTSRequest):
    safe_key = re.sub(r'[^a-zA-Z0-9_/]', '_', payload.cache_key)
    audio_url=get_or_generate_audio_url(payload.text,safe_key)
    return {'audio_url':audio_url}
