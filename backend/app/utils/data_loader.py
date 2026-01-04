import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def load_hr_policies():
    path = os.path.join(DATA_DIR, "hr_policies.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_employees():
    path = os.path.join(DATA_DIR, "employees.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
