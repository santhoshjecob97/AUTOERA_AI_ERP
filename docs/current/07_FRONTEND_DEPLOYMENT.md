# 07 — Vercel Frontend Deployment Guide

**Target Platform**: Vercel (`https://autoera-ai-erp.vercel.app`)  
**Framework**: React 19 + TypeScript + Vite 6 + TailwindCSS 4

---

## 1. Vercel Configuration & Routing

`vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 2. Environment Variables on Vercel

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://<your-render-backend-service>.onrender.com` | Base URL pointing to the deployed Render backend |

> [!IMPORTANT]
> **Zero Secret Principle**: Do **NOT** set `GEMINI_API_KEY`, `DJANGO_SECRET_KEY`, `DATABASE_URL`, or `TWILIO_AUTH_TOKEN` in Vercel. All backend operations and AI inferences route through Django.

---

## 3. Build & Quality Verification

```bash
npm ci
npx tsc --noEmit
npx vitest run
npm run build
```
Result: 2,503 modules transformed, 0 TypeScript errors, bundle size ~1.4MB minified (371kB gzipped).
