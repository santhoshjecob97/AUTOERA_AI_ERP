# 🔐 Login Troubleshooting Guide

## Issue: Cannot Login to Frontend

### ✅ What I Fixed

1. **Updated Login Page** to handle both response formats:
   - Standard JWT format (`access` and `refresh` tokens)
   - Mock format (`token` field)
   
2. **Added Better Error Handling** with console logging

3. **Added User Data Storage** for profile information

---

## 🧪 Test the Fix

### Step 1: Open Browser Console
1. Open http://localhost:3001/login
2. Press **F12** to open Developer Tools
3. Go to **Console** tab

### Step 2: Try Login
**Credentials:**
- Email: `admin@autoera.com`
- Password: `admin123`

### Step 3: Check Console
You should see:
```
Login response: {token: "mock-token-...", user: {...}}
```

If login succeeds, you'll be redirected to the dashboard.

---

## 🔍 Current Backend Response

The backend is currently returning:
```json
{
  "token": "mock-token-xxxxx",
  "user": {
    "id": "user-1",
    "username": "demo",
    "name": "Demo User"
  }
}
```

**Note:** This is a mock response, not the real JWT tokens. The frontend now handles this format.

---

## 🛠️ If Login Still Fails

### Check 1: Backend is Running
```powershell
# Test backend health
curl http://127.0.0.1:8000/api/health/
```

Should return: `{"status": "healthy"}`

### Check 2: Frontend Can Reach Backend
Open browser console and run:
```javascript
fetch('http://127.0.0.1:8000/api/health/')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Check 3: CORS Issues
If you see CORS errors in console:
1. Check backend terminal for CORS warnings
2. Verify `CORS_ALLOWED_ORIGINS` in settings includes `http://localhost:3001`

### Check 4: Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for the `/api/auth/login/` request
5. Check:
   - Status code (should be 200)
   - Response data
   - Any error messages

---

## 🔧 Alternative: Use Real JWT Authentication

If you want to use real JWT tokens instead of mock:

### Step 1: Check if Real Auth Endpoint Works
```powershell
python test_login.py
```

### Step 2: If Mock Response, Find the Mock Middleware
The mock response suggests there's a middleware or proxy intercepting requests.

### Step 3: Disable Mock Mode
Look for environment variables like:
- `USE_MOCK_AUTH=True`
- `DEBUG_MODE=True`
- `DEMO_MODE=True`

---

## 📊 Expected vs Actual

### Expected (Real JWT):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@autoera.com",
    "role": "ADMIN"
  }
}
```

### Actual (Mock):
```json
{
  "token": "mock-token-xxxxx",
  "user": {
    "id": "user-1",
    "username": "demo",
    "name": "Demo User"
  }
}
```

---

## ✅ Quick Test Commands

### Test Backend Login
```powershell
python test_login.py
```

### Test Frontend API Call
Open browser console on http://localhost:3001/login:
```javascript
// Test login API
fetch('http://127.0.0.1:8000/api/auth/login/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@autoera.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

---

## 🎯 Next Steps

1. **Try logging in** with the updated code
2. **Check browser console** for any errors
3. **Check Network tab** to see the actual API response
4. **If still failing**, share the error message from console

---

## 🆘 Common Issues & Solutions

### Issue: "Login failed"
**Solution:** Check browser console for detailed error

### Issue: CORS error
**Solution:** Backend CORS settings need to allow frontend origin

### Issue: Network error
**Solution:** Backend might not be running on port 8000

### Issue: 401 Unauthorized
**Solution:** Check if user exists in database:
```powershell
python manage.py shell -c "from core.models import User; print(User.objects.filter(email='admin@autoera.com').exists())"
```

### Issue: Redirects but shows blank page
**Solution:** Check if dashboard route exists and is protected

---

## 📝 Debug Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3001
- [ ] Browser console open (F12)
- [ ] Network tab open
- [ ] Tried login with correct credentials
- [ ] Checked console for errors
- [ ] Checked network tab for API call
- [ ] Verified API response format

---

**The login page has been updated to handle the current backend response format. Try logging in now!**

