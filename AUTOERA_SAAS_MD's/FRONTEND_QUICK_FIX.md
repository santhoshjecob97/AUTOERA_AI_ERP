# 🔧 AUTOERA Frontend - Quick Fix Guide

**Issue**: React frontend showing 404 or not starting  
**Solution**: Use the simple HTML dashboard while fixing React app

---

## ✅ **IMMEDIATE SOLUTION (WORKING NOW)**

### **Simple HTML Dashboard** 
**File**: `SIMPLE_FRONTEND_DASHBOARD.html`

**How to Open**:
1. Double-click `SIMPLE_FRONTEND_DASHBOARD.html`
2. Or run: `start SIMPLE_FRONTEND_DASHBOARD.html`

**Features**:
- ✅ Shows all 67 AI models
- ✅ Displays KPIs and metrics
- ✅ Lists login credentials
- ✅ Quick links to Django admin and API
- ✅ Works immediately (no installation needed)

---

## 🔄 **REACT FRONTEND FIX (For Full UI)**

### **Problem**: Port 3000 already in use or dependency issues

### **Solution 1: Use Different Port**

```powershell
# Navigate to frontend
cd frontend

# Set port to 3001
$env:PORT=3001

# Start React app
npm start
```

The app will open at: **http://localhost:3001**

### **Solution 2: Fix Dependencies**

```powershell
cd frontend

# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force

# Reinstall
npm install --legacy-peer-deps

# Start
npm start
```

### **Solution 3: Use Batch File**

Run the provided batch file:
```cmd
start_frontend.bat
```

This automatically sets PORT=3001 and starts the app.

---

## 🌐 **ACCESS URLS**

### **Current Working URLs**:
- **Simple Dashboard**: `file:///SIMPLE_FRONTEND_DASHBOARD.html` (✅ Working)
- **Django Admin**: http://localhost:8000/admin/ (✅ Working)
- **API Root**: http://localhost:8000/api/ (✅ Working)
- **API Docs**: http://localhost:8000/api/schema/swagger-ui/ (✅ Working)

### **React Frontend URLs** (After fixing):
- **Main App**: http://localhost:3001
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/

---

## 🔐 **LOGIN CREDENTIALS**

Use these to login to Django Admin:

| User | Email | Password |
|------|-------|----------|
| Admin | `admin@autoera.com` | `admin123` |
| Dealer | `dealer@autoera.com` | `dealer123` |
| Tech | `tech@autoera.com` | `tech123` |

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: "Cannot find module 'ajv/dist/compile/codegen'"**

**Fix**:
```powershell
cd frontend
npm install ajv --legacy-peer-deps
npm start
```

### **Issue 2: "Port 3000 is already in use"**

**Fix**:
```powershell
cd frontend
$env:PORT=3001
npm start
```

Or kill the process using port 3000:
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **Issue 3: "TypeScript version conflict"**

**Fix**: Already fixed in package.json (TypeScript 4.9.5)

### **Issue 4: "404 Page Not Found"**

**Cause**: React app not running or wrong URL

**Fix**:
1. Make sure React app is running (`npm start`)
2. Check correct port (3000 or 3001)
3. Use Simple HTML Dashboard as alternative

---

## 📊 **WHAT'S WORKING NOW**

### **✅ Backend (100%)**
- Django server running on port 8000
- All 67 AI models active
- API endpoints responding
- Database connected
- Admin panel accessible

### **✅ Simple Frontend (100%)**
- HTML dashboard working
- Shows all system info
- Displays AI models
- Lists credentials
- Quick access links

### **🔄 React Frontend (In Progress)**
- Structure created
- Dependencies installed
- Sample pages built
- Needs port configuration

---

## 🚀 **RECOMMENDED WORKFLOW**

### **For Testing Backend (Use Now)**:
1. Open `SIMPLE_FRONTEND_DASHBOARD.html`
2. Click "Django Admin" button
3. Login with `admin@autoera.com` / `admin123`
4. Navigate to AI Engine → AI Models
5. Test API endpoints

### **For Building Full UI (Later)**:
1. Fix React app port issue
2. Start React dev server
3. Build components incrementally
4. Test with backend API
5. Deploy when ready

---

## 📁 **FILES CREATED**

### **Working Now**:
- ✅ `SIMPLE_FRONTEND_DASHBOARD.html` - Immediate dashboard
- ✅ `start_frontend.bat` - Batch file to start React on port 3001
- ✅ `frontend/.env` - Environment variables (PORT=3001)

### **For React Development**:
- ✅ `frontend/package.json` - Dependencies
- ✅ `frontend/src/App.tsx` - Main app
- ✅ `frontend/src/pages/Dashboard.tsx` - Dashboard page
- ✅ `frontend/src/pages/Login.tsx` - Login page
- ✅ `frontend/src/services/api.ts` - API service

---

## 💡 **TIPS**

### **Tip 1: Use Simple Dashboard for Now**
The HTML dashboard works perfectly and shows everything you need. Use it while fixing the React app.

### **Tip 2: Check Backend First**
Always verify backend is running:
```powershell
curl http://localhost:8000/api/health/
```

### **Tip 3: Use Different Port**
If port 3000 is busy, use 3001:
```powershell
$env:PORT=3001; npm start
```

### **Tip 4: Clear Cache**
If issues persist:
```powershell
cd frontend
npm cache clean --force
Remove-Item node_modules -Recurse -Force
npm install --legacy-peer-deps
```

---

## ✅ **CURRENT STATUS**

| Component | Status | URL |
|-----------|--------|-----|
| **Backend** | ✅ Working | http://localhost:8000 |
| **Django Admin** | ✅ Working | http://localhost:8000/admin/ |
| **API** | ✅ Working | http://localhost:8000/api/ |
| **Simple Dashboard** | ✅ Working | SIMPLE_FRONTEND_DASHBOARD.html |
| **React Frontend** | 🔄 Fixing | http://localhost:3001 (after fix) |

---

## 🎯 **NEXT STEPS**

1. **Use Simple Dashboard** (Working now)
   - Open `SIMPLE_FRONTEND_DASHBOARD.html`
   - Test all backend features
   - View AI models and credentials

2. **Fix React App** (Optional, for full UI)
   - Run `cd frontend`
   - Run `$env:PORT=3001; npm start`
   - Wait for compilation
   - Open http://localhost:3001

3. **Continue Development**
   - Build remaining UI components
   - Connect to backend API
   - Test and deploy

---

## 📞 **QUICK COMMANDS**

```powershell
# Test backend
curl http://localhost:8000/api/health/

# Open simple dashboard
start SIMPLE_FRONTEND_DASHBOARD.html

# Start React app (port 3001)
cd frontend
$env:PORT=3001
npm start

# Open Django admin
start http://localhost:8000/admin/

# Test user login
python test_all_users_login.py
```

---

## 🎉 **SUMMARY**

**What's Working**:
✅ Backend with 67 AI models  
✅ Django admin panel  
✅ All API endpoints  
✅ Simple HTML dashboard  
✅ All login credentials  

**What Needs Fixing**:
🔄 React frontend port configuration  
🔄 Some npm dependencies  

**Workaround**:
✅ Use `SIMPLE_FRONTEND_DASHBOARD.html` for immediate access to all features!

---

**🚀 You can test everything right now using the Simple Dashboard!**
