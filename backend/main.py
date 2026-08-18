from fastapi import FastAPI,UploadFile
import fitz
from backend.schemas.schemas import Block,PageResult,ProcessResponse
app=FastAPI()

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

        image_list=page.get_images(full=True)
        for img_index,img in enumerate(image_list):
            xref=img[0]
            base_image=doc.extract_image(xref=xref)
            blocks.append(Block(
                type='visual_description',
                content=f"[placeholder:image {img_index} detected, {len(base_image['image'])} bytes]"
            ))

        tables=page.find_tables()
        for table_index,table in enumerate(tables.tables):
            table_data=table.extract()
    
            table_content=""
            for row in table_data:
                table_content+=" | ".join(
                    str(cell) if cell is not None else ""
                    for cell in row
        )
        table_content+="\n"

        blocks.append(Block(
        type='table',
        content=table_content.strip()
            ))

        pages_result.append(PageResult(
            page_number=i+1,
            blocks=blocks))


    return ProcessResponse(pages=pages_result)

    

