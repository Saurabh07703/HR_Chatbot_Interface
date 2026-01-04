from app.services.document_service import DocumentService
from app.services.employee_service import EmployeeService
from app.services.llm_service import LLMService
import asyncio
from typing import Tuple, List

class RAGService:
    def __init__(self):
        self.docs = DocumentService()
        self.emps = EmployeeService()
        self.llm = LLMService()

    async def handle_query(self, query: str) -> Tuple[str, List[str]]:
        # First attempt employee-specific parse & search
        emp_hits = self.emps.parse_and_search(query)
        # Fetch relevant policies too
        policy_hits = self.docs.search(query, top_k=3)

        # If employee-only question and we have results, return deterministic formatted list quickly
        if emp_hits:
            # format short list
            lines = []
            for e in emp_hits:
                lines.append(f"- {e['name']} ({', '.join(e['skills'])}) — {e['experience_years']} yrs — {e['availability']}")
            answer = "Here are matching people:\n" + "\n".join(lines)
            sources = [p.get("title", p.get("source","Policy")) for p in policy_hits]
            # still optionally enrich via LLM for nicer wording, but skip LLM to be fast
            return answer, sources

        # Otherwise, use RAG: include policy texts as context and ask LLM to answer
        context_blocks = []
        for p in policy_hits:
            title = p.get("title") or p.get("source","Policy")
            context_blocks.append(f"{title}:\n{p.get('content','')}")

        context = "\n\n---\n\n".join(context_blocks)
        prompt = (
            "You are a concise HR assistant. Answer strictly using the context and employee dataset when relevant.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            "Answer in 2-5 sentences and mention which documents you used (title). If the question asks for people, say 'I can suggest people' and list skills to filter."
        )

        # use LLM to produce answer
        ans = await self.llm.generate(prompt)
        sources = [p.get("title", p.get("source","Policy")) for p in policy_hits]
        return ans, sources
