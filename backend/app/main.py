import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from app.services.rag_service import RAGService
from app.services.history_service import HistoryService
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
history = HistoryService()

class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: list

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=QueryResponse)
async def chat(req: QueryRequest):
    try:
        ans, sources = await rag.handle_query(req.query, session_id=req.session_id)
        return QueryResponse(answer=ans, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/stream")
async def chat_stream(req: QueryRequest):
    try:
        return StreamingResponse(
            rag.handle_stream_query(req.query, session_id=req.session_id),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions")
async def get_sessions():
    return history.get_sessions()

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    session = history.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    success = history.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "deleted"}
