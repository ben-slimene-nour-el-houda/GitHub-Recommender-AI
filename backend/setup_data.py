import os
import json
import numpy as np
import pandas as pd
import faiss
import torch
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize, MinMaxScaler
from scipy.sparse import save_npz, csr_matrix

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
INDEX_DIR = os.path.join(BASE_DIR, "index")
FAISS_INDEX_PATH = os.path.join(INDEX_DIR, "faiss_index_cpu.bin")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)

def setup_data():
    metadata_path = os.path.join(DATA_DIR, "metadata.jsonl")
    if not os.path.exists(metadata_path):
        print(f"❌ Metadata file not found at {metadata_path}")
        return

    print("📖 Loading metadata...")
    df = pd.read_json(metadata_path, lines=True)

    # 1. Generate Technical Vectors (X_tech)
    print("🛠️ Generating Technical Vectors...")
    repo_texts = df.apply(
        lambda row: " ".join((row.get("tools_list", []) or []) + (row.get("topics_list", []) or [])),
        axis=1
    )
    vectorizer = TfidfVectorizer()
    X_tech = vectorizer.fit_transform(repo_texts)
    
    X_tech_path = os.path.join(DATA_DIR, "X_tech.npz")
    save_npz(X_tech_path, X_tech)
    
    vocab_path = os.path.join(DATA_DIR, "vocab_tech.json")
    with open(vocab_path, "w", encoding="utf-8") as f:
        json.dump(vectorizer.vocabulary_, f, ensure_ascii=False, indent=2)
    print(f"✅ Technical vectors and vocab saved.")

    # 2. Generate Numeric Features (X_numeric)
    print("🔢 Generating Numeric Features...")
    # Add dummy columns if missing for scaling (recency_days, etc)
    if 'stargazerCount' not in df.columns: df['stargazerCount'] = 0
    if 'forkCount' not in df.columns: df['forkCount'] = 0
    if 'recency_days' not in df.columns: df['recency_days'] = 30
    
    df['log_stars'] = np.log1p(df['stargazerCount'])
    df['fork_ratio'] = df['forkCount'] / (df['stargazerCount'] + 1)
    
    numeric_features = df[["log_stars", "fork_ratio", "recency_days"]].fillna(0)
    scaler = MinMaxScaler()
    X_numeric = scaler.fit_transform(numeric_features)
    
    X_numeric_path = os.path.join(DATA_DIR, "X_numeric.npy")
    np.save(X_numeric_path, X_numeric)
    print(f"✅ Numeric features saved.")

    # 3. Handle Semantic Embeddings
    embeddings_path = os.path.join(DATA_DIR, "embeddings_semantic.npy")
    if os.path.exists(embeddings_path):
        print("💾 Loading existing semantic embeddings...")
        embeddings = np.load(embeddings_path)
    else:
        print("🧠 Generating Semantic Embeddings (this may take a while)...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = SentenceTransformer("all-MiniLM-L6-v2", device=device)
        # Using name + target_domain + topics as a fallback text if full_text is missing
        texts = df.apply(lambda r: f"{r.get('nameWithOwner', '')} {r.get('target_domain', '')} {' '.join(r.get('topics_list', []) or [])}", axis=1).tolist()
        embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
        np.save(embeddings_path, embeddings)
        print("✅ Semantic embeddings generated.")

    # 4. Create Hybrid Vector & FAISS Index
    print("⚡ Creating Hybrid Vector & FAISS Index...")
    embeddings_norm = normalize(embeddings)
    X_tech_norm = normalize(X_tech)
    X_numeric_norm = normalize(X_numeric)

    W_SEM, W_TECH, W_NUM = 0.6, 0.3, 0.1
    X_hybrid = np.hstack([
        embeddings_norm * W_SEM,
        X_tech_norm.toarray() * W_TECH,
        X_numeric_norm * W_NUM
    ])

    d = X_hybrid.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(X_hybrid.astype(np.float32))
    
    faiss.write_index(index, FAISS_INDEX_PATH)
    print(f"🚀 FAISS index created and saved at {FAISS_INDEX_PATH}")
    print(f"✨ Setup complete! {index.ntotal} repositories indexed.")

if __name__ == "__main__":
    setup_data()
