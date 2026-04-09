# Deployment Guide - Metro Rail App

Complete guide for deploying Metro Rail App to production environments. Covers local development, staging, and production deployment strategies.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)

---

## Local Development Setup

### Prerequisites

**System Requirements:**
- OS: Windows, macOS, or Linux
- Node.js: v16.x or higher (v18+ recommended)
- npm: v8+ or yarn v3+
- MySQL: v5.7+ or MariaDB v10.3+
- Git: v2.30+
- Disk Space: 2GB minimum

### Step 1: System Dependencies

**Windows:**
```bash
# Using Chocolatey (recommended)
choco install nodejs mysql

# Or download from:
# - Node.js: https://nodejs.org/
# - MySQL: https://dev.mysql.com/downloads/mysql/
```

**macOS:**
```bash
# Using Homebrew
brew install node mysql

# Or download from website
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install nodejs npm mysql-server
```

### Step 2: Clone Repository

```bash
git clone https://github.com/sudohimel/metro-rail-app.git
cd metro-rail-app
```

### Step 3: Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### Step 4: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local configuration
# Windows users use Notepad or VS Code
code .env
```

**Local .env Configuration:**
```env
# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-local-secret-key-min-32-chars
JWT_EXPIRATION_TIME=3600

# Database
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=metro_rail_db_dev
```

### Step 5: Database Setup

```bash
# Start MySQL service
# Windows: Services > MySQL80 (or your version)
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Create database
mysql -u root -p

# Enter password and run:
CREATE DATABASE metro_rail_db_dev;
USE metro_rail_db_dev;
```

### Step 6: Start Development Server

```bash
# Watch mode (recommended for development)
yarn start:dev

# Or standard start
yarn start

# Or with debugging
yarn start:debug
```

**Expected Output:**
```
[Nest] 1234  - 04/10/2024, 10:30:00 AM     LOG [NestFactory] 🚀 Starting Nest application...
[Nest] 1234  - 04/10/2024, 10:30:00 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 1234  - 04/10/2024, 10:30:01 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 1234  - 04/10/2024, 10:30:02 AM     LOG [NestApplication] Nest application successfully started
```

**Verify Server:**
```bash
curl http://localhost:3000

# Response:
# "Hello World!"
```

### Step 7: Test the Application

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run with coverage report
yarn test:cov

# Run E2E tests
yarn test:e2e
```

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing: `yarn test`
- [ ] No linting errors: `yarn lint`
- [ ] Code formatted: `yarn format`
- [ ] Build succeeds: `yarn build`
- [ ] No console.log statements
- [ ] No hardcoded secrets/credentials
- [ ] TypeScript strict mode enabled
- [ ] All dependencies up-to-date

### Security
- [ ] JWT_SECRET is strong (>32 chars)
- [ ] Database password secured
- [ ] .env not committed to git
- [ ] .env.example doesn't contain secrets
- [ ] HTTPS configured for production
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (TypeORM)
- [ ] CORS configured properly

### Documentation
- [ ] README.md complete and accurate
- [ ] API_DOCUMENTATION.md updated
- [ ] ARCHITECTURE.md current
- [ ] Code comments for complex logic
- [ ] Environment variables documented

### Database
- [ ] Migrations created for schema changes
- [ ] Database backups configured
- [ ] Connection pooling enabled
- [ ] Indexes on frequently queried fields
- [ ] Foreign keys properly configured

### Performance
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Caching strategy implemented
- [ ] Response times acceptable
- [ ] Load testing completed

### Deployment
- [ ] Hosting platform selected (AWS, Heroku, GCP, etc.)
- [ ] Domain/SSL certificates prepared
- [ ] CI/CD pipeline configured
- [ ] Monitoring tools setup
- [ ] Error tracking (Sentry, etc.)

---

## Production Deployment

### Option 1: AWS EC2 + RDS

#### Prerequisites
- AWS account with appropriate permissions
- EC2 instance (t3.small minimum)
- RDS MySQL instance (db.t3.small minimum)

#### Deployment Steps

**1. Launch EC2 Instance**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

**2. Clone and Setup Application**
```bash
cd /var/www
sudo git clone https://github.com/sudohimel/metro-rail-app.git
cd metro-rail-app

# Install dependencies
yarn install

# Create .env with RDS credentials
sudo nano .env
```

