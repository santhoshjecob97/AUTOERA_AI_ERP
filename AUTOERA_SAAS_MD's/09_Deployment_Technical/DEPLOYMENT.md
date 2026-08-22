# AUTOERA MaaS AI - Complete Deployment Guide

## 🎯 One-Click Deployment

### Windows Users
```bash
# Run the deployment script
deploy.bat
```

### Manual Docker Deployment
```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your settings

# 2. Deploy
docker-compose up -d

# 3. Run migrations
docker-compose exec web python manage.py migrate

# 4. Create admin user
docker-compose exec web python manage.py createsuperuser
```

## 🌐 Render Cloud Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Connect GitHub repository
   - Render will use `render.yaml` automatically
   - Services deploy in order: Database → Redis → Backend → Worker → Frontend

## 📋 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Required
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database (auto-configured in Docker)
DB_NAME=autoera_db
DB_USER=autoera_user
DB_PASSWORD=autoera_password_2024

# Optional API Keys
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
SENDGRID_API_KEY=SG.your-sendgrid-key
```

## 🔍 Service URLs

After deployment:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/
- **Health Check**: http://localhost:8000/api/health/

## 🛠️ Management Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Access Django shell
docker-compose exec web python manage.py shell

# Run migrations
docker-compose exec web python manage.py migrate

# Collect static files
docker-compose exec web python manage.py collectstatic
```

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :8000
# Kill the process or change ports in docker-compose.yml
```

**Database Connection Failed**
```bash
# Check database status
docker-compose ps
# Restart database
docker-compose restart db
```

**Static Files Not Loading**
```bash
# Collect static files
docker-compose exec web python manage.py collectstatic --noinput
```

**Frontend Can't Connect to Backend**
- Ensure `REACT_APP_API_URL=http://web:8000` in docker-compose.yml
- Check CORS settings in Django settings

## 📊 Production Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up SSL certificates
- [ ] Configure email backend
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use environment variables for all secrets
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## 📞 Support

If you encounter issues:
1. Check service logs: `docker-compose logs [service-name]`
2. Verify environment variables are set correctly
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
