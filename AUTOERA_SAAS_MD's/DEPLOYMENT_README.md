# 🚀 AUTOERA AI SaaS - Complete Deployment Guide

## 🎯 **SIMPLE ONE-COMMAND DEPLOYMENT**

### **Windows (Recommended)**
```bash
deploy.bat
```

### **Linux/Mac**
```bash
chmod +x deploy.sh
./deploy.sh
```

### **Manual Docker Commands**
```bash
# Clean and deploy
docker-compose down -v --remove-orphans
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## 🌐 **ACCESS YOUR SAAS**

### **Main Application URLs**
- **🔧 Backend API**: http://localhost:8000
- **👨‍💼 Admin Panel**: http://localhost:8000/admin/
- **🎨 Frontend**: http://localhost:3000

### **🔑 Login Credentials**
- **📧 Email**: admin@autoera.com
- **🔒 Password**: admin123

---

## 🤖 **AI MODULE ENDPOINTS**

### **💰 Finance AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/finance/
- Credit Scoring, EMI Calculator, Loan Approval
- Fraud Detection, Risk Assessment, Payment Prediction
- Financial Analytics, Investment Advisory

### **🚗 Sales AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/sales/
- Lead Scoring, Vehicle Recommendation, Price Optimization
- Customer Segmentation, Sales Forecasting, Virtual Showroom

### **🔧 Service AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/service/
- Predictive Maintenance, Service Scheduling, Diagnostic AI
- Parts Prediction, Route Optimization, Quality Assessment, Voice Assistant

### **🛡️ Insurance AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/insurance/
- Claims Processing, Risk Assessment, Damage Assessment
- Fraud Detection, Premium Calculator

### **👥 Workforce AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/workforce/
- Skill Matching, Performance Tracking, Training Recommendations
- Shift Optimization, Productivity Analytics, Employee Engagement

### **🔋 Fleet EV AI Engine**
**Base URL**: http://localhost:8000/api/ai-engine/fleet/
- Battery Health Monitor, Charging Optimization, Route Planning
- Energy Management, Fleet Analytics, Maintenance Prediction

---

## 📊 **INFRASTRUCTURE**

### **🗄️ Database & Cache**
- **PostgreSQL**: localhost:5432 (autoera_db)
- **Redis**: localhost:6379

### **🐳 Docker Services**
- **Backend**: Django + Gunicorn + 6 AI Engines
- **Frontend**: Next.js + TypeScript + Material-UI
- **Database**: PostgreSQL 15
- **Cache**: Redis 7

---

## 🛠️ **MANAGEMENT COMMANDS**

### **📋 Service Management**
```bash
# Check service status
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs backend -f
docker-compose logs frontend -f

# Restart services
docker-compose restart
docker-compose restart backend
docker-compose restart frontend

# Stop all services
docker-compose down

# Complete cleanup
docker-compose down -v --remove-orphans
docker system prune -f
```

### **👤 User Management**
```bash
# Create admin user manually
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic
```

---

## 🔧 **TROUBLESHOOTING**

### **🚨 Common Issues**

**Backend not responding:**
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check database connection
docker-compose exec backend python manage.py dbshell
```

**Frontend not loading:**
```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Manual frontend start
cd frontend
npm install
npm run dev
```

**Port conflicts:**
```bash
# Check what's using ports
netstat -ano | findstr :8000
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill processes if needed
taskkill /PID <process_id> /F
```

### **🔄 Reset Everything**
```bash
# Complete reset
docker-compose down -v --remove-orphans
docker system prune -f
docker volume prune -f
deploy.bat
```

---

## 🎯 **DEVELOPMENT WORKFLOW**

### **🔧 Backend Development**
```bash
# Access backend container
docker-compose exec backend bash

# Install new Python packages
docker-compose exec backend pip install <package>

# Run Django commands
docker-compose exec backend python manage.py <command>
```

### **🎨 Frontend Development**
```bash
# Access frontend container
docker-compose exec frontend sh

# Install new npm packages
docker-compose exec frontend npm install <package>

# Development mode (outside container)
cd frontend
npm run dev
```

---

## 📈 **SCALING & PRODUCTION**

### **🚀 Production Deployment**
1. Update environment variables in docker-compose.yml
2. Set DEBUG=False in Django settings
3. Configure proper SECRET_KEY
4. Set up SSL/HTTPS
5. Configure domain names
6. Set up monitoring and logging

### **📊 Performance Optimization**
- Increase Gunicorn workers
- Configure Redis for caching
- Set up database connection pooling
- Use CDN for static files
- Configure load balancing

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Docker and Docker Compose installed
- [ ] Ports 3000, 5432, 6379, 8000 available
- [ ] Run `deploy.bat` or `deploy.sh`
- [ ] Access http://localhost:8000/admin/
- [ ] Login with admin@autoera.com / admin123
- [ ] Test AI module endpoints
- [ ] Access frontend at http://localhost:3000
- [ ] Verify all services are healthy

---

## 🎉 **SUCCESS!**

Your **AUTOERA AI SaaS** is now fully deployed with:
- ✅ **6 AI Engines** with 38+ specialized modules
- ✅ **Django Backend** with REST API
- ✅ **Next.js Frontend** with modern UI
- ✅ **PostgreSQL Database** with Redis cache
- ✅ **Docker containerization** for easy deployment
- ✅ **80+ API endpoints** ready for use

**🚀 Ready for business operations and customer onboarding!**
