from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

def test_employee_query():
    r = client.post("/chat", json={"query": "Find Python developers with 3+ years experience"})
    assert r.status_code == 200
    assert "answer" in r.json()
    assert "sources" in r.json()
