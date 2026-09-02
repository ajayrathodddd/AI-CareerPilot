# AI CareerPilot

A real-world AI-powered career and job platform foundation.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Python + FastAPI
- Database: MongoDB-ready architecture
- AI/ML: ready for NLP, scikit-learn, LLM APIs and embeddings

## Project structure

```text
AI-CareerPilot/
├── frontend/
└── backend/
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite.

## Run backend

Windows:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend API:
http://127.0.0.1:8000

Swagger documentation:
http://127.0.0.1:8000/docs

## Environment

Copy `.env.example` to `.env` when you begin adding MongoDB and AI API keys.

Never commit real secrets to GitHub.
