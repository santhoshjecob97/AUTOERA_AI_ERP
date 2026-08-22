# 🚀 AUTOERA SaaS Deployment Guide - Render Cloud Platform

## 📋 Overview

This comprehensive guide provides step-by-step instructions for deploying AUTOERA SaaS on Render's cloud platform. Render offers a streamlined deployment experience with managed databases, automatic SSL, and global CDN.

### 🎯 Deployment Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Databases     │
│   (Next.js)     │◄──►│   (Django)      │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Caching)     │
                       └─────────────────┘
```

### 📊 Service Requirements
- **Web Service**: Django backend application
- **Static Site**: Next.js frontend (optional - can be integrated)
- **PostgreSQL**: Main database with PostGIS
- **Key Value**: Redis for caching and sessions
- **Cron Jobs**: Scheduled tasks for AI model updates

---

## 🔧 Prerequisites

### 1.1 Render Account Setup
- [ ] **Create Render Account**: Visit https://render.com and sign up
- [ ] **Verify Email**: Confirm your email address
- [ ] **Add Payment Method**: Required for production services
- [ ] **Enable Two-Factor Authentication**: For security

### 1.2 Repository Preparation
- [ ] **Git Repository**: Push your code to GitHub/GitLab/Bitbucket
- [ ] **Branch Structure**: Use `main` or `master` branch for deployment
- [ ] **Environment Variables**: Prepare all required environment variables
- [ ] **Docker Files**: Ensure Dockerfile and docker-compose.yml are ready

### 1.3 Domain & SSL
- [ ] **Domain Purchase**: Buy domain from Namecheap, GoDaddy, or similar
- [ ] **DNS Configuration**: Point domain to Render (instructions provided)
- [ ] **SSL Certificate**: Automatic with Render (Let's Encrypt)

---

## 🗄️ Step 1: Database Setup

### 1.1 PostgreSQL Database
1. **Navigate to Dashboard**
   - Go to https://dashboard.render.com
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   ```
   Name: autoera-production-db
   Database: autoera_dealership
   User: autoera_user
   Region: Singapore (sg) - Closest to India
   PostgreSQL Version: 13
   Instance Type: Starter ($7/month)
   ```

3. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning
   - Note the **External Database URL**

### 1.2 Redis Key Value Store
1. **Create Redis Instance**
   - Click "New +" → "Key Value"
   ```
   Name: autoera-redis
   Instance Type: Starter ($7/month)
   Region: Singapore (sg)
   ```

2. **Note Connection Details**
   - Save the **Internal Database URL** for Django settings
   - Note the **Connection String** for environment variables

---

## 🖥️ Step 2: Backend Deployment (Django)

### 2.1 Create Web Service
1. **Navigate to Services**
   - Click "New +" → "Web Service"

2. **Connect Repository**
   ```
   Repository: [Your GitHub/GitLab repo URL]
   Branch: main
   Root Directory: ./AUTOERA_DEALERSHIP_DEPLOYMENT
   Runtime: Docker
   Build Command: docker build -f Dockerfile.backend -t autoera-backend .
   Start Command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
   ```

3. **Environment Variables**
   Add these environment variables:
   ```bash
   # Database
   DATABASE_URL=postgresql://[your-postgres-connection-string]
   REDIS_URL=redis://[your-redis-connection-string]

   # Django Settings
   SECRET_KEY=your-super-secret-key-here
   DEBUG=False
   DJANGO_SETTINGS_MODULE=config.settings.production

   # Security
   ALLOWED_HOSTS=your-app-name.onrender.com,yourdomain.com

   # External APIs (add your keys)
   OPENAI_API_KEY=your-openai-key
   STRIPE_SECRET_KEY=your-stripe-key
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret

   # Email Configuration
   SENDGRID_API_KEY=your-sendgrid-key
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

   # File Storage
   AWS_STORAGE_BUCKET_NAME=your-bucket-name
   AWS_S3_REGION_NAME=ap-south-1
   ```

4. **Advanced Settings**
   ```
   Instance Type: Starter ($7/month)
   Auto-Deploy: Yes (deploy on git push)
   Health Check Path: /api/health/
   ```

### 2.2 Deploy Backend
1. **Click "Create Web Service"**
2. **Wait for Build**: 5-10 minutes for first deployment
3. **Check Logs**: Monitor build and runtime logs
4. **Verify Deployment**: Visit the provided URL

### 2.3 Database Migration
1. **Access Django Shell**
   ```bash
   # Via Render Dashboard
   - Go to your web service
   - Click "Shell" tab
   - Run: python manage.py migrate
   - Run: python manage.py collectstatic --noinput
   ```

2. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   # Enter username, email, password
   ```

