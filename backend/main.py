from fastapi import FastAPI, UploadFile, File
from recommender import search_repositories
from pdf_utils import extract_text_from_pdf

app = FastAPI(title="GitHub AI Recommender")

@app.post("/search/text")
async def search_text(query: str, top_k: int = 5):
    return search_repositories(query, top_k)

@app.post("/search/pdf")
async def search_pdf(file: UploadFile = File(...), top_k: int = 5):
    text = extract_text_from_pdf(file.file)
    return search_repositories(text, top_k)
