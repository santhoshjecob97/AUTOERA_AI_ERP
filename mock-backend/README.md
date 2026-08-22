# Mock Backend for AUTOERA Frontend

This mock backend provides minimal endpoints expected by the frontend for local development and demo purposes.

Quick start (from project root `mock-backend`):

PowerShell:

```powershell
cd mock-backend
npm install
npm run start
```

Default server: `http://localhost:8000`

Endpoints provided (examples):
- `POST /api/auth/login/` -> { token, user }
- `GET /api/auth/verify/` -> { id, username, name }
- `GET /api/ai-engine/models/` -> { models }
- `POST /api/ai-engine/predict/:modelName/` -> { prediction, confidence }
- `POST /api/ai-engine/batch-predict/` -> { jobId }
- `GET /api/ai-engine/batch-jobs/:jobId/` -> job details
- `POST /api/gemini/generate/` -> { text }

Notes:
- This is a lightweight mock to run the frontend locally without a full backend.
- For production or real AI capabilities, integrate a real backend or connect to Google Gemini with proper server-side keys.