**3. Build Application**
```bash
yarn build
```

**4. Start with PM2**
```bash
# Start application
pm2 start dist/main.js --name "metro-rail-app"

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

**5. Configure Nginx Reverse Proxy**
```bash
sudo apt-get install nginx

# Create config file
sudo nano /etc/nginx/sites-available/metro-rail-app

# Add configuration (see Nginx Config section)
# Enable site
sudo ln -s /etc/nginx/sites-available/metro-rail-app /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

**6. Setup SSL Certificate (Let's Encrypt)**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

**Nginx Configuration Example:**
```nginx
upstream metro_rail_app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name yourdomain.com;
  
  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  
  location / {
    proxy_pass http://metro_rail_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Option 2: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository initialized

#### Deployment Steps

**1. Create Heroku App**
```bash
heroku create metro-rail-app

# Or with specific buildpack
heroku buildpacks:add heroku/nodejs
```

**2. Add MySQL Database**
```bash
# Add JawsDB (Heroku MySQL addon)
heroku addons:create jawsdb:kitefin
```

**3. Configure Environment**
```bash
heroku config:set JWT_SECRET="your-secret-key-here"
heroku config:set JWT_EXPIRATION_TIME=3600
heroku config:set NODE_ENV=production

# Check configuration
heroku config
```

**4. Deploy**
```bash
git push heroku main
```

**5. Verify Deployment**
```bash
heroku logs --tail

# Test endpoint
curl https://metro-rail-app.herokuapp.com
```

### Option 3: Docker + Kubernetes

#### Prerequisites
- Docker installed
- Kubernetes cluster access
- Container registry (Docker Hub, ECR, etc.)

#### Docker Configuration

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

**.dockerignore:**
```
node_modules
.env
.env.*
dist
.git
.gitignore
.eslintrc.js
.prettierrc
jest.config.js
tsconfig*.json
yarn.lock
npm-debug.log*
.DS_Store
.vscode
```

**Build and Push:**
```bash
# Build image
docker build -t metro-rail-app:1.0.0 .

# Tag for registry
docker tag metro-rail-app:1.0.0 your-registry/metro-rail-app:1.0.0

# Push to registry
docker push your-registry/metro-rail-app:1.0.0
```

**Kubernetes Deployment:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: metro-rail

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metro-rail-app
  namespace: metro-rail
spec:
  replicas: 3
  selector:
    matchLabels:
      app: metro-rail-app
  template:
    metadata:
      labels:
        app: metro-rail-app
    spec:
      containers:
      - name: metro-rail-app
        image: your-registry/metro-rail-app:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: metro-rail-secrets
              key: jwt-secret
        - name: DB_HOST
          value: mysql-service
        - name: DB_PORT
          value: "3306"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: DB_NAME
          value: metro_rail_db
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: metro-rail-service
  namespace: metro-rail
spec:
  type: LoadBalancer
  selector:
    app: metro-rail-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

---

## Environment Configuration

### Development Environment (.env.example)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION_TIME=3600
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=metro_rail_db_dev
LOG_LEVEL=debug
```

### Production Environment
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=production-secret-key-min-32-characters-strong
JWT_EXPIRATION_TIME=3600
DB_HOST=production-mysql-host
DB_PORT=3306
DB_USERNAME=metro_user
DB_PASSWORD=strong_database_password
DB_NAME=metro_rail_db_prod
LOG_LEVEL=error
SENTRY_DSN=your-sentry-dsn-url
```

### Security Best Practices
- Use strong random passwords (>20 characters)
- Store secrets in environment, never in code
- Use secure secret management (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Use different credentials for each environment
- Enable database encryption at rest
- Use VPN/Private networks for database connections

---

## Database Setup

### Initial Schema Creation

The application uses TypeORM with `synchronize: true` in development, which automatically creates/updates schema.

For production, use migrations:

```bash
# Generate migration
npm run typeorm:migration:generate -- -n InitialSchema

# Run migrations
npm run typeorm:migration:run

# Revert migration
npm run typeorm:migration:revert
```

### Backup Strategy

**Automated Backups:**
```bash
# Daily backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > /backups/metro_rail_$TIMESTAMP.sql
gzip /backups/metro_rail_$TIMESTAMP.sql
# Upload to cloud storage (S3, GCS, etc.)
```

**Restore from Backup:**
```bash
gunzip /backups/metro_rail_20240410_100000.sql.gz
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < /backups/metro_rail_20240410_100000.sql
```

---

## Security Hardening

### Application Security

**1. Enable HTTPS**
```nginx
# Nginx config
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

**2. Security Headers**
```typescript
// main.ts
app.use(helmet()); // Adds security headers
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});
```

**3. Rate Limiting**
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})
export class AppModule {}
```

**4. Input Validation**
- All DTOs use class-validator decorators
- Sanitize user input
- Validate file uploads
- Implement max request size

### Database Security

```sql
-- Create database user with limited permissions
CREATE USER 'metro_user'@'localhost' IDENTIFIED BY 'strong_password';

