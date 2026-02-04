import json
import numpy as np
import pandas as pd
import faiss
import torch

from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
from scipy.sparse import load_npz

# -----------------------------
# Paths
# -----------------------------
DATA_DIR = "C:\\Users\\MSI\\Desktop\\Github\\data\\processed"
FAISS_INDEX_PATH = "C:\\Users\\MSI\\Desktop\\Github\\index\\faiss_index_cpu.bin"

# -----------------------------
# Device
# -----------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"

# -----------------------------
# Load Sentence Transformer model
# -----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2", device=device)
print(f"✅ SentenceTransformer loaded on {device}")

# -----------------------------
# Load metadata & features
# -----------------------------
df_meta = pd.read_json(f"{DATA_DIR}/metadata.jsonl", lines=True)
embeddings = np.load(f"{DATA_DIR}/embeddings_semantic.npy")
X_tech = load_npz(f"{DATA_DIR}/X_tech.npz")
X_numeric = np.load(f"{DATA_DIR}/X_numeric.npy")
print("✅ Metadata, embeddings, X_tech and X_numeric loaded")

# -----------------------------
# Load vocab for TF-IDF
# -----------------------------
with open(f"{DATA_DIR}/vocab_tech.json", "r", encoding="utf-8") as f:
    vocab = json.load(f)

# Convert dict → list if needed
if isinstance(vocab, dict):
    vocab = list(vocab.keys())

vectorizer = TfidfVectorizer(vocabulary=vocab)
vectorizer.fit([" ".join(vocab)])  # ✅ Important pour éviter NotFittedError


# Test rapide du vectorizer
X_test = vectorizer.transform(["pytorch deep learning computer vision"])
print("✅ Vectorizer ready, test shape:", X_test.shape)

# -----------------------------
# Load FAISS index
# -----------------------------
index = faiss.read_index(FAISS_INDEX_PATH)
print("✅ FAISS index loaded")