---

## 🌐 Step 3: Frontend Deployment (Next.js)

### 3.1 Create Static Site
1. **Navigate to Services**
   - Click "New +" → "Static Site"

2. **Connect Repository**
   ```
   Repository: [Your frontend GitHub repo URL]
   Branch: main
   Root Directory: ./frontend
   Build Command: npm run build
   Publish Directory: out
   ```

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com/api
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=https://your-frontend-app.onrender.com
   ```

4. **Create Static Site**
   - Click "Create Static Site"
   - Wait for build completion

### 3.2 Alternative: Integrated Frontend
If you prefer single deployment, you can:
1. **Serve frontend from Django**
2. **Use Django's static file serving**
3. **Configure Nginx for SPA routing**

---

## ⚙️ Step 4: Service Configuration

### 4.1 Environment Variables Setup
Create a `.env` file in your repository:

```bash
# Production Environment Variables
# Copy this to your Render service settings

# Database Configuration
DATABASE_URL=postgresql://autoera_user:password@autoera-production-db:5432/autoera_dealership
REDIS_URL=rediss://autoera-redis:6379

# Django Settings
SECRET_KEY=your-production-secret-key-change-this
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings.production
ALLOWED_HOSTS=your-app.onrender.com,yourdomain.com

# Security Settings
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# API Keys (Add your actual keys)
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Communication Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=SG.your_sendgrid_key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=autoera-media-bucket
AWS_S3_REGION_NAME=ap-south-1
AWS_S3_CUSTOM_DOMAIN=cdn.autoera.in

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your_sendgrid_key

# Celery Configuration (for background tasks)
CELERY_BROKER_URL=rediss://autoera-redis:6379/0
CELERY_RESULT_BACKEND=rediss://autoera-redis:6379/0
CELERY_ACCEPT_CONTENT=['json']
CELERY_TASK_SERIALIZER='json'
CELERY_RESULT_SERIALIZER='json'
CELERY_TIMEZONE='Asia/Kolkata'

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 4.2 Custom Domains
1. **Add Custom Domain**
   - Go to your web service settings
   - Click "Custom Domains"
   - Add your domain (e.g., app.autoera.in)
   - Configure DNS settings as instructed

2. **SSL Configuration**
   - Render automatically provisions SSL certificates
   - Wait 5-10 minutes for certificate generation
   - Verify HTTPS access

### 4.3 Health Checks
Configure health check endpoints:

```python
# In your Django urls.py
from django.urls import path
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy", "service": "autoera"})

urlpatterns = [
    path('api/health/', health_check),
    # ... other URLs
]
```

---

## 🔄 Step 5: Background Services & Cron Jobs

### 5.1 Celery Worker Service
1. **Create Background Worker**
   - Click "New +" → "Background Worker"
   ```
   Name: autoera-worker
   Runtime: Docker
   Build Command: docker build -f Dockerfile.backend -t autoera-worker .
   Start Command: celery -A config worker --loglevel=info --concurrency=2
   Environment: Same as web service
   ```

### 5.2 Cron Job Service
1. **Create Cron Job Service**
   - Click "New +" → "Cron Job"
   ```
   Name: autoera-cron
   Runtime: Docker
   Schedule: 0 2 * * * (daily at 2 AM)
   Command: python manage.py update_ai_models
   Environment: Same as web service
   ```

### 5.3 Scheduled Tasks
Create these cron jobs for maintenance:

```bash
# Daily Tasks (2:00 AM)
0 2 * * * python manage.py update_ai_models
0 3 * * * python manage.py cleanup_old_data
0 4 * * * python manage.py generate_reports

# Weekly Tasks (Sunday 1:00 AM)
0 1 * * 0 python manage.py backup_database
0 2 * * 0 python manage.py optimize_performance

# Monthly Tasks (1st of month 3:00 AM)
0 3 1 * * python manage.py generate_monthly_analytics
```

---

## 📊 Step 6: Monitoring & Analytics

### 6.1 Application Monitoring
1. **Render Dashboard Monitoring**
   - CPU and memory usage
   - Response times and throughput
   - Error rates and logs
   - Service uptime

