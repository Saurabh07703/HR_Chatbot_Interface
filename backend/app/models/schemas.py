from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []

class Document(BaseModel):
    content: str
    metadata: Dict[str, Any]
    score: Optional[float] = None
