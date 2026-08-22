# AutoEra AI ERP — Stage 7.2 Vercel Deployment Specification

**Document ID**: `STAGE7.2-VERCEL-001`  
**Classification**: Frontend Edge Build & Hosting Verification  
**Date**: August 22, 2026  

---

## 1. Build Configuration

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: `20.x`
- **Single Page Application Routing**: Configured via `vercel.json` rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 2. Public Safe Environment Variables

| Variable | Target Value | Secret Status |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.autoera.ai` (or configured public backend) | Public Safe |
| `VITE_API_URL` | `https://api.autoera.ai` | Public Safe |
| `VITE_USE_BACKEND_AI` | `true` | Public Safe |

---

## 3. Public Verification Status
- **Local Build Artifact**: `1,666.45 kB` JS bundle, `21.39 kB` CSS bundle.
- **Edge Deployment Status**: `[STAGING_READY / AWAITING VERCEL CLI TOKEN]`
