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
            print("SUCCESS: Groq client initialized.")
        else:
            self.client = None
            print("WARNING: No GROQ_API_KEY found. Running in Dev mode.")

    async def generate(self, prompt: str, max_tokens: int = 400, chat_history: list = None):
        # cache
        cached = self.cache.get(prompt)
        if cached:
            return cached

        if not self.client:
            # dev fallback: short canned response
            fallback = "(Dev mode) No GROQ_API_KEY set. Unable to call LLM."
            self.cache.set(prompt, fallback)
            return fallback

        messages = chat_history or []
        messages.append({"role": "user", "content": prompt})

        try:
            resp = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                max_tokens=max_tokens
            )
            # Groq returns .choices[0].message.content (object mapping)
            text = resp.choices[0].message.content
            self.cache.set(prompt, text)
            return text
        except Exception as e:
            return f"Error calling Groq API: {str(e)}"

    async def generate_stream(self, prompt: str, max_tokens: int = 400, chat_history: list = None):
        if not self.client:
            yield "(Dev mode) No GROQ_API_KEY set. Unable to call LLM."
            return
            
        messages = chat_history or []
        messages.append({"role": "user", "content": prompt})

        try:
            stream = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                max_tokens=max_tokens,
                stream=True
            )
            full_text = ""
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_text += content
                    yield content
                    
            # Cache the full response after stream completes
            self.cache.set(prompt, full_text)
        except Exception as e:
            yield f"\nError calling Groq API: {str(e)}"
