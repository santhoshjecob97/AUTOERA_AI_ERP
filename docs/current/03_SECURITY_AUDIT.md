# 03 — Security Audit

**Audit Standards**: OWASP Top 10 (2025/2026), Multi-Tenant SaaS Isolation, RBAC Least Privilege.

---

## 1. Secret Protection & Scanning

- `.gitignore` rigorously protects `.env`, `.env.*`, `*.pem`, `*.key`, `credentials*.json`, `service-account*.json`, `db.sqlite3`.
- Repository contains zero exposed private keys, live database passwords, or third-party secret tokens in Git history.
- All secrets are loaded via `os.environ` / `django-environ` on Render.

---

## 2. API & Injection Defense

- **SQL Injection**: Prevented by exclusive usage of Django ORM parameterized queries with strict model typing.
- **Cross-Site Scripting (XSS)**: Handled by React JSX sanitization, Django `SECURE_BROWSER_XSS_FILTER = True`, and `SECURE_CONTENT_TYPE_NOSNIFF = True`.
- **Cross-Origin Resource Sharing (CORS)**: `CORS_ALLOW_ALL_ORIGINS = False`. Only approved origins (`https://autoera-ai-erp.vercel.app`, `http://localhost:5173`) are whitelisted.
- **Clickjacking**: `X_FRAME_OPTIONS = 'DENY'`.
- **Prompt Injection Defense**: Implemented in `backend/ai_platform/gateway.py` with pattern-matching sanitization on user prompts before forwarding to Google Gemini.

---

## 3. IDOR & Multi-Tenant Authorization

- Every endpoint inheriting from `TenantScopedViewSet` enforces tenant-level query filtering in `get_queryset()`.
- Attempts by users of Organization A to retrieve or modify resources belonging to Organization B return `404 Not Found`.
- Header-based tenant spoofing attempts (`X-Organization-ID`) are trapped by `TenantMiddleware` and blocked.
