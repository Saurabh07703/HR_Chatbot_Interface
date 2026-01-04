import json
import re
from typing import List, Dict

DATA_PATH = "data/hr_policies.json"

class DocumentService:
    def __init__(self, path=DATA_PATH):
        with open(path, "r", encoding="utf-8") as f:
            self.docs = json.load(f)  # list of dicts

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        # naive scoring: count occurrences of query words in content + title
        qwords = re.findall(r"\w+", query.lower())
        scores = []
        for d in self.docs:
            text = (d.get("title","") + " " + d.get("content","")).lower()
            score = sum(text.count(w) for w in qwords)
            scores.append((score, d))
        scores.sort(key=lambda x: x[0], reverse=True)
        # return top_k docs with score>0, else return top_k regardless
        selected = [d for s,d in scores if s>0][:top_k]
        if not selected:
            selected = [d for _,d in scores][:top_k]
        return selected
