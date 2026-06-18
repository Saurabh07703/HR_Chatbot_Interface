# Project Models and Algorithms Explanation

## Project Overview

This project is a sophisticated **HR Chatbot** designed to streamline human resource operations. It features a dual-purpose architecture:
1.  **Employee Search**: An intelligent system to find employees based on skills, experience (`find_by_skill_and_experience`), and project history (`who_worked_on_project`).
2.  **HR Policy Q&A**: A Retrieval-Augmented Generation (RAG) system that answers questions about HR policies by retrieving relevant documents and using an LLM to generate natural language responses.

The application serves as a bridge between complex HR data and user-friendly natural language queries, utilizing a **FastAPI backend** for logic and a **React frontend** for a premium user experience.

This document details the algorithms and models executed in this project, specifically within the backend service layer (`backend/app/services`).

## 1. Large Language Model (Generative AI)

The core "intelligence" of the chatbot is powered by a Large Language Model (LLM) integrated via the Groq API.

*   **Model Used**: `llama-3.1-8b-instant`
    *   This is a highly efficient 8-billion parameter model optimized for fast inference.
*   **Execution Location**: `backend/app/services/llm_service.py`
*   **Algorithm/Working Implementation**:
    1.  **Orchestration**: The `RAGService` constructs a prompt containing the user's query and retrieved context (policies or employee data).
    2.  **API Call**: The `LLMService` sends this prompt to the Groq API using the `groq` python client.
    3.  **Generation**: The model generates a natural language response based on the provided context ("In-Context Learning").
    4.  **Caching**: To save costs and speed up repeated queries, responses are cached using `CacheService`.

```python
# snippet from llm_service.py
resp = self.client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=max_tokens
)
```

## 2. Retrieval Algorithms (RAG)

The project uses a custom Retrieval-Augmented Generation (RAG) pipeline. Unlike standard vector-based RAG, this project uses **heuristic and keyword-based retrieval** algorithms.

### A. Employee Search Algorithm (Deterministic)
*   **Goal**: Find employees based on skills, experience, or project history.
*   **Execution Location**: `backend/app/services/employee_service.py`
*   **Algorithm**: **Regular Expression (Regex) Parsing & Boolean Filtering**.
    *   **Parsing**: The system uses `re` (regex) to extract key entities from the query (e.g., "3+ years", "python", "healthcare").
    *   **Filtering**: It iterates through the `data/employees.json` list and applies exact match or boolean logic.
        *   *Example*: `find_by_skill_and_experience` checks `if skill in list AND experience >= min_years`.
    *   **Scoring**: For skill suggestions, it calculates the size of the intersection between required skills and employee skills (`len(skills & tset)`).

### B. Policy Document Search Algorithm (Heuristic)
*   **Goal**: Find relevant HR policies to answer questions.
*   **Execution Location**: `backend/app/services/document_service.py`
*   **Algorithm**: **Naive Keyword Frequency (Bag-of-Words)**.
    *   It does **not** use vector embeddings (like cosine similarity with BERT), relying instead on a simple counting mechanism.
    *   **Working**:
        1.  Tokenize the query into words.
        2.  For each document in `hr_policies.json`, count how many times the query words appear in the document's title and content.
        3.  `score = sum(text.count(w) for w in qwords)`
        4.  Sort documents by this score and return the top `k` (default 3).

## 3. Accuracy and Evaluation

**How is accuracy calculated?**
*   **Strictly speaking, there is no formal accuracy calculation** (e.g., F1-score, Precision, Recall) implemented in the codebase.
*   There is no "test set" or "ground truth" labels to compare the model outputs against.

**Why?**
1.  **Retrieval**: The retrieval algorithms are **deterministic** (Regex) or **heuristic** (Keyword Count). Their "accuracy" is defined by whether the logic correctly filters the data. For example, if you ask for "3 years experience", the regex ensures 100% precision for that logic, assuming the regex correctly parses the number.
2.  **Generation**: LLM output quality is subjective. Since it uses a pre-trained model (Llama 3), the "accuracy" depends on the prompt quality and the relevance of the context provided by the retrieval step.

**Summary Table**

| Component | Technology / Model | Algorithm Type | Evaluated By |
| :--- | :--- | :--- | :--- |
| **Generation** | Llama 3.1 8b (Groq) | Transformer (LLM) | Subjective Inspection |
| **Policy Search** | Custom Implementation | Keyword Frequency Count | Heuristic Score (>0) |
| **Employee Search**| Custom Implementation | Regex + Boolean Logic | Deterministic Filter |
