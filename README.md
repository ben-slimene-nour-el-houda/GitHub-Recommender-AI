# GitHub Repository Recommender (AI)

**AI-powered GitHub repository recommender** based on hybrid embeddings (semantic + technical + numerical features) and FAISS similarity search.  
This tool helps you quickly find the most relevant GitHub repositories for ML/AI projects, books, frameworks, or specifications.

---

## Features

- **Hybrid vector representation**:
  - **Semantic embeddings** via SentenceTransformer `"all-MiniLM-L6-v2"`
  - **Technical embeddings** (TF-IDF on `tools_list` + `topics_list`)
  - **Numerical features** (stars, forks, recency)
- **FAISS similarity search** for fast top-K recommendations
- GPU support for embeddings generation (if available)
- Streamlit web interface for easy query input and results display
- Optional PDF/text input support (future extension)

---

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ben-slimene-nour-el-houda/GitHub-Recommender-AI.git
cd GitHub-Recommender-AI
```
Create a Python environment (recommended):

```bash
python -m venv venv
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows
```
Install dependencies:

```bash
pip install -r requirements.txt
```
🖥️ Run the application
1️⃣ Start the FastAPI backend:

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
2️⃣ Launch the Streamlit interface
bash
Copy code
cd ..
streamlit run app.py
