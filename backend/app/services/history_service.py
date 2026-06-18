import json
import os
import uuid
from datetime import datetime
from typing import List, Dict

HISTORY_FILE = "data/chat_history.json"

class HistoryService:
    def __init__(self):
        self.file_path = HISTORY_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w', encoding='utf-8') as f:
                json.dump({}, f)

    def _read_data(self) -> Dict:
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}

    def _write_data(self, data: Dict):
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)

    def get_sessions(self) -> List[Dict]:
        data = self._read_data()
        sessions = []
        for session_id, session_data in data.items():
            sessions.append({
                "id": session_id,
                "title": session_data.get("title", "New Chat"),
                "created_at": session_data.get("created_at"),
                "updated_at": session_data.get("updated_at")
            })
        # Sort by updated_at descending
        sessions.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        return sessions

    def get_session(self, session_id: str) -> Dict:
        data = self._read_data()
        return data.get(session_id, None)

    def create_session(self, title: str = "New Chat") -> str:
        data = self._read_data()
        session_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        data[session_id] = {
            "title": title,
            "created_at": now,
            "updated_at": now,
            "messages": []
        }
        self._write_data(data)
        return session_id

    def add_message(self, session_id: str, role: str, content: str):
        data = self._read_data()
        if session_id not in data:
            # Create if not exists
            now = datetime.utcnow().isoformat()
            data[session_id] = {
                "title": content[:30] + "..." if role == "user" else "New Chat",
                "created_at": now,
                "updated_at": now,
                "messages": []
            }
        
        session = data[session_id]
        
        # Auto-update title if it's the first user message and title is "New Chat"
        if role == "user" and session.get("title") == "New Chat":
            session["title"] = content[:30] + "..."
            
        session["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        })
        session["updated_at"] = datetime.utcnow().isoformat()
        self._write_data(data)

    def delete_session(self, session_id: str) -> bool:
        data = self._read_data()
        if session_id in data:
            del data[session_id]
            self._write_data(data)
            return True
        return False
