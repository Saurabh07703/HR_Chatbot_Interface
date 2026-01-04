import os
import sqlite3

DB_PATH = os.path.join("data", "cache.sqlite")

class CacheService:
    def __init__(self, db_path=DB_PATH):
        os.makedirs("data", exist_ok=True)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS llm_cache (
                key TEXT PRIMARY KEY,
                response TEXT
            )
        """)
        self.conn.commit()

    @staticmethod
    def _key(text: str) -> str:
        import hashlib
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def get(self, text: str):
        k = self._key(text)
        cur = self.conn.execute("SELECT response FROM llm_cache WHERE key=?", (k,))
        row = cur.fetchone()
        return row[0] if row else None

    def set(self, text: str, response: str):
        k = self._key(text)
        self.conn.execute("REPLACE INTO llm_cache (key, response) VALUES (?, ?)", (k, response))
        self.conn.commit()
