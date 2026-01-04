import os
from dotenv import load_dotenv
from groq import Groq
from app.services.cache_service import CacheService

load_dotenv()

class LLMService:
    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.cache = CacheService()
        if self.groq_key:
            self.client = Groq(api_key=self.groq_key)
            print("✅ Groq client initialized.")
        else:
            self.client = None
            print("⚠️ No GROQ_API_KEY found. Running in Dev mode.")

    async def generate(self, prompt: str, max_tokens: int = 400):
        # cache
        cached = self.cache.get(prompt)
        if cached:
            return cached

        if not self.client:
            # dev fallback: short canned response
            fallback = "(Dev mode) No GROQ_API_KEY set. Unable to call LLM."
            self.cache.set(prompt, fallback)
            return fallback

        try:
            resp = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens
            )
            # Groq returns .choices[0].message.content (object mapping)
            text = resp.choices[0].message.content
            self.cache.set(prompt, text)
            return text
        except Exception as e:
            return f"Error calling Groq API: {str(e)}"
