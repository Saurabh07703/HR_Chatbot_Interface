# Deployment Fixes and Migration Guide

You asked to fix the Render server "sleep" issue or migrate to Hugging Face Spaces. Below are the two best solutions.

## Option 1: Fix Render Sleep (Keep-Alive)
Render's free tier spins down servers after 15 minutes of inactivity. To prevent this, you can set up a "Keep-Alive" mechanism.

### Method A: Use a Free Uptime Monitor (Easiest)
1.  Go to a free uptime service like [cron-job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/).
2.  Create a new "Monitor" or "Cron Job".
3.  **URL**: Enter your Render Backend URL ending with `/health` (e.g., `https://your-app-name.onrender.com/health`).
4.  **Interval**: Set it to run every **14 minutes** (just under the 15-minute sleep limit).
5.  Save.
    *   *Result*: The service will ping your app every 14 minutes, keeping it active.

---

## Option 2: Migrate to Hugging Face Spaces (Recommended)
Hugging Face Spaces (Free Tier) only "pauses" after 48 hours of inactivity, making it much better for showcase apps.

### Benefits of Hugging Face Spaces
*   **Longer Uptime**: Stays active for 48 hours before pausing.
*   **Faster Wake-up**: Tends to wake up faster than a cold Render boot.
*   **Free**: 2 vCPU, 16GB RAM for free.

### Migration Steps

#### 1. Create a New Space
1.  Go to [Hugging Face Spaces](https://huggingface.co/spaces) and click **Create new Space**.
2.  **Name**: `hr-chatbot-backend` (or similar).
3.  **SDK**: Select **Docker**.
4.  **Hardware**: Keep "CPU Basic" (Free).
5.  Click **Create Space**.

#### 2. Prepare Your Code
I have already updated your `backend/Dockerfile` to be compatible with Hugging Face (Port 7860).

#### 3. Upload Backend Code
You need to upload the contents of your `backend` folder to the root of the Hugging Face Space.

**Using the Web Interface (Upload Files)**:
1.  In your new Space, go to the **Files** tab.
2.  Click **Add file** -> **Upload files**.
3.  Drag and drop **ALL** files and folders inside your local `backend` folder (e.g., `app/`, `data/`, `Dockerfile`, `requirements.txt`, etc.).
    *   *Crucial*: The `Dockerfile` must be at the root of the Space files.
4.  Click **Commit changes**.

**Using Git (Command Line)**:
```bash
# Clone the empty space (replace user/space name)
git clone https://huggingface.co/spaces/YOUR_USERNAME/hr-chatbot-backend
cd hr-chatbot-backend

# Copy backend files into the repo
cp -r /path/to/your/project/backend/* .

# Push to Hugging Face
git add .
git commit -m "Deploy backend"
git push
```

#### 4. Configure Environment Variables
1.  In your Space, go to **Settings**.
2.  Scroll to **Variables and secrets**.
3.  Add the following secrets (from your `.env`):
    *   `GROQ_API_KEY`: Your Groq API Key.
    *   `OPENAI_API_KEY`: (If used).

#### 5. Verify Deployment
*   The Space will start building.
*   Once "Running", click the "Embed this space" or "API" button to get the Direct URL.
*   It looks like: `https://your-username-hr-chatbot-backend.hf.space`.
*   Testing: Visit `https://your-username-hr-chatbot-backend.hf.space/health` to confirm it returns `{"status": "healthy"}`.

#### 6. Update Frontend
1.  Go to your Frontend code (`.env.production` or Vercel settings).
2.  Update `VITE_API_URL` to your new Hugging Face Space URL (e.g., `https://your-username-hr-chatbot-backend.hf.space`).
3.  Redeploy Frontend.
