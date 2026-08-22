# ──────────────────────────────────────────────
# AutoEra AI ERP — Production Multi-Stage Dockerfile
# Stage 1: Build Dependencies
# ──────────────────────────────────────────────
FROM python:3.11-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /install

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /install/
RUN pip install --no-cache-dir --prefix=/install/deps -r requirements.txt

# ──────────────────────────────────────────────
# Stage 2: Hardened Runtime Container
# ──────────────────────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=config.settings \
    PATH="/install/deps/bin:$PATH" \
    PYTHONPATH="/install/deps/lib/python3.11/site-packages:$PYTHONPATH"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /install/deps /install/deps

# Create non-root unprivileged user and group
RUN groupadd -r autoera && useradd -r -g autoera -d /app -s /sbin/nologin autoera

# Copy backend application code
COPY backend/ /app/

# Create logs & staticfiles directories and assign ownership
RUN mkdir -p /app/logs /app/staticfiles && chown -R autoera:autoera /app

USER autoera

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "2", "--access-logfile", "-", "--error-logfile", "-", "config.wsgi:application"]
