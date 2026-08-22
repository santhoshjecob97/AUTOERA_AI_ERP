# AutoEra AI ERP — Stage 7.2 Backend Container Deployment

**Document ID**: `STAGE7.2-BACKEND-001`  
**Classification**: Production Containerization & Service Health  
**Date**: August 22, 2026  

---

## 1. Container Specification

- **Base Image**: `python:3.11-slim`
- **Process Manager**: Gunicorn with Uvicorn worker class (`gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000`)
- **Health Endpoints**:
  - `GET /api/v1/health/` -> Database, Redis, Celery, and storage health checks
  - `GET /api/v1/health/liveness/` -> Process alive check
  - `GET /api/v1/health/readiness/` -> Database connection ready check
