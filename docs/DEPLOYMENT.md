# SOLEINTEL Deployment Guide

This guide covers deployment of SOLEINTEL to production environments.

## Prerequisites

- Docker & Docker Compose
- PostgreSQL 16+ (managed or self-hosted)
- Redis (managed or self-hosted)
- Domain name and SSL certificate
- GitHub account (for CI/CD)
- Cloud hosting account (Vercel, Railway, Fly.io, etc.)

## Environment Setup

### 1. Create Production Environment File

```bash
# .env.production
DATABASE_URL=postgresql://user:password@db.example.com:5432/soleintel_prod
REDIS_URL=redis://redis.example.com:6379
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=https://your-domain.com
OPENAI_API_KEY=sk-...
LOG_LEVEL=warn
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=1h
```

### 2. Prepare Database

```bash
# Migrate database schema
DATABASE_URL=postgresql://... pnpm db:push

# Create indexes
psql postgresql://user:password@db.example.com:5432/soleintel_prod << EOF
CREATE INDEX idx_product_sku ON products(sku);
CREATE INDEX idx_product_upc ON products(upc);
CREATE INDEX idx_retailer_listing_product ON retailer_listings(product_id);
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE FULLTEXT INDEX idx_product_search ON products(title, description);
EOF
```

## Docker Deployment

### Build Production Image

```bash
docker build -t soleintel-api:1.0.0 \
  -f apps/api/Dockerfile \
  --build-arg NODE_ENV=production .
```

### Push to Registry

```bash
# Docker Hub
docker tag soleintel-api:1.0.0 yourusername/soleintel-api:1.0.0
docker push yourusername/soleintel-api:1.0.0

# Or private registry
docker tag soleintel-api:1.0.0 registry.example.com/soleintel-api:1.0.0
docker push registry.example.com/soleintel-api:1.0.0
```

### Run with Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  api:
    image: soleintel-api:1.0.0
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      PORT: 3000
    ports:
      - "3000:3000"
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment

### Create Deployment Manifest

```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: soleintel-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: soleintel-api
  template:
    metadata:
      labels:
        app: soleintel-api
    spec:
      containers:
      - name: api
        image: registry.example.com/soleintel-api:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: soleintel-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: soleintel-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

Deploy:
```bash
kubectl apply -f k8s/deployment.yml
```

## Vercel Deployment

### 1. Connect Repository

```bash
vercel link
```

### 2. Configure Environment

```bash
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add OPENAI_API_KEY
```

### 3. Build Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "pnpm build --filter=@soleintel/api",
  "outputDirectory": "apps/api/dist"
}
```

### 4. Deploy

```bash
vercel deploy --prod
```

## Railway Deployment

### 1. Connect Repository

```bash
railway link
```

### 2. Add Services

```bash
railway add postgresql
railway add redis
```

### 3. Configure Environment

```bash
railway variable add DATABASE_URL
railway variable add REDIS_URL
railway variable add OPENAI_API_KEY
```

### 4. Deploy

```bash
railway up
```

## Fly.io Deployment

### 1. Create App

```bash
fly launch --name soleintel-api
```

### 2. Configure fly.toml

```toml
[env]
  NODE_ENV = "production"

[[services]]
  protocol = "tcp"
  internal_port = 3000
  ports = [{handlers = ["http"], port = 80}]
```

### 3. Set Secrets

```bash
fly secrets set DATABASE_URL=postgresql://...
fly secrets set REDIS_URL=redis://...
fly secrets set OPENAI_API_KEY=sk-...
```

### 4. Deploy

```bash
fly deploy
```

## Chrome Extension Deployment

### 1. Build Extension

```bash
pnpm build --filter=@soleintel/extension
```

### 2. Prepare for Chrome Web Store

```bash
# Create submission package
cd apps/extension/dist
zip -r soleintel-extension.zip .
```

### 3. Submit to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New item"
3. Upload `soleintel-extension.zip`
4. Fill in details and submit for review

## Database Backups

### Automated Backups

```bash
# PostgreSQL
pg_dump --host=$DB_HOST --user=$DB_USER --password=$DB_PASSWORD \
  -F custom soleintel > backup-$(date +%Y%m%d).dump

# With cron job
0 2 * * * pg_dump ... > /backups/db-$(date +\%Y\%m\%d).dump
```

### Restore from Backup

```bash
pg_restore --host=$DB_HOST --user=$DB_USER --password=$DB_PASSWORD \
  -d soleintel backup-20240101.dump
```

## Monitoring & Alerts

### Health Checks

```bash
# Basic health check
curl https://api.soleintel.com/health

# Detailed status
curl https://api.soleintel.com/health/detailed
```

### Logging

```bash
# View logs
docker logs -f soleintel-api

# Or with journalctl
journalctl -u soleintel-api -f
```

### Metrics Collection

Set up monitoring for:
- Request latency
- Error rate
- Database query time
- Cache hit rate
- Memory/CPU usage

## SSL/TLS Configuration

### Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api.soleintel.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.soleintel.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Optimization

### Database

```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex
REINDEX INDEX CONCURRENTLY idx_product_sku;

-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Redis Optimization

```bash
# Monitor memory usage
redis-cli INFO memory

# Clear unused keys
redis-cli EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 'unused:*'
```

## Rollback Procedure

### Blue-Green Deployment

```bash
# Deploy new version to "green" environment
docker-compose -f docker-compose.green.yml up -d

# Test green environment
curl http://localhost:3001/health

# Switch traffic to green
docker-compose -f docker-compose.blue.yml down

# Rename green to blue
mv docker-compose.green.yml docker-compose.yml
```

## Security Checklist

- [ ] All secrets in environment variables
- [ ] Database encrypted at rest
- [ ] HTTPS/TLS configured
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection enabled
- [ ] Regular security updates

## Troubleshooting

### High Database Load

```sql
-- Find slow queries
SELECT query, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC;

-- Add missing indexes
CREATE INDEX idx_name ON table(column);
```

### API Memory Leak

```bash
# Monitor memory
node --inspect app.js

# Use Chrome DevTools
chrome://inspect
```

### Scraper Issues

```bash
# Check scraper logs
docker logs soleintel-scraper

# Restart scraper service
docker-compose restart scraper
```

---

For more help, check [docs/](../docs/) or open an [issue](https://github.com/soleintel/soleintel/issues).
