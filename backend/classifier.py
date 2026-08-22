CATEGORIES = {
    "Billing": [
        "payment",
        "charged",
        "charge",
        "refund",
        "invoice",
        "subscription",
        "billing",
        "price",
        "cost"
    ],
    "Technical": [
        "error",
        "bug",
        "crash",
        "slow",
        "upload",
        "file",
        "technical",
        "browser",
        "loading",
        "not working"
    ],
    "Account Access": [
        "password",
        "login",
        "log in",
        "sign in",
        "account locked",
        "locked",
        "forgot password",
        "email address",
        "access"
    ]
}


def classify_message(message: str):
    message_lower = message.lower()

    scores = {}

    for category, keywords in CATEGORIES.items():
        score = 0

        for keyword in keywords:
            if keyword in message_lower:
                score += 1

        scores[category] = score

    best_category = max(scores, key=scores.get)
    best_score = scores[best_category]

    total_matches = sum(scores.values())

    if best_score == 0:
        return {
            "category": "Unknown",
            "confidence": 0.0,
            "reason": "No relevant support category was detected."
        }

    confidence = best_score / total_matches

    return {
        "category": best_category,
        "confidence": round(confidence, 2),
        "reason": f"Matched {best_score} relevant keyword(s)."
    }