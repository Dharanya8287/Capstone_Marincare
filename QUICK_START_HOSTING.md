# 🚀 Quick Start - Deploy WaveGuard in 30 Minutes

> **Goal:** Get WaveGuard deployed to production with zero cost

## 📍 You Are Here

This guide will take you from **nothing** to **fully deployed app** in ~30 minutes.

---

## 🎯 What You'll Deploy

- **Frontend** → Vercel (auto-deploys from GitHub)
- **Backend** → Railway (auto-deploys from GitHub)
- **Database** → MongoDB Atlas (free cloud database)

**Cost:** $0 (all using free tiers)

---

## ⚡ 3-Step Process

### Step 1: Setup Database (10 min)
[Follow → HOSTING_INSTRUCTIONS.md Step 1](#)

Quick version:
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string

**Output:** MongoDB connection string

---

### Step 2: Deploy Backend (10 min)
[Follow → HOSTING_INSTRUCTIONS.md Step 2](#)

Quick version:
1. Sign up at [Railway.app](https://railway.app)
2. Import GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Generate public URL

**Output:** Backend URL (e.g., `https://waveguard-backend.railway.app`)

---

### Step 3: Deploy Frontend (10 min)
[Follow → HOSTING_INSTRUCTIONS.md Step 3](#)

Quick version:
1. Sign up at [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

**Output:** Frontend URL (e.g., `https://waveguard.vercel.app`)

---

## ✅ Success!

Your app is now live at: `https://your-app.vercel.app`

**Next:**
- Test all features
- Share URL with team
- Push to main branch = auto-deploy

---

## 🆘 Need Help?

**Full Guide:** [HOSTING_INSTRUCTIONS.md](./HOSTING_INSTRUCTIONS.md)  
**Checklist:** [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)  
**Troubleshooting:** See HOSTING_INSTRUCTIONS.md

---

## 📋 What You Need

Before starting, have these ready:

- [ ] GitHub account (you have this)
- [ ] Firebase project credentials (you have this)
- [ ] 30 minutes of time
- [ ] All accounts are free (no credit card required)

---

## 🔄 After Deployment

**Development stays the same:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

**Deploying changes:**
```bash
git push origin main
# Both frontend and backend auto-deploy! 🎉
```

---

**Ready?** → Start with [HOSTING_INSTRUCTIONS.md](./HOSTING_INSTRUCTIONS.md)
