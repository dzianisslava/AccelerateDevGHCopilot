# Deployment Guide - Meal Planner

## Development ✅ → Production 🚀

This guide covers deploying the meal planner app to production.

## Pre-Deployment Checklist

- [ ] Change all secrets in `.env` files
- [ ] Update API URLs to production domains
- [ ] Configure Google OAuth callback URLs
- [ ] Set `NODE_ENV=production`
- [ ] Test both backend and frontend thoroughly
- [ ] Set up database backups
- [ ] Enable HTTPS everywhere
- [ ] Configure error logging & monitoring

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
# Create app
heroku create meal-planner-api

# Set environment variables
heroku config:set JWT_SECRET=<random-secret>
heroku config:set SESSION_SECRET=<random-secret>
heroku config:set GOOGLE_CLIENT_ID=<production-id>
heroku config:set GOOGLE_CLIENT_SECRET=<production-secret>
heroku config:set GOOGLE_CALLBACK_URL=https://meal-planner-api.herokuapp.com/auth/google/callback
heroku config:set FRONTEND_URL=https://meal-planner.netlify.app

# Deploy
git push heroku main
```

### Option 2: AWS (EC2 + RDS)

```bash
# 1. EC2 Setup
# - Launch Ubuntu 22.04 instance
# - Install Node.js 18+
# - Install PM2 globally: npm install -g pm2

# 2. RDS Setup
# - Create PostgreSQL database
# - Update connection string in .env

# 3. Deploy
ssh -i key.pem ubuntu@your-ec2-ip
git clone <repo>
cd meal-planner/server
npm install
npm run build
pm2 start npm --name "meal-planner" -- start
pm2 startup
pm2 save

# 4. Nginx Reverse Proxy
# Configure Nginx to forward requests to PM2 app on port 5000
```

### Option 3: Docker + Any Platform

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 5000
CMD ["node", "dist/index.js"]
EOF

# Build & run
docker build -t meal-planner-api .
docker run -p 5000:5000 \
  -e JWT_SECRET=<secret> \
  -e DATABASE_URL=<db-url> \
  meal-planner-api
```

## Frontend Deployment

### Option 1: Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build

# Environment variables
# Set REACT_APP_API_URL=https://meal-planner-api.com
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Update environment variables in Vercel dashboard
```

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://meal-planner-app

# Upload
aws s3 sync build/ s3://meal-planner-app --delete

# Create CloudFront distribution
# Point to S3 bucket
```

## Database Migration

### PostgreSQL (Recommended for Production)

1. Export SQLite data:
```bash
# From development
npm run export:db
```

2. Create PostgreSQL database on cloud provider (AWS RDS, Railway, etc.)

3. Update connection string in `.env`

4. Run migrations:
```bash
npm run migrate
```

## Environment Variables

### Production .env (Server)

```env
NODE_ENV=production
PORT=5000

# Database (PostgreSQL recommended)
DATABASE_URL=postgresql://user:pass@host:5432/mealplanner

# Frontend
FRONTEND_URL=https://meal-planner.app

# Secrets (GENERATE NEW ONES)
JWT_SECRET=<generate-with: openssl rand -base64 32>
SESSION_SECRET=<generate-with: openssl rand -base64 32>

# Google OAuth (Create new project in Google Console)
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-client-secret>
GOOGLE_CALLBACK_URL=https://api.meal-planner.app/auth/google/callback
```

### Production .env (Client)

```env
REACT_APP_API_URL=https://api.meal-planner.app
```

## SSL/HTTPS Setup

### Using Let's Encrypt + Certbot

```bash
# On Ubuntu/Debian server
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d api.meal-planner.app

# Auto-renew
sudo systemctl enable certbot.timer
```

## Monitoring & Logging

### Backend Logging

Add to your Express app:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking

Add Sentry for error monitoring:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

Add NewRelic or DataDog for APM:
```javascript
require('newrelic');  // Must be first require
```

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Implement caching (Redis)
- Regular backups

### Backend
- Use load balancer (AWS ALB, Nginx)
- Horizontal scaling with PM2 cluster mode
- CDN for static assets

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Lazy load components
- Cache busting for assets

## Security Hardening

### Backend
```javascript
// Add security headers
import helmet from 'helmet';
app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// CORS whitelist
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Frontend
- Use Content Security Policy headers
- Enable HTTPS only
- Disable autocomplete for sensitive fields
- Sanitize user input

## Backup & Recovery

### Database Backups

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Upload to S3
aws s3 cp backup.sql s3://meal-planner-backups/

# Automate with cron
0 2 * * * /usr/local/bin/backup-db.sh
```

### Application Backups

```bash
# Regular git commits
# Version Docker images
# Keep release tags
```

## Performance Optimization

### API Response Caching

```javascript
// Cache meal data
app.use(cache('5 minutes'));

app.get('/api/meals', (req, res) => {
  // Cached for 5 minutes per user
});
```

### Database Indexing

```sql
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plan_items_meal_plan_id ON meal_plan_items(meal_plan_id);
```

### Image Optimization

Use CloudFront or similar CDN for images:
```javascript
const imageUrl = `https://cdn.meal-planner.app/images/${mealId}`;
```

## Rollback Procedure

```bash
# If deployment fails:

# 1. Check error logs
# 2. Verify environment variables
# 3. Check database connection
# 4. Revert to previous version
git revert HEAD
git push

# 5. Redeploy
npm run build
npm start
```

## Health Checks

Add health endpoint:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});
```

Configure monitoring to check `/health` every 30 seconds.

## Cost Estimation (Monthly)

- **Hosting (Backend)**: $5-20 (Heroku, Railway, Fly.io)
- **Database**: $5-50 (RDS, Supabase, Railway)
- **CDN**: $0-10 (Cloudflare free tier, or AWS CloudFront)
- **Email/SMS**: $0-50 (Optional, SendGrid)
- **Monitoring**: $0-29 (Sentry free tier)

**Total**: $10-100/month for small user base

## Support & Troubleshooting

Common issues:

1. **CORS errors** - Check FRONTEND_URL in backend .env
2. **OAuth redirect fails** - Verify callback URL in Google Console
3. **Database connection errors** - Check DATABASE_URL format
4. **Slow API responses** - Add database indexes and caching
5. **High memory usage** - Check for memory leaks in Node.js

For production support, consider:
- PagerDuty for alerts
- Datadog for monitoring
- Opsgenie for on-call management

---

**Ready to go live! 🚀**
