# 06 — Render Backend Deployment Guide

**Target Platform**: Render Managed Web Service (Python 3.11 / Native or Docker)

---

## 1. Render Service Configuration

| Setting | Value |
| :--- | :--- |
| **Service Type** | Web Service |
| **Repository** | `https://github.com/santhoshjecob97/AUTOERA_AI_ERP` |
| **Branch** | `main` |
| **Root Directory** | `backend` (or repository root if using Dockerfile) |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
| **Start Command** | `gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 config.wsgi:application` |
| **Health Check Path** | `/api/v1/health/` |

---

## 2. Environment Variables Required on Render

```bash
# Core Django
DJANGO_SECRET_KEY=<generate-a-strong-random-50-character-secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=.onrender.com,localhost,127.0.0.1

# Database (Automatically populated by Render PostgreSQL)
DATABASE_URL=postgres://<user>:<password>@<host>:5432/<dbname>

# Cache / Broker (Optional on free tier)
REDIS_URL=redis://<host>:6379/0

# CORS (Frontend origin)
CORS_ALLOWED_ORIGINS=https://autoera-ai-erp.vercel.app,http://localhost:5173

# AI & LLM
GEMINI_API_KEY=<user-gemini-developer-key>
GEMINI_MODEL_NAME=gemini-3.6-flash
GEMINI_FAST_MODEL_NAME=gemini-3.5-flash-lite
GEMINI_EMBEDDING_MODEL=models/gemini-embedding-2

# Feature Flags
VOICE_ENABLED=false
```

---

## 3. Health & Readiness Probes

- `/api/v1/health/` → Returns overall health (`{ "status": "HEALTHY", "database": "UP", "cache": "UP" }`).
- `/api/v1/health/live/` → Liveness probe (`{ "alive": true }`).
- `/api/v1/health/ready/` → Readiness probe checking active DB connection (`{ "ready": true }`).
