import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.services.rag_service import RAGService

load_dotenv()  # ensure .env is loaded

app = FastAPI(title="HR Chatbot (Groq)")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGService()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: list

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=QueryResponse)
async def chat(req: QueryRequest):
    try:
        ans, sources = await rag.handle_query(req.query)
        return QueryResponse(answer=ans, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
