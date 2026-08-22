# AutoEra AI ERP — Authentication & Session Architecture

## 1. Authentication Strategy
AutoEra AI ERP implements RFC 7519 JSON Web Tokens (JWT) using `djangorestframework-simplejwt` paired with secure server-side session management.

---

## 2. Token Lifecycle & Specifications

| Token | Type | Lifetime | Storage | Transmission | Rotation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Access Token** | JWT (HMAC-SHA256) | 30 Minutes | In-Memory / Axios State | `Authorization: Bearer <token>` | Issued on login / refresh |
| **Refresh Token**| JWT (HMAC-SHA256) | 7 Days | Secure HttpOnly Cookie / LocalStorage | Body on `/auth/refresh/` | **Rotated on each use** |

---

## 3. Endpoints

- `POST /api/v1/auth/login/`: Validates credentials, issues access/refresh tokens and user profile.
- `POST /api/v1/auth/refresh/`: Accepts valid refresh token, issues new access token + new refresh token (rotates old token).
- `GET /api/v1/auth/me/`: Returns authenticated user's organization, branch, and role metadata.
- `POST /api/v1/auth/password-change/`: Changes user password with old password verification.

---

## 4. Rate Limiting & Brute Force Protection
- Anonymous endpoints (Login): Throttled to **20 requests/minute** per IP.
- Authenticated endpoints: Throttled to **200 requests/minute** per user.
- Throttles configured via Django REST Framework throttle classes in `settings.py`.
