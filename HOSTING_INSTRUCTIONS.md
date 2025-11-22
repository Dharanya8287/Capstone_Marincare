# 🚀 WaveGuard Hosting Instructions

> **Simple, Clean, Production-Ready Deployment Guide**

## 📋 Quick Overview

**Architecture:**
- Frontend (Next.js 15) → **Vercel** (Best for Next.js, Free tier)
- Backend (Node.js/Express) → **Railway** or **Render** (Free tier available)
- Database → **MongoDB Atlas** (Free M0 cluster, 512MB)
- Authentication → **Firebase** (Already configured)

**Estimated Time:** 30-45 minutes  
**Cost:** $0 (using free tiers)

---

## 🎯 Deployment Strategy

### Development Environment
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Works exactly as before - **no changes needed**

### Production Environment
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app` or `https://your-app.onrender.com`
- Database: MongoDB Atlas cloud cluster

---

## ✅ Prerequisites Checklist

Before you start, make sure you have:

- [x] GitHub repository access
- [ ] Vercel account (sign up with GitHub at [vercel.com](https://vercel.com))
- [ ] Railway account ([railway.app](https://railway.app)) OR Render account ([render.com](https://render.com))
- [ ] MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- [ ] Firebase project credentials (you already have this)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Click **"Create"** → **"Shared"** (Free M0 cluster)
4. Choose:
   - Cloud Provider: **AWS**
   - Region: **US East (N. Virginia)** or closest to you
   - Cluster Name: **waveguard-cluster**
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.2 Configure Database Access

**Create Database User:**
1. Go to **Security → Database Access**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `waveguard-admin`
5. Password: Click **"Autogenerate Secure Password"** → **Copy and save it!**
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

**Allow Network Access:**
1. Go to **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Railway/Render/Vercel to connect
4. Click **"Confirm"**

### 1.3 Get Connection String

1. Go to **Database → Connect**
2. Click **"Connect your application"**
3. Driver: **Node.js**
4. Copy the connection string:
   ```
   mongodb+srv://waveguard-admin:<password>@waveguard-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Important:** Replace `<password>` with the password you copied earlier
6. Add database name: Change to:
   ```
   mongodb+srv://waveguard-admin:<password>@waveguard-cluster.xxxxx.mongodb.net/waveguard?retryWrites=true&w=majority
   ```

✅ **Save this connection string** - you'll need it for backend deployment

---

## 🔧 Step 2: Deploy Backend (Railway or Render)

### Option A: Railway (Recommended - Simpler)

#### 2.1 Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Select your repository: **Mohamed495104/Capstone-WaveGuard-G1**
6. Railway will detect it's a Node.js project

#### 2.2 Configure Root Directory

1. After project is created, click on the service
2. Go to **Settings**
3. Find **"Root Directory"**
4. Set it to: `backend`
5. Click **"Save"**

#### 2.3 Add Environment Variables

1. Go to **Variables** tab
2. Click **"New Variable"** and add each of these:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://waveguard-admin:<your-password>@waveguard-cluster.xxxxx.mongodb.net/waveguard?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend.vercel.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

**Important Notes:**
- For `FRONTEND_URL`, use `https://waveguard.vercel.app` (we'll get the exact URL in Step 3)
- For Firebase variables, get them from your Firebase service account JSON
- For `FIREBASE_PRIVATE_KEY`, make sure to keep the `\n` newline characters

#### 2.4 Deploy

1. Railway will automatically deploy after you save variables
2. Go to **Settings** → **Networking** → **Generate Domain**
3. Copy your backend URL: `https://your-app.railway.app`

✅ **Save this URL** - you'll need it for frontend deployment

---

### Option B: Render (Alternative to Railway)

#### 2.1 Create Web Service

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your repository: **Mohamed495104/Capstone-WaveGuard-G1**

#### 2.2 Configure Service

- **Name:** `waveguard-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** **Free**

#### 2.3 Add Environment Variables

Click **"Advanced"** → Add Environment Variables (same as Railway above)

#### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://waveguard-backend.onrender.com`

✅ **Save this URL** - you'll need it for frontend deployment

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Import Project

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository: **Mohamed495104/Capstone-WaveGuard-G1**

### 3.2 Configure Project

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Get Firebase values from:**
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Copy your frontend URL: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

### For Railway:
1. Go to your Railway project → **Variables**
2. Update `FRONTEND_URL` to your actual Vercel URL: `https://your-app.vercel.app`
3. Railway will auto-redeploy

### For Render:
1. Go to your Render service → **Environment**
2. Update `FRONTEND_URL` to your actual Vercel URL
3. Click **"Save Changes"** (triggers redeploy)

---

## 🌱 Step 5: Seed Database (One-time)

After backend is deployed, seed your database with initial data:

### Option 1: Use Railway Shell

1. Go to Railway project
2. Click on your service
3. Go to **"Shell"** tab
4. Run:
   ```bash
   npm run seed
   ```

### Option 2: Locally with Production Database

```bash
cd backend
# Temporarily update .env with production MONGO_URI
npm run seed
# Revert .env to local development
```

---

## ✅ Step 6: Verify Deployment

### Test Checklist

Visit your frontend URL and test:

- [ ] **Homepage loads** - Should see landing page
- [ ] **Login works** - Firebase authentication
- [ ] **View challenges** - Data from MongoDB
- [ ] **Upload cleanup photo** - Tests backend API + AI
- [ ] **View profile** - User data persistence
- [ ] **Dashboard shows stats** - Data aggregation working

### Backend Health Check

Visit: `https://your-backend.railway.app/`  
Should see: `"Server is running 🚀"`

---

## 📝 Production Environment Variables Summary

### Frontend (.env in Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FIREBASE_API_KEY=<from Firebase Console>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<from Firebase Console>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<from Firebase Console>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<from Firebase Console>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<from Firebase Console>
NEXT_PUBLIC_FIREBASE_APP_ID=<from Firebase Console>
```

### Backend (.env in Railway/Render)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://waveguard-admin:<password>@cluster.mongodb.net/waveguard
FRONTEND_URL=https://your-app.vercel.app
FIREBASE_PROJECT_ID=<from service account JSON>
FIREBASE_CLIENT_EMAIL=<from service account JSON>
FIREBASE_PRIVATE_KEY=<from service account JSON>
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

---

## 🔄 Future Deployments (Auto-Deploy)

### After Initial Setup

**Vercel (Frontend):**
- ✅ Automatically deploys when you push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ No manual action needed

**Railway/Render (Backend):**
- ✅ Automatically deploys when you push to `main` branch
- ✅ No manual action needed

### Development Workflow

1. Work locally as usual:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. When ready to deploy:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```

3. Both frontend and backend will auto-deploy! 🎉

---

## 🐛 Troubleshooting

### Frontend can't connect to Backend

**Check:**
- Is `NEXT_PUBLIC_API_URL` correct in Vercel?
- Does it start with `https://`?
- Try redeploying frontend

### Backend crashes on startup

**Check:**
- MongoDB connection string is correct
- Password in MONGO_URI is URL-encoded (no special characters)
- All environment variables are set
- Check deployment logs in Railway/Render

### AI Model loading timeout

**Solution:**
- Railway/Render free tier might be slow on first load
- Model loads into memory on startup (can take 30-60 seconds)
- If timeout occurs, the backend will restart automatically
- Wait a few minutes and try again

### Database connection fails

**Check:**
- Network Access in MongoDB Atlas allows 0.0.0.0/0
- Database user has correct permissions
- Connection string has correct password
- Database name is included in connection string

### CORS errors

**Check:**
- `FRONTEND_URL` in backend matches exact Vercel URL
- Includes `https://` and NO trailing slash
- Redeploy backend after updating

---

## 💰 Cost Breakdown (Free Tier)

| Service | Plan | Monthly Cost | Limits |
|---------|------|--------------|--------|
| Vercel | Hobby | **$0** | 100GB bandwidth, unlimited sites |
| Railway | Trial | **$0** | $5 credit (covers ~1 month) |
| Render | Free | **$0** | 750 hours/month (sleeps after 15min inactivity) |
| MongoDB Atlas | M0 | **$0** | 512MB storage |
| Firebase | Spark | **$0** | 50k monthly active users |

**Total: $0/month for development and testing**

---

## 🚀 Scaling to Production (Future)

When you're ready to scale:

### Upgrade Path

1. **Vercel Pro** ($20/month)
   - Unlimited bandwidth
   - Advanced analytics
   - Better performance

2. **Railway Developer** ($5-20/month)
   - Always-on (no cold starts)
   - Auto-scaling
   - More resources

3. **MongoDB Atlas M10** ($57/month)
   - 10GB storage
   - Automated backups
   - Better performance

---

## 📞 Quick Reference

### URLs to Keep

After deployment, save these:

- **Frontend:** `https://__________.vercel.app`
- **Backend:** `https://__________.railway.app` or `https://__________.onrender.com`
- **MongoDB:** Dashboard at `https://cloud.mongodb.com`
- **Firebase:** `https://console.firebase.google.com`
- **Vercel Dashboard:** `https://vercel.com/dashboard`
- **Railway Dashboard:** `https://railway.app/dashboard`

### Important Files

- `frontend/.env.example` - Template for frontend environment variables
- `backend/.env.example` - Template for backend environment variables
- `frontend/vercel.json` - Vercel configuration (already created)
- `backend/railway.json` - Railway configuration (already created)
- `backend/render.yaml` - Render configuration (already created)

---

## ✨ Summary

**You now have:**

1. ✅ **Development environment** - Works exactly as before on localhost
2. ✅ **Production environment** - Fully deployed and accessible online
3. ✅ **Auto-deploy** - Push to main = automatic deployment
4. ✅ **Free hosting** - $0 cost for development phase
5. ✅ **Scalable** - Easy to upgrade when needed

**Next steps:**

1. Test all features in production
2. Share the Vercel URL with your team/instructor
3. Continue developing locally
4. When ready, push to main to deploy changes

---

**Need Help?** 

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

**Last Updated:** November 22, 2024  
**Status:** Production Ready ✅
