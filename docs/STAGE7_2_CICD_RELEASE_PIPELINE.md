# AutoEra AI ERP — Stage 7.2 CI/CD Release Pipeline

**Document ID**: `STAGE7.2-CICD-001`  
**Classification**: Automated GitHub Actions Deployment Workflow  
**Date**: August 22, 2026  

---

## 1. Pipeline Stages

1. **Backend Quality & Security**: Django checks, migration dry-runs, 84 Django unit tests.
2. **Frontend Quality & Build**: TypeScript check (`tsc --noEmit`), Vitest suite (95 tests), Vite build.
3. **Container Security & Image Build**: Multi-stage Docker build with zero high-severity vulnerabilities.
