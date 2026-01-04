import json
import re
from typing import List, Dict

EMP_PATH = "data/employees.json"

class EmployeeService:
    def __init__(self, path=EMP_PATH):
        with open(path, "r", encoding="utf-8") as f:
            self.employees = json.load(f)

    def _normalize(self, s: str) -> str:
        return s.lower()

    def find_by_skill_and_experience(self, skill:str, min_years:int) -> List[Dict]:
        skill_n = self._normalize(skill)
        out = []
        for e in self.employees:
            skills = [s.lower() for s in e.get("skills",[])]
            if skill_n in skills and e.get("experience_years",0) >= min_years:
                out.append(e)
        return out

    def who_worked_on_project(self, keyword:str) -> List[Dict]:
        kw = self._normalize(keyword)
        out=[]
        for e in self.employees:
            projects = " ".join(e.get("past_projects",[])).lower()
            if kw in projects:
                out.append(e)
        return out

    def suggest_for_tech(self, techs: List[str]) -> List[Dict]:
        # techs = list of required skills, return employees who match most skills first
        tset = set([t.lower() for t in techs])
        scored=[]
        for e in self.employees:
            skills = set([s.lower() for s in e.get("skills",[])])
            match = len(skills & tset)
            scored.append((match, e))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [e for m,e in scored if m>0]

    def find_with_all_skills(self, skills: List[str]) -> List[Dict]:
        sset = set([s.lower() for s in skills])
        out=[]
        for e in self.employees:
            esk = set([x.lower() for x in e.get("skills",[])])
            if sset.issubset(esk):
                out.append(e)
        return out

    # Generic parser for natural queries (very simple)
    def parse_and_search(self, query: str):
        q = query.lower()
        # Example patterns:
        # "python developers with 3+ years" or "3+ years python"
        m = re.search(r'(\d+)\s*\+\s*.*years', q) or re.search(r'(\d+)\s*years', q)
        years = int(m.group(1)) if m else None

        # skills present
        # handle AWS and Docker example
        if "aws" in q and "docker" in q:
            return self.find_with_all_skills(["AWS","Docker"])

        # find python devs
        if "python" in q and years:
            return self.find_by_skill_and_experience("Python", years)

        # who worked on healthcare
        if "healthcare" in q or "health care" in q:
            return self.who_worked_on_project("healthcare")

        # react native suggestions
        if "react native" in q or "react-native" in q:
            return self.suggest_for_tech(["React Native"])

        # fallback: look for any skill word in query and return suggestions
        skills = re.findall(r'\b(java|python|react native|react|aws|docker|kubernetes|flutter|pytorch|tensorflow)\b', q)
        if skills:
            return self.suggest_for_tech(skills)

        return []
