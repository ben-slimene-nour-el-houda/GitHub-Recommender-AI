from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommender import search_repositories
from pdf_utils import extract_text_from_pdf
import traceback

app = FastAPI(title="GitHub AI Recommender")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "message": "GitHub AI Recommender API"}

@app.post("/search/text")
async def search_text(query: str, top_k: int = 5):
    try:
        return search_repositories(query, top_k)
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search/pdf")
async def search_pdf(file: UploadFile = File(...), top_k: int = 5):
    try:
        text = extract_text_from_pdf(file.file)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        return search_repositories(text, top_k)
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
