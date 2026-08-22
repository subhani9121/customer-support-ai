from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent
FAQ_FILE = BASE_DIR / "knowledge_base" / "faqs.txt"


def load_faqs():
    with open(FAQ_FILE, "r", encoding="utf-8") as file:
        content = file.read()

    sections = content.split("FAQ:")

    faqs = []

    for section in sections:
        section = section.strip()

        if section:
            faqs.append("FAQ:" + section)

    return faqs


FAQS = load_faqs()


vectorizer = TfidfVectorizer(stop_words="english")

faq_vectors = vectorizer.fit_transform(FAQS)


def retrieve_faq(question: str, top_k: int = 2):

    question_vector = vectorizer.transform([question])

    similarities = cosine_similarity(
        question_vector,
        faq_vectors
    )[0]

    ranked_indexes = similarities.argsort()[::-1]

    results = []

    for index in ranked_indexes[:top_k]:
        results.append({
            "content": FAQS[index],
            "score": round(float(similarities[index]), 3)
        })

    return results