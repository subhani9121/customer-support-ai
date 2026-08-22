import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

gemini_key = os.getenv("GEMINI_API_KEY")

if not gemini_key:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")

client = genai.Client(api_key=gemini_key)


def generate_answer(question: str, context: str):

    prompt = f"""
You are CloudDesk's Tier-1 customer support AI.

Answer the customer's question using ONLY the
provided knowledge-base context.

Do not invent policies, prices, features, or procedures.

If the context does not contain enough information
to answer the question, say that you do not have
enough information and recommend human support.

Knowledge-base context:
{context}

Customer question:
{question}

Give a concise and helpful answer.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text


if __name__ == "__main__":

    answer = generate_answer(
        "I forgot my password. What should I do?",
        """
        FAQ: Password Reset

        Users can reset their password by clicking
        "Forgot Password" on the CloudDesk login page.
        A password reset link is sent to their registered
        email address. The reset link expires after 30 minutes.
        """
    )

    print(answer)