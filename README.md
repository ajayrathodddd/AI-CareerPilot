# 🚀 AI CareerPilot

> **AI-powered career development platform that helps job seekers analyze resumes, match jobs, identify skill gaps, build learning roadmaps, and practice interviews.**

AI CareerPilot is a real-world full-stack portfolio project designed to make career preparation more structured, personalized, and data-driven.

## ✨ Features

- 📄 **AI Resume Analyzer** — Upload a resume and get an ATS-style score, extracted skills, strengths, and improvement suggestions.
- 🎯 **Job Matcher** — Compare a resume with one or more job descriptions and identify matching and missing skills.
- 🧠 **Skill Gap Analysis** — Understand which skills are missing for a target role.
- 🗺️ **Learning Roadmap** — Get a structured learning path based on career goals and skill gaps.
- 🎤 **Interview AI** — Practice interview questions and prepare for technical and behavioral interviews.
- 📊 **Analysis History** — Track resume scores and job-match performance over time with visual charts.
- 🔐 **Authentication** — User registration, login, protected career data, and token-based authentication.
- 🗃️ **MongoDB Integration** — Store users, resume analysis results, job matches, and history.
- 🔎 **OCR Resume Processing** — Supports text extraction from scanned/image-based resumes using OCR.

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│   Vite + Tailwind CSS        │
└──────────────┬───────────────┘
               │ REST API
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│ Python + Pydantic + Auth     │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │ AI / NLP /   │
│  Application │  │ Resume Tools │
│     Data     │  │  + OCR       │
└──────────────┘  └──────────────┘
```

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- JWT authentication
- REST APIs

### Database & AI
- MongoDB
- NLP / skill extraction
- scikit-learn
- LLM-ready architecture
- OCR with Tesseract and Poppler

## 📁 Project Structure

```text
AI-CareerPilot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/ajayrathodddd/AI-CareerPilot.git
cd AI-CareerPilot
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite.

### 3. Start the backend

Open a new terminal:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## 🔐 Environment Variables

Create a `.env` file for local configuration such as MongoDB and AI API settings.

Example:

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=ai_careerpilot_new
JWT_SECRET=your_secret_key
```

> ⚠️ Never commit real API keys, passwords, tokens, or database credentials to GitHub.

## 🎯 Portfolio Highlights

This project demonstrates practical experience with:

- Full-stack application development
- React component architecture
- REST API development with FastAPI
- MongoDB data modeling and integration
- Authentication and authorization
- Resume parsing and OCR
- NLP-based skill extraction
- Job-to-resume matching
- Data visualization
- AI-assisted career workflows
- Frontend ↔ backend debugging and API integration

## 📌 Project Status

**Active portfolio project** — continuously improving with additional AI capabilities, deployment, testing, and production-focused enhancements.

## 👨‍💻 Author

**Ajay Rathod**

GitHub: [@ajayrathodddd](https://github.com/ajayrathodddd)

---

⭐ If you find this project useful, consider giving the repository a star.