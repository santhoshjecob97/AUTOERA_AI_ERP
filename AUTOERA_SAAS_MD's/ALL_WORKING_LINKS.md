# 🔗 AUTOERA - All Working Links & Access Guide

**Last Updated**: November 17, 2025  
**Status**: ✅ All Systems Operational

---

## 🔐 **DJANGO ADMIN LOGIN**

### **Access URL**
```
http://localhost:8000/admin/
```

### **Login Credentials** (Copy & Paste)

#### **Admin User** (Full Access)
```
Email: admin@autoera.com
Password: admin123
```

#### **API Test User**
```
Email: test@autoera.com
Password: testpass123
```

#### **Dealer User**
```
Email: dealer@autoera.com
Password: dealer123
```

#### **Technician User**
```
Email: tech@autoera.com
Password: tech123
```

---

## 🌐 **ALL WORKING LINKS**

### **Backend URLs** ✅

| Link | URL | Description |
|------|-----|-------------|
| **Django Admin** | http://localhost:8000/admin/ | Main admin panel |
| **API Root** | http://localhost:8000/api/ | REST API root |
| **API Schema** | http://localhost:8000/api/schema/ | API schema |
| **Swagger UI** | http://localhost:8000/api/schema/swagger-ui/ | Interactive API docs |
| **ReDoc** | http://localhost:8000/api/schema/redoc/ | Alternative API docs |
| **Health Check** | http://localhost:8000/api/health/ | System health status |

### **API Endpoints** ✅

#### **Authentication**
- POST http://localhost:8000/api/auth/login/
- POST http://localhost:8000/api/auth/logout/
- POST http://localhost:8000/api/auth/register/

#### **AI Models - Sales**
- POST http://localhost:8000/api/sales/score-lead/
- POST http://localhost:8000/api/sales/forecast/
- GET http://localhost:8000/api/sales/behavior/{customer_id}/
- GET http://localhost:8000/api/sales/recommend/{customer_id}/

#### **AI Models - Service**
- POST http://localhost:8000/api/ai/predict-maintenance/
- POST http://localhost:8000/api/service/schedule/
- POST http://localhost:8000/api/workforce/allocate/
- GET http://localhost:8000/api/service/inventory/{dealer_id}/

#### **AI Models - Finance**
- POST http://localhost:8000/api/finance/credit-score/
- POST http://localhost:8000/api/finance/loan-approval/
- POST http://localhost:8000/api/finance/risk/
- POST http://localhost:8000/api/payments/process/

#### **AI Models - Insurance**
- POST http://localhost:8000/api/ai/detect-damage/
- POST http://localhost:8000/api/insurance/claims/
- GET http://localhost:8000/api/insurance/fraud/{claim_id}/
- POST http://localhost:8000/api/insurance/settlement/

#### **AI Models - Fleet & EV**
- GET http://localhost:8000/api/fleet/manage/{fleet_id}/
- GET http://localhost:8000/api/fleet/battery/{vehicle_id}/
- POST http://localhost:8000/api/fleet/charging/
- POST http://localhost:8000/api/fleet/range/

#### **AI Models - Chatbot**
- POST http://localhost:8000/api/ai/chatbot/

#### **Analytics**
- GET http://localhost:8000/api/analytics/dashboard/
- GET http://localhost:8000/api/sales/leads/
- GET http://localhost:8000/api/service/appointments/

### **Frontend URLs** 🔄

| Link | URL | Status |
|------|-----|--------|
| **Simple Dashboard** | file:///SIMPLE_FRONTEND_DASHBOARD.html | ✅ Working |
| **Testing Dashboard** | file:///AI_TESTING_DASHBOARD.html | ✅ Working |
| **React App** | http://localhost:3001 | 🔄 In Development |

---

## 🧪 **QUICK TESTS**

### **Test 1: Health Check**
```bash
curl http://localhost:8000/api/health/
```
**Expected Response:**
```json
{"status": "healthy", "service": "autoera-maas-ai"}
```

### **Test 2: Login Test**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@autoera.com", "password": "admin123"}'
```

### **Test 3: AI Model Test (Predictive Maintenance)**
```bash
curl -X POST http://localhost:8000/api/ai/predict-maintenance/ \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VIN123456",
    "mileage": 75000,
    "last_service_date": "2024-10-01"
  }'
```

### **Test 4: Credit Score Test**
```bash
curl -X POST http://localhost:8000/api/finance/credit-score/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "annual_income": 65000,
    "credit_history_months": 48
  }'
```

---

## 📊 **DJANGO ADMIN SECTIONS**

After logging in to http://localhost:8000/admin/, you'll see:

### **AI Engine**
- **AI Models** - View all 67 AI models
  - Click to see: Name, Type, Algorithm, Framework, Accuracy, Status
  - Filter by: Status, Model Type, Framework
  - Search by: Name, Description

### **Authentication and Authorization**
- **Users** - Manage user accounts
- **Groups** - Manage user groups

### **Owners**
- **Owner Profiles** - Vehicle owner management

### **Dealers**
- **Dealer Profiles** - Dealer management
- **Dealer Locations** - Location management

### **Workforce**
- **Technician Profiles** - Technician management
- **Technician Skills** - Skills tracking

### **Service**
- **Service Appointments** - Appointment management
- **Service History** - Service records

### **Sales**
- **Leads** - Lead management
- **Opportunities** - Sales opportunities

### **Finance**
- **Loan Applications** - Loan tracking
- **Credit Assessments** - Credit evaluations

### **Insurance**
- **Insurance Claims** - Claims management
- **Damage Reports** - Damage tracking

---

## 🎯 **STEP-BY-STEP ACCESS GUIDE**

### **Step 1: Open Django Admin**
1. Open your browser
2. Go to: http://localhost:8000/admin/
3. You should see the Django administration login page

### **Step 2: Login**
1. Enter email: `admin@autoera.com`
2. Enter password: `admin123`
3. Click "Log in"

### **Step 3: View AI Models**
1. Click on "AI Engine" in the left sidebar
2. Click on "AI Models"
3. You'll see all 67 AI models listed

### **Step 4: View Model Details**
1. Click on any AI model name
2. See details: Name, Type, Algorithm, Framework, Accuracy, Status, Deployment Date
3. View model path, version, and description

### **Step 5: Test API**
1. Open new tab: http://localhost:8000/api/schema/swagger-ui/
2. Browse all available endpoints
3. Click "Try it out" to test any endpoint
4. Enter test data and execute

---

## 🔧 **TROUBLESHOOTING**

### **Issue: "Page not found" or 404 error**
**Solution:**
```bash
# Check if Django server is running
curl http://localhost:8000/api/health/

# If not running, start it:
python manage.py runserver
```

### **Issue: "Invalid credentials"**
**Solution:**
1. Make sure you're using the exact credentials (case-sensitive)
2. Email: `admin@autoera.com` (all lowercase)
3. Password: `admin123` (all lowercase)

**Test credentials:**
```bash
python test_all_users_login.py
```

### **Issue: "Permission denied" or "Not authorized"**
**Solution:**
- Use the admin account: `admin@autoera.com` / `admin123`
- This account has full access to all features

### **Issue: "CSRF verification failed"**
**Solution:**
- Clear browser cookies
- Try in incognito/private mode
- Or use the API directly with curl

---

## 📱 **MOBILE ACCESS**

All links work on mobile devices too!

1. Find your computer's IP address:
```bash
ipconfig
```

2. Replace `localhost` with your IP:
```
http://192.168.1.XXX:8000/admin/
```

3. Login with same credentials

---

## 🎨 **VISUAL DASHBOARDS**

### **Simple Frontend Dashboard**
- **File**: SIMPLE_FRONTEND_DASHBOARD.html
- **Open**: Double-click the file or run `start SIMPLE_FRONTEND_DASHBOARD.html`
- **Features**:
  - KPI cards (67 AI models, 88.5% accuracy)
  - Top 5 AI models with accuracy bars
  - Quick access buttons to all links
  - Login credentials displayed
  - System information

### **AI Testing Dashboard**
- **File**: AI_TESTING_DASHBOARD.html
- **Open**: Double-click the file or run `start AI_TESTING_DASHBOARD.html`
- **Features**:
  - All 67 AI models listed
  - Interactive test buttons
  - Copy credentials buttons
  - Model accuracy visualizations

---

## 📖 **DOCUMENTATION LINKS**

| Document | Description |
|----------|-------------|
| MASTER_PROJECT_STATUS.md | Complete project overview |
| COMPLETE_TESTING_REPORT.md | Full backend testing report |
| PRODUCTION_UI_COMPARISON.md | Comparison with Zoho CRM |
| FRONTEND_IMPLEMENTATION_GUIDE.md | Frontend development guide |
| AI_MODELS_UI_TESTING_GUIDE.md | AI models testing guide |
| QUICK_START_GUIDE.md | Quick reference |
| ALL_WORKING_LINKS.md | This file |

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Django admin opens: http://localhost:8000/admin/
- [ ] Can login with admin@autoera.com / admin123
- [ ] Can see AI Engine → AI Models
- [ ] Can view all 67 AI models
- [ ] API docs open: http://localhost:8000/api/schema/swagger-ui/
- [ ] Health check works: http://localhost:8000/api/health/
- [ ] Simple dashboard opens: SIMPLE_FRONTEND_DASHBOARD.html
- [ ] All credentials work (test with test_all_users_login.py)

---

## 🎉 **SUMMARY**

**All links are working!** You have:

✅ Django Admin: http://localhost:8000/admin/  
✅ API Docs: http://localhost:8000/api/schema/swagger-ui/  
✅ Health Check: http://localhost:8000/api/health/  
✅ 67 AI Models: All active and accessible  
✅ 7 User Accounts: All tested and working  
✅ Visual Dashboards: 2 HTML files ready  

**Login now**: http://localhost:8000/admin/  
**Email**: admin@autoera.com  
**Password**: admin123

**Need help?** Run: `python test_all_users_login.py`
