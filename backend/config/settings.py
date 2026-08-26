"""
AutoEra AI ERP — Production Django Settings
All secrets loaded from environment variables. Never commit real secrets.
"""
import os
from pathlib import Path
from datetime import timedelta

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# ──────────────────────────────────────────────
# SECURITY — All from environment variables
# ──────────────────────────────────────────────
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'CHANGE-ME-IN-PRODUCTION')
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ──────────────────────────────────────────────
# APPLICATION DEFINITION
# ──────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'django_filters',
    'drf_spectacular',

    # AutoEra Domain Apps
    'core',
    'identity',
    'organization',
    'customers',
    'vehicles',
    'sales',
    'service',
    'workshop',
    'inventory',
    'finance',
    'billing',
    'communication',
    'ai_platform',
    'audit_log',
    'insurance',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'core.middleware.TenantMiddleware',
    'core.middleware.AuditLogMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

(BASE_DIR / 'logs').mkdir(parents=True, exist_ok=True)

# ──────────────────────────────────────────────
# DATABASE — PostgreSQL for production (SQLite for local dev if specified)
# ──────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3' if DEBUG else 'django.db.backends.postgresql'),
        'NAME': BASE_DIR / 'db.sqlite3' if os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3' if DEBUG else 'django.db.backends.postgresql') == 'django.db.backends.sqlite3' else os.environ.get('DB_NAME', 'autoera_db'),
        'USER': os.environ.get('DB_USER', 'autoera_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'connect_timeout': 10,
        } if os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3' if DEBUG else 'django.db.backends.postgresql') != 'django.db.backends.sqlite3' else {},
    }
}

if os.environ.get('DATABASE_URL'):
    try:
        import environ
        env = environ.Env()
        DATABASES['default'] = env.db_url_config(os.environ['DATABASE_URL'])
        DATABASES['default']['CONN_MAX_AGE'] = 600
    except Exception as e:
        pass

# ──────────────────────────────────────────────
# PASSWORD VALIDATION
# ──────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 10}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ──────────────────────────────────────────────
# INTERNATIONALIZATION
# ──────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# ──────────────────────────────────────────────
# STATIC FILES
# ──────────────────────────────────────────────
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ──────────────────────────────────────────────
# AUTH
# ──────────────────────────────────────────────
AUTH_USER_MODEL = 'identity.User'

# ──────────────────────────────────────────────
# CORS & CSRF — Restricted, not wildcard
# ──────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://localhost:3000,https://autoera-ai-erp.vercel.app'
    ).split(',')
    if origin.strip()
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.vercel\.app$",
    r"^https:\/\/.*\.onrender\.com$",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        'CSRF_TRUSTED_ORIGINS',
        'https://autoera-ai-erp.vercel.app,http://localhost:5173,http://localhost:3000,https://*.vercel.app,https://*.onrender.com'
    ).split(',')
    if origin.strip()
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ──────────────────────────────────────────────
# REST FRAMEWORK
# ──────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/minute',
        'user': '200/minute',
    },
    'EXCEPTION_HANDLER': 'core.exceptions.autoera_exception_handler',
}

# ──────────────────────────────────────────────
# JWT CONFIGURATION
# ──────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': os.environ.get('JWT_SIGNING_KEY', SECRET_KEY),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ──────────────────────────────────────────────
# DRF SPECTACULAR (OpenAPI)
# ──────────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'AutoEra AI ERP API',
    'DESCRIPTION': 'Enterprise Automotive Dealership ERP API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# ──────────────────────────────────────────────
# CELERY / REDIS
# ──────────────────────────────────────────────
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

# ──────────────────────────────────────────────
# CACHES
# ──────────────────────────────────────────────
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache' if os.environ.get('REDIS_URL') else 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': os.environ.get('REDIS_URL', 'autoera-locmem-cache'),
    }
}

# ──────────────────────────────────────────────
# LOGGING — Structured, production-grade
# ──────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{asctime} {levelname} {name} {module} {message}',
            'style': '{',
        },
        'json': {
            'format': '{asctime} {levelname} {name} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'autoera.log',
            'formatter': 'verbose',
        } if not DEBUG else {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'autoera': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ──────────────────────────────────────────────
# SECURITY HEADERS (production)
# ──────────────────────────────────────────────
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# ──────────────────────────────────────────────
# AI CONFIGURATION (2026 PRODUCTION MODELS)
# ──────────────────────────────────────────────
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
AI_DEFAULT_PROVIDER = os.environ.get('AI_DEFAULT_PROVIDER', 'gemini')
AI_MAX_TOKENS = int(os.environ.get('AI_MAX_TOKENS', '2048'))

# Modern 2026 Gemini Models
GEMINI_MODEL_NAME = os.environ.get('GEMINI_MODEL_NAME', 'gemini-3.6-flash') # Primary production LLM
GEMINI_FAST_MODEL_NAME = os.environ.get('GEMINI_FAST_MODEL_NAME', 'gemini-3.5-flash-lite') # Low-cost voice turns
GEMINI_EMBEDDING_MODEL = os.environ.get('GEMINI_EMBEDDING_MODEL', 'models/gemini-embedding-2') # Production dense embedding model
GEMINI_EMBEDDING_DIMENSION = int(os.environ.get('GEMINI_EMBEDDING_DIMENSION', '768'))


GOOGLE_SPEECH_API_KEY = os.environ.get('GOOGLE_SPEECH_API_KEY', '')
GOOGLE_TTS_API_KEY = os.environ.get('GOOGLE_TTS_API_KEY', '')


# ──────────────────────────────────────────────
# VOICE & TELEPHONY CONFIGURATION
# ──────────────────────────────────────────────
VOICE_PROVIDER = os.environ.get('VOICE_PROVIDER', 'simulator') # twilio, exotel, simulator
VOICE_ACCOUNT_ID = os.environ.get('VOICE_ACCOUNT_ID', '')
VOICE_AUTH_TOKEN = os.environ.get('VOICE_AUTH_TOKEN', '')
VOICE_PHONE_NUMBER = os.environ.get('VOICE_PHONE_NUMBER', '')
VOICE_WEBHOOK_SECRET = os.environ.get('VOICE_WEBHOOK_SECRET', 'autoera_voice_sim_secret_2026')
VOICE_RECORDING_ENABLED = os.environ.get('VOICE_RECORDING_ENABLED', 'False').lower() in ('true', '1', 'yes')

# ──────────────────────────────────────────────
# RAZORPAY
# ──────────────────────────────────────────────
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
RAZORPAY_WEBHOOK_SECRET = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '')

