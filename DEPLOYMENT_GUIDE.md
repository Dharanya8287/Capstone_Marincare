# 🚀 WaveGuard Deployment Guide

> **Status:** Development Phase (2 weeks) - Deployment Ready  
> **Last Updated:** November 12, 2024

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Deployment Strategies](#deployment-strategies)
3. [Prerequisites](#prerequisites)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
6. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
7. [Environment Variables](#environment-variables)
8. [Production Checklist](#production-checklist)
9. [CI/CD Setup](#cicd-setup)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 📊 Overview

WaveGuard is a modern full-stack application with:
- **Frontend:** Next.js 15 (React 19) - Static & Server-Side Rendering
- **Backend:** Node.js/Express - REST API
- **Database:** MongoDB Atlas - Cloud Database
- **Storage:** GridFS (MongoDB) - Image Storage
- **Authentication:** Firebase Authentication

### Recommended Architecture

```
┌─────────────────┐
│   Users/Web     │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Vercel  │ ← Frontend (Next.js)
    │  CDN    │
    └────┬────┘
         │
    ┌────▼─────────┐
    │   Railway/   │ ← Backend (Express API)
    │   Render     │
    └────┬─────┬───┘
         │     │
    ┌────▼──┐ │
    │MongoDB│ │
    │ Atlas │ │
    └───────┘ │
         ┌────▼────┐
         │Firebase │ ← Authentication
         └─────────┘
```

---

## 🎯 Deployment Strategies

### Strategy 1: Simple & Cost-Effective (Recommended for MVP)

**Best for:** Development, testing, small-scale production

| Service | Platform | Cost | Limits |
|---------|----------|------|--------|
| Frontend | Vercel (Hobby) | **FREE** | 100GB bandwidth/month |
| Backend | Railway (Trial) → Render (Free) | **FREE** | 500 hours/month |
| Database | MongoDB Atlas (M0) | **FREE** | 512MB storage |
| Auth | Firebase (Spark) | **FREE** | 50k users |

**Total Cost:** $0/month for development

### Strategy 2: Production Ready

**Best for:** Launch, growth phase

| Service | Platform | Cost | Features |
|---------|----------|------|----------|
| Frontend | Vercel (Pro) | $20/month | Unlimited bandwidth, analytics |
| Backend | Railway (Developer) | $5-20/month | Always-on, auto-scaling |
| Database | MongoDB Atlas (M10) | $57/month | 10GB storage, auto-backup |
| Auth | Firebase (Blaze) | Pay-as-go | Unlimited users |

**Total Cost:** ~$82-97/month

### Strategy 3: Enterprise Scale

**Best for:** Large user base, high traffic

| Service | Platform | Cost | Features |
|---------|----------|------|----------|
| Frontend | Vercel (Enterprise) | Custom | SLA, dedicated support |
| Backend | AWS/GCP | Variable | Auto-scaling, load balancing |
| Database | MongoDB Atlas (M30+) | $243+/month | Sharding, multi-region |
| Storage | AWS S3 | Variable | Unlimited storage |

---

## ✅ Prerequisites

### Required Accounts
- [ ] GitHub account
- [ ] Vercel account (connect with GitHub)
- [ ] Railway or Render account
- [ ] MongoDB Atlas account
- [ ] Firebase project (already set up)

### Required Files
- [ ] Firebase service account JSON
- [ ] Environment variables documented
- [ ] Database connection strings

---

## 🎨 Frontend Deployment (Vercel)

### Why Vercel?
- ✅ Built specifically for Next.js
- ✅ Automatic deployments on git push
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Zero configuration needed

### Deployment Steps

#### 1. Prepare Frontend

```bash
cd frontend

# Test production build locally
npm run build
npm start

# Ensure no build errors
```

#### 2. Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: waveguard-frontend
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add environment variables (see below)
6. Click "Deploy"

#### 3. Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
# API URL (backend URL from Railway/Render)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel automatically provides SSL certificate

---

## 🔧 Backend Deployment (Railway/Render)

### Option A: Railway (Recommended)

#### Why Railway?
- ✅ Simple, developer-friendly
- ✅ Automatic deployments
- ✅ Built-in monitoring
- ✅ PostgreSQL/Redis add-ons available

#### Deployment Steps

1. **Install Railway CLI**

```bash
npm install -g @railway/cli
railway login
```

2. **Initialize Project**

```bash
cd backend
railway init

# Select or create a project
# Railway will detect Node.js automatically
```

3. **Add Environment Variables**

```bash
# Set variables via CLI
railway variables set PORT=5000
railway variables set MONGODB_URI="your_mongodb_atlas_uri"
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"

# Or use railway dashboard
railway open
# Go to Variables tab
```

4. **Deploy**

```bash
railway up

# Railway will:
# - Install dependencies
# - Run npm start
# - Provide a public URL
```

5. **Get Your Backend URL**

```bash
railway open
# Copy the public URL (e.g., https://waveguard-backend.railway.app)
```

### Option B: Render

#### Deployment Steps

1. Go to [render.com](https://render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** waveguard-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Click "Create Web Service"

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Choose a cloud provider & region (closest to your users)
4. Cluster name: `waveguard-cluster`

### 2. Configure Security

**Network Access:**
```
1. Go to Network Access
2. Add IP Address
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   OR add specific IPs for Railway/Render
```

**Database User:**
```
1. Go to Database Access
2. Add New Database User
3. Username: waveguard-admin
4. Password: Generate secure password
5. Role: Read and write to any database
```

### 3. Get Connection String

```
1. Go to Database → Connect
2. Choose "Connect your application"
3. Driver: Node.js
4. Copy connection string:
   mongodb+srv://waveguard-admin:<password>@waveguard-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
5. Replace <password> with your actual password
```

### 4. Seed Initial Data

```bash
cd backend

# Update .env with production MongoDB URI
MONGODB_URI="mongodb+srv://..."

# Run seed script
npm run seed

# Or manually:
node src/scripts/seedChallenges.js
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/waveguard?retryWrites=true&w=majority

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app

# Firebase Admin SDK
# Place serviceAccount.json in backend/src/config/
# Or set individual variables:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Optional: AI Model Settings
AI_MODEL_NAME=Xenova/vit-base-patch16-224
```

### Frontend (.env.local)

```env
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] All environment variables documented
- [ ] Firebase service account key secured
- [ ] MongoDB connection tested
- [ ] Build succeeds locally (frontend & backend)
- [ ] No console errors or warnings
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] API endpoints tested

### Security

- [ ] Firebase Admin SDK configured
- [ ] MongoDB user has minimal required permissions
- [ ] Secrets not committed to git
- [ ] CORS restricted to frontend domain
- [ ] Input validation on all endpoints
- [ ] File upload limits enforced
- [ ] Rate limiting active

### Performance

- [ ] Images optimized
- [ ] Database indexes created
- [ ] GridFS configured for image storage
- [ ] AI model loaded on startup
- [ ] Response times acceptable (<2s)

### Monitoring

- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] Uptime monitoring (UptimeRobot/Pingdom)
- [ ] Database metrics tracked

---

## 🔄 CI/CD Setup

### Automatic Deployments

**Vercel (Frontend):**
- Automatically deploys on push to `main` branch
- Creates preview deployments for PRs
- No additional configuration needed

**Railway (Backend):**
- Automatically deploys on push to `main` branch
- Rollback available in dashboard
- View deployment logs in real-time

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Backend tests
      - name: Backend Tests
        run: |
          cd backend
          npm install
          npm test
      
      # Frontend tests
      - name: Frontend Tests
        run: |
          cd frontend
          npm install
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deployment
        run: echo "Vercel auto-deploys on push"
      
      - name: Trigger Railway Deployment
        run: echo "Railway auto-deploys on push"
```

---

## 📊 Monitoring & Maintenance

### Uptime Monitoring

**Free Options:**
- [UptimeRobot](https://uptimerobot.com) - Free for 50 monitors
- [Pingdom](https://www.pingdom.com) - Free trial

**Setup:**
```
1. Create account
2. Add HTTP monitor
3. URL: https://your-backend.railway.app
4. Check interval: 5 minutes
5. Add alerts (email/Slack)
```

### Error Tracking

**Sentry (Recommended)**

```bash
# Install
npm install @sentry/node @sentry/browser

# Backend (server.js)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

# Frontend (app/layout.js)
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### Performance Monitoring

**MongoDB Atlas:**
- Real-time performance metrics
- Query performance insights
- Alerts for high CPU/memory

**Railway/Render:**
- CPU/Memory usage graphs
- Request logs
- Deployment history

### Backup Strategy

**MongoDB Atlas:**
```
1. Enable automated backups (M10+ tier)
2. Retention: 7 days (minimum)
3. Test restore procedure quarterly
```

**Alternative for M0 (Free Tier):**
```bash
# Manual backup script
mongodump --uri="mongodb+srv://..." --out=./backup

# Schedule with cron (weekly)
0 0 * * 0 /path/to/backup-script.sh
```

---

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors**
```javascript
// backend/src/app.js
app.use(cors({
  origin: [
    "https://your-frontend.vercel.app",
    "http://localhost:3000" // For development
  ],
  credentials: true
}));
```

**2. Environment Variables Not Loading**
- Verify in platform dashboard
- Restart service after adding variables
- Check for typos in variable names
- Ensure `NEXT_PUBLIC_` prefix for frontend vars

**3. MongoDB Connection Issues**
- Check IP whitelist in Atlas
- Verify connection string format
- Ensure password is URL-encoded
- Check database user permissions

**4. Build Failures**
- Check build logs
- Verify Node.js version (18+)
- Clear cache and rebuild
- Check for missing dependencies

---

## 📝 Deployment Timeline

### Week 1: Preparation
- [ ] Day 1-2: Set up accounts (Vercel, Railway, MongoDB Atlas)
- [ ] Day 3-4: Configure environment variables
- [ ] Day 5: Deploy to staging environment
- [ ] Day 6-7: Test all features in staging

### Week 2: Production Launch
- [ ] Day 8-9: Deploy to production
- [ ] Day 10: Monitor and fix issues
- [ ] Day 11-12: Performance optimization
- [ ] Day 13-14: Final testing and documentation

---

## 🎯 Next Steps

1. **Immediate (This Week)**
   - Set up MongoDB Atlas cluster
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Test end-to-end flow

2. **Short Term (2 Weeks)**
   - Set up monitoring
   - Configure backups
   - Add custom domain
   - Performance optimization

3. **Long Term (1 Month+)**
   - Implement CI/CD
   - Add error tracking
   - Scale infrastructure
   - Implement analytics

---

## 📞 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Firebase Console:** https://console.firebase.google.com

---

**Need Help?** Refer to the troubleshooting section or check platform-specific documentation.

**Last Updated:** November 12, 2024  
**Status:** Ready for Deployment (Development Phase)