2. **Custom Monitoring Setup**
   ```python
   # Add to your Django settings
   INSTALLED_APPS += [
       'django_prometheus',
   ]

   # Prometheus metrics endpoint
   urlpatterns += [
       path('', include('django_prometheus.urls')),
   ]
   ```

### 6.2 Database Monitoring
- **PostgreSQL Dashboard**: Built into Render
- **Query Performance**: Use pg_stat_statements
- **Connection Pooling**: Configure PgBouncer if needed
- **Backup Monitoring**: Verify daily backups

### 6.3 Error Tracking
1. **Sentry Integration**
   ```bash
   pip install sentry-sdk
   ```

2. **Configure Sentry**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.django import DjangoIntegration

   sentry_sdk.init(
       dsn="your-sentry-dsn",
       integrations=[DjangoIntegration()],
       environment="production",
   )
   ```

---

## 🚀 Step 7: Go-Live Checklist

### 7.1 Pre-Launch Testing
- [ ] **Database Connectivity**: Test all database connections
- [ ] **API Endpoints**: Verify all APIs return 200 status
- [ ] **Static Files**: Ensure CSS/JS/images load correctly
- [ ] **Authentication**: Test login/logout functionality
- [ ] **Email Services**: Verify email sending capabilities
- [ ] **File Uploads**: Test media file uploads to S3
- [ ] **Background Jobs**: Verify Celery workers are running
- [ ] **SSL Certificate**: Confirm HTTPS is working

### 7.2 Performance Optimization
- [ ] **Database Indexing**: Optimize slow queries
- [ ] **Caching**: Implement Redis caching for frequently accessed data
- [ ] **Image Optimization**: Compress and optimize static assets
- [ ] **CDN Configuration**: Set up CloudFlare or similar CDN
- [ ] **Compression**: Enable gzip compression

### 7.3 Security Hardening
- [ ] **Environment Variables**: Verify no secrets in code
- [ ] **Firewall Rules**: Configure security groups
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Content Security Policy**: Configure CSP headers
- [ ] **HTTPS Only**: Force all traffic to HTTPS

### 7.4 Backup & Recovery
- [ ] **Database Backups**: Automated daily backups configured
- [ ] **File Backups**: S3 bucket versioning enabled
- [ ] **Disaster Recovery**: Test restore procedures
- [ ] **Monitoring Alerts**: Set up alerts for failures

---

## 📋 Step 8: Post-Deployment Tasks

### 8.1 Initial Monitoring
Monitor these metrics for the first 24-48 hours:

```bash
# Key Metrics to Track
- Response Time: < 500ms average
- Error Rate: < 0.1%
- Uptime: 99.9%+
- Database Connections: < 80% of max
- Memory Usage: < 70% of allocated
- CPU Usage: < 60% average
```

### 8.2 User Acceptance Testing
- [ ] **Core Functionality**: Test all main features
- [ ] **Data Integrity**: Verify data accuracy
- [ ] **Performance**: Check loading times
- [ ] **Mobile Responsiveness**: Test on mobile devices
- [ ] **Integration Testing**: Test third-party connections

### 8.3 Documentation Updates
- [ ] **API Documentation**: Update with production URLs
- [ ] **User Guides**: Update with current screenshots
- [ ] **Troubleshooting**: Document common issues
- [ ] **Contact Information**: Update support details

### 8.4 Team Training
- [ ] **Admin Training**: Superuser capabilities
- [ ] **User Training**: Department-specific features
- [ ] **Developer Training**: API and integration access
- [ ] **Support Training**: Troubleshooting procedures

---

## 🛠️ Step 9: Maintenance & Scaling

### 9.1 Routine Maintenance
```bash
# Daily Tasks
- Monitor service health
- Check error logs
- Verify backups
- Review performance metrics

# Weekly Tasks
- Update dependencies
- Optimize slow queries
- Review user feedback
- Security patches

