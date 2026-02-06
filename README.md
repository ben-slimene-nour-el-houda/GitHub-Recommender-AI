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
## Data Collection (GitHub GraphQL API)
The dataset of GitHub repositories is collected programmatically using the GitHub GraphQL API.
Steps:<br>
Create a GitHub Personal Access Token (PAT)<br>
Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)→
Generate a token with repo permissions
<br>
Search domains
<br>
Example domains: machine-learning, deep-learning, data-engineering, devops, etc.
GraphQL Query
<br>
Collect repository info like: name, description, README, stars, forks, languages, topics, pushed date.
<br>
Pagination & Rate Limiting
GitHub GraphQL API returns 50 repositories per request
Use endCursor for pagination until hasNextPage = False
Include delays (time.sleep) to respect rate limits
<br>
Save Data
<br>
Save repositories in JSONL format for preprocessing
<br>
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
Run the application
<br>
1️⃣ Start the FastAPI backend:

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
2️⃣ Launch the Streamlit interface
```bash
streamlit run app.py
```
