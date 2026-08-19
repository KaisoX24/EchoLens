from fastapi import FastAPI,UploadFile
from schemas.schemas import Block,PageResult,ProcessResponse
from reasoning.table_describer import describe_tables_batch
from reasoning.vision_describer import describe_images_batch
import pymupdf
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process",response_model=ProcessResponse)
async def process_pdf(file:UploadFile) -> ProcessResponse:
    "Process and return the image data"
    pdf_bytes= await file.read()
    doc=fitz.open(stream=pdf_bytes,filetype='pdf')

    page=len(doc)
    pages_result=[]

    for i in range(page):
        page=doc[i]
        blocks=[]
        page_text=page.get_text().strip()
        if page_text:
            blocks.append(Block(
                type='text',
                content=page_text
            ))

        table_list=page.find_tables()
        all_rows=[table.extract() for table in table_list] if table_list.tables else []
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

    return ProcessResponse(pages=pages_result)
    