-- Grant minimal necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON metro_rail_db.* TO 'metro_user'@'localhost';

-- Revoke dangerous permissions
REVOKE ALL PRIVILEGES ON *.* FROM 'metro_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

### Infrastructure Security

- [ ] Use private subnets for database
- [ ] Enable security groups/firewalls
- [ ] Use VPN for database access
- [ ] Monitor failed login attempts
- [ ] Regular security updates
- [ ] Disable unnecessary services
- [ ] Configure logging and monitoring

---

## Monitoring & Logging

### Application Logging

```typescript
// Configure logging in main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');
logger.debug(`Application running on port ${port}`);
logger.error('Critical error occurred', error.stack);
```

### Recommended Monitoring Tools

**1. Sentry (Error Tracking)**
```bash
npm install @sentry/node @sentry/tracing

# Initialize in main.ts
import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**2. Prometheus (Metrics)**
```bash
npm install @nestjs/terminus prom-client
```

**3. ELK Stack (Logs)**
- Elasticsearch: Log storage
- Logstash: Log processing
- Kibana: Log visualization

**4. CloudWatch (AWS)**
```bash
npm install aws-sdk
# Automatically logs to CloudWatch
```

### Health Check Endpoint

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, DbHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DbHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

**Health Check Response:**
```json
{
  "status":"ok",
  "info":{
    "database":{
      "status":"up"
    }
  },
  "details":{
    "database":{
      "status":"up"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check MySQL service
mysql -h localhost -u root -p -e "SELECT 1"

# Check credentials in .env
cat .env | grep DB_

# Check network connectivity
ping db_host
```

**2. Port Already in Use**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

**3. JWT Token Validation Fails**
```bash
# Check JWT_SECRET not empty
echo $JWT_SECRET

# Verify token format
# Should be: Bearer eyJhbGciOiJIUzI1NiI...
```

**4. CORS Errors**
```typescript
// Update app.enableCors() in main.ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**5. TypeORM Synchronization Issues**
```bash
# Check synchronize setting
# Set to false in production and use migrations

# Manually run migrations
npm run typeorm:migration:run
```

---

## Rollback Procedures

### Version Rollback

```bash
# List available releases
git log --oneline

# Rollback to previous version
git checkout <previous-commit-hash>
yarn install
yarn build
pm2 restart metro-rail-app
```

### Database Rollback

```bash
# Revert last migration
npm run typeorm:migration:revert

# Restore from backup
mysql -u root -p metro_rail_db < /backups/metro_rail_20240410.sql
```

### PM2 Process Rollback

```bash
# Save current version
pm2 save

# List saved configurations
pm2 list

# Restart previous version
pm2 restart metro-rail-app
```

### Monitor Rollback Progress

```bash
# Watch application logs
pm2 logs metro-rail-app

# Check health endpoint
curl https://yourdomain.com/health

# Monitor database
mysql -u root -p -e "SELECT COUNT(*) FROM journeys;"
```

---

## Post-Deployment

### Verification Checklist

- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] All endpoints responding
- [ ] Health check returning OK
- [ ] Logs accumulating properly
- [ ] Monitoring dashboard active
- [ ] Backups running automatically
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured

### Performance Baseline

Run performance tests:
```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Load test
ab -n 1000 -c 10 https://yourdomain.com/
```

Expected results:
- Requests per second: >1000
- Response time: <100ms (p50), <500ms (p95)
- Error rate: <0.1%

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Production Ready