# Monthly Tasks
- Performance testing
- Load testing
- Security audits
- Capacity planning
```

### 9.2 Scaling Considerations
1. **Horizontal Scaling**
   - Add more web service instances
   - Configure load balancer
   - Database read replicas

2. **Vertical Scaling**
   - Upgrade instance types
   - Increase memory/CPU
   - Optimize database performance

3. **Global Scaling**
   - Multi-region deployment
   - CDN configuration
   - Localized data storage

### 9.3 Cost Optimization
- **Monitor Usage**: Track resource consumption
- **Right-size Instances**: Adjust based on actual usage
- **Auto-scaling**: Configure based on traffic patterns
- **Reserved Instances**: For predictable workloads

---

## 📞 Support & Troubleshooting

### 10.1 Common Issues

#### 🚨 Database Connection Errors
```
Problem: Database connection timeout
Solutions:
├── Check DATABASE_URL format
├── Verify database is running
├── Test connection from Django shell
└── Check firewall settings
```

#### 🌐 SSL Certificate Issues
```
Problem: HTTPS not working
Solutions:
├── Wait for certificate provisioning (5-10 min)
├── Check domain DNS settings
├── Verify ALLOWED_HOSTS includes domain
└── Test with curl -I https://yourdomain.com
```

#### ⚡ Performance Issues
```
Problem: Slow response times
Solutions:
├── Check database query performance
├── Implement caching
├── Optimize static file delivery
└── Review instance resources
```

#### 🔐 Authentication Problems
```
Problem: Login not working
Solutions:
├── Verify DEBUG=False in production
├── Check SECRET_KEY configuration
├── Test password reset functionality
└── Review authentication settings
```

### 10.2 Emergency Procedures

#### 🚨 Service Downtime
1. **Immediate Actions**
   - Check Render dashboard for service status
   - Review recent deployments for issues
   - Check database connectivity
   - Verify environment variables

2. **Recovery Steps**
   - Rollback to previous working version if needed
   - Restart services if required
   - Contact Render support if infrastructure issue
   - Communicate status to users

#### 💾 Data Recovery
1. **Database Recovery**
   - Restore from latest backup
   - Test data integrity
   - Verify application functionality
   - Update users on recovery status

2. **File Recovery**
   - Restore from S3 version history
   - Verify file accessibility
   - Update CDN cache if needed

### 10.3 Contact Information
- **Render Support**: https://render.com/support
- **AUTOERA Support**: support@autoera.in
- **Emergency Phone**: +91-1800-AUTOERA

---

## 🎉 Deployment Success Checklist

### ✅ Services Deployed
- [ ] **PostgreSQL Database**: Running and accessible
- [ ] **Redis Cache**: Configured and connected
- [ ] **Django Backend**: Deployed and responding
- [ ] **Next.js Frontend**: Built and serving
- [ ] **Background Workers**: Celery workers running
- [ ] **Cron Jobs**: Scheduled tasks configured

### ✅ Configuration Complete
- [ ] **Environment Variables**: All variables set
- [ ] **Custom Domain**: DNS configured and SSL active
- [ ] **Database Migrations**: All migrations applied
- [ ] **Static Files**: Collected and served
- [ ] **Email Services**: Configured and tested
- [ ] **File Storage**: S3 bucket configured

### ✅ Testing Passed
- [ ] **Health Checks**: All endpoints responding
- [ ] **Load Testing**: Performance verified
- [ ] **Security Testing**: Vulnerabilities addressed
- [ ] **Integration Testing**: Third-party services working
- [ ] **User Testing**: Core functionality verified

### ✅ Monitoring Active
- [ ] **Application Monitoring**: Metrics collecting
- [ ] **Error Tracking**: Sentry configured
- [ ] **Performance Monitoring**: Dashboards active
- [ ] **Alerting**: Notifications configured
- [ ] **Log Aggregation**: Centralized logging

### ✅ Documentation Updated
- [ ] **API Documentation**: Production URLs updated
- [ ] **User Guides**: Current screenshots and instructions
- [ ] **Runbooks**: Deployment and troubleshooting docs
- [ ] **Contact Lists**: Support information current

---

## 🚀 Next Steps

1. **Monitor Performance**: Track metrics for 24-48 hours
2. **User Onboarding**: Begin training and user adoption
3. **Feature Rollout**: Gradually activate advanced features
4. **Optimization**: Fine-tune performance based on real usage
5. **Scaling Planning**: Prepare for growth and expansion

**Congratulations! Your AUTOERA SaaS is now live on Render! 🎉**

For ongoing support and optimization, contact the AUTOERA team or visit our documentation portal.

---

**Document Version**: 2.0 | **Last Updated**: September 2025
**AUTOERA**: Powering the Future of Automotive Excellence
