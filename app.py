import streamlit as st
import requests

API_URL = "http://localhost:8000"

st.set_page_config(page_title="GitHub AI Recommender", layout="wide")
st.title("🔍 AI GitHub Repository Recommender")

input_type = st.radio("Type d'entrée", ["Texte", "PDF"])
top_k = st.slider("Nombre de résultats", 3, 20, 5)

if input_type == "Texte":
    query = st.text_area(
        "Décris ton besoin",
        height=150,
        placeholder="Ex: deep learning computer vision pytorch"
    )

    if st.button("🚀 Rechercher") and query.strip():
        with st.spinner("Recherche en cours..."):
            res = requests.post(
                f"{API_URL}/search/text",
                params={"query": query, "top_k": top_k}
            )
            results = res.json()

elif input_type == "PDF":
    pdf = st.file_uploader("Uploader un PDF", type=["pdf"])

    if st.button("🚀 Rechercher") and pdf:
        with st.spinner("Analyse du PDF..."):
            res = requests.post(
                f"{API_URL}/search/pdf",
                files={"file": pdf},
                params={"top_k": top_k}
            )
            results = res.json()

if "results" in locals() and results:
    st.subheader("📌 Résultats")
    for r in results:
        st.markdown(f"""
### {r['rank']}. 🔗 [{r['name']}]({r['url']})
⭐ Stars : {r['stars']} | 🍴 Forks : {r['forks']} | 🔹 Similarity : {r.get('similarity_score', 0)}

Languages: {', '.join(r.get('languages_list', []))}

---
""")
