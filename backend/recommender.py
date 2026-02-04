import numpy as np
from sklearn.preprocessing import normalize

from loader import model, vectorizer, index, df_meta, X_numeric

W_SEM, W_TECH, W_NUM = 0.6, 0.3, 0.1

def build_query_vector(query_text):
    emb = model.encode([query_text], convert_to_numpy=True)
    emb = normalize(emb)

    Xq_tech = vectorizer.transform([query_text])
    Xq_tech = normalize(Xq_tech)

    Xq_num = np.zeros((1, X_numeric.shape[1]))
    Xq_num = normalize(Xq_num)

    Xq = np.hstack([
        emb * W_SEM,
        Xq_tech.toarray() * W_TECH,
        Xq_num * W_NUM
    ])

    return Xq.astype(np.float32)

def search_repositories(query_text, top_k=5):
    # 1️⃣ construire le vecteur hybride
    Xq = build_query_vector(query_text)
    
    # 2️⃣ recherche FAISS
    distances, indices = index.search(Xq, top_k)
    
    # 3️⃣ post-traitement pour output
    results = []
    for i, (idx, dist) in enumerate(zip(indices[0], distances[0])):
        repo = df_meta.iloc[idx]
        similarity_score = 1 / (1 + float(dist))  # score lisible
        
        results.append({
            "rank": i + 1,
            "name": repo["nameWithOwner"],
            "url": repo["url"],
            "stars": int(repo["stargazerCount"]),   # <- renommer ici
            "forks": int(repo["forkCount"]),        # <- renommer ici
            "languages_list": repo.get("languages_list", []),
            "similarity_score": round(similarity_score, 4)
        })

    
    return results





