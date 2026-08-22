# CloudDesk Support AI

CloudDesk Support AI is a Tier-1 customer support assistant designed to answer common customer-support questions using a FAQ knowledge base, query classification, retrieval-augmented generation (RAG), and Gemini.

## Problem Statement

Customer-support teams receive many repetitive questions related to account access, billing, and technical issues.

The goal of this project is to build a lightweight support assistant that:

- Answers common support questions using a predefined knowledge base
- Classifies customer queries into support categories
- Retrieves relevant FAQ information
- Uses Gemini to generate a natural-language response
- Escalates low-confidence or out-of-scope questions to human support
- Provides a simple web-based chat interface

## Features

- Interactive customer-support chat
- Gemini-powered responses
- TF-IDF based FAQ retrieval
- Query classification
- FAQ knowledge base
- Retrieval confidence
- Human-review escalation
- Instant greeting handling
- Chat history
- Clear chat functionality

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Pydantic

### AI / NLP
- TF-IDF
- Query classification
- Retrieval-Augmented Generation (RAG)
- Gemini

### Development Tools
- Git
- GitHub
- VS Code

## Project Structure

```text
customer-support-ai/
│
├── backend/
│   ├── knowledge_base/
│   │   └── faqs.txt
│   ├── classifier.py
│   ├── llm.py
│   ├── main.py
│   ├── rag.py
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md