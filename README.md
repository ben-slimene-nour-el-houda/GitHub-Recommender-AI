# 🔍 GitHub Repository Recommender (AI)

**AI-powered GitHub repository recommender** based on hybrid embeddings (semantic + technical + numerical features) and FAISS similarity search.  
This tool helps you quickly find the most relevant GitHub repositories for ML/AI projects, books, frameworks, or specifications.

---

## 🚀 Features

- **Hybrid vector representation**:
  - **Semantic embeddings** via SentenceTransformer `"all-MiniLM-L6-v2"`
  - **Technical embeddings** (TF-IDF on `tools_list` + `topics_list`)
  - **Numerical features** (stars, forks, recency)
- **FAISS similarity search** for fast top-K recommendations
- GPU support for embeddings generation (if available)
- Streamlit web interface for easy query input and results display
- Optional PDF/text input support (future extension)

---

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/github-repo-recommender.git
cd github-repo-recommender
Créer un environnement Python (recommandé) :

bash
Copy code
python -m venv venv
source venv/bin/activate      # Linux / macOS
venv\Scripts\activate         # Windows
Installer les dépendances :

bash
Copy code
pip install -r requirements.txt
Assurez-vous que vos fichiers de données sont présents :

python
Copy code
metadata.jsonl
embeddings_semantic.npy
X_tech.npz
X_numeric.npy
vocab_tech.json
faiss_index_cpu.bin
Optional GPU setup:

NVIDIA driver installed

CUDA 12.6 installed

faiss-gpu installed for GPU acceleration

📁 Project Structure
python
Copy code
github-repo-recommender/
├─ data/
│  ├─ processed/
│  │  ├─ metadata.jsonl
│  │  ├─ embeddings_semantic.npy
│  │  ├─ X_tech.npz
│  │  ├─ X_numeric.npy
│  │  └─ vocab_tech.json
├─ index/
│  ├─ faiss_index_cpu.bin
│  └─ faiss_index_gpu.bin (optional)
├─ backend/
│  └─ main.py                 # FastAPI backend
├─ app.py                     # Streamlit app
├─ requirements.txt
└─ README.md
🖥️ Lancer l’application
1️⃣ Démarrer le backend FastAPI :

bash
Copy code
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
2️⃣ Lancer l’interface Streamlit :

bash
Copy code
cd ..
streamlit run app.py
3️⃣ Accéder ensuite à l’interface via : http://localhost:8501

⚡ Usage
Entrez votre requête dans la zone de texte, par exemple :

powershell
Copy code
I want repositories about deep learning for computer vision using PyTorch
Ajustez le slider Top-K pour le nombre de résultats

Cliquez sur "Rechercher" et voyez les résultats affichés :

Repository name with link

Stars / Forks

Tools & Topics

🔧 How It Works
Query vectorization

Semantic embeddings via SentenceTransformer

Technical embeddings via TF-IDF

Numerical features (stars, forks, recency)

Hybrid vector creation

Weighted combination of semantic + technical + numeric

Similarity search

FAISS index (CPU or GPU)

Returns top-K closest repositories

Display

Streamlit interface shows metadata and similarity info

