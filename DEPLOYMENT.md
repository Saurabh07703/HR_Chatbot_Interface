# Cloud Deployment Guide

Follow these steps to deploy your HR Chatbot to the cloud.

## 1. Push Code to GitHub

Since you have the code locally, you need to push it to a new GitHub repository.

1.  **Create a new repository** on GitHub (name it e.g., `hr-chatbot-app`).
2.  **Push your local code**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/hr-chatbot-app.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy Backend (Render.com)

We will deploy the FastAPI backend first because the frontend needs its URL.

1.  Go to [Render.com](https://render.com) and create a **New Web Service**.
2.  Connect your GitHub repository.
3.  **Configuration**:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
4.  **Environment Variables**:
    *   Add `GROQ_API_KEY` with your key value.
    *   Add `PYTHON_VERSION` = `3.10.0` (optional but recommended).
5.  **Deploy**.
6.  **Copy the Backend URL** (e.g., `https://hr-chatbot-backend.onrender.com`).

## 3. Deploy Frontend (Vercel)

Now we deploy the React frontend.

1.  Go to [Vercel](https://vercel.com) and **Add New Project**.
2.  Import the same GitHub repository.
3.  **Configuration**:
    *   **Root Directory**: `.` (leave as root) or explicit `./`
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   Add `VITE_API_URL` and paste your **Render Backend URL** (e.g., `https://hr-chatbot-backend.onrender.com`).
    *   *Note: Do NOT add a trailing slash.*
5.  **Deploy**.

## 4. Final Verify

Visit your Vercel URL (e.g., `https://hr-chatbot-app.vercel.app`).
Try searching for employees or asking policy questions!
