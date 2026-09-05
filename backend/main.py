from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import retrieve_faq


from llm import generate_answer

from classifier import classify_message

app = FastAPI(title="CloudDesk Support AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "CloudDesk Support AI is running!"
    }


@app.post("/chat")
def chat(request: ChatRequest):

    # Step 1: Classify the customer message
    classification = classify_message(request.message)

    # Step 2: Retrieve relevant FAQs
    retrieved_faqs = retrieve_faq(request.message)

    # Step 3: Check whether the retrieved information
    # is strong enough to answer the question
    best_score = retrieved_faqs[0]["score"] if retrieved_faqs else 0

    if classification["category"] == "Unknown" or best_score < 0.15:

        return {
            "message": request.message,
            "category": classification["category"],
            "confidence": round(best_score, 2),
            "escalation": True,
            "reason": (
                "The question is outside the available "
                "knowledge base or the retrieval confidence "
                "is too low."
            ),
            "answer": (
                "I don't have enough information to answer "
                "this question. I recommend contacting human support."
            )
        }

    # Step 4: Combine retrieved FAQs into context
    context = "\n\n".join(
        faq["content"] for faq in retrieved_faqs
    )

    # Step 5: Generate grounded answer using Gemini
    answer = generate_answer(
        request.message,
        context
    )

    return {
        "message": request.message,
        "category": classification["category"],
        "confidence": classification["confidence"],
        "escalation": False,
        "reason": classification["reason"],
        "answer": answer,
        "retrieved_faqs": retrieved_faqs
    }
