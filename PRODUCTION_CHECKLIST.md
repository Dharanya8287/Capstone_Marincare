# 📋 Production Deployment Checklist

> Use this checklist before deploying to production

## ✅ Pre-Deployment

### Database Setup
- [ ] MongoDB Atlas cluster created (M0 free tier)
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0 for cloud hosting)
- [ ] Connection string tested and saved securely
- [ ] Database seeded with initial data (challenges, etc.)

### Backend Setup
- [ ] Railway or Render account created
- [ ] Service created and linked to GitHub repository
- [ ] Root directory set to `backend`
- [ ] All environment variables configured (see list below)
- [ ] Firebase service account JSON credentials added
- [ ] Health check endpoint tested (`/` returns "Server is running 🚀")

### Frontend Setup
- [ ] Vercel account created and linked to GitHub
- [ ] Project imported with root directory set to `frontend`
- [ ] All environment variables configured (see list below)
- [ ] Firebase client SDK credentials added
- [ ] Build successful (no errors or warnings)

### Environment Variables

#### Backend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000` (or 10000 for Render)
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `FRONTEND_URL` - Vercel frontend URL (no trailing slash)
- [ ] `FIREBASE_PROJECT_ID` - From Firebase service account
- [ ] `FIREBASE_CLIENT_EMAIL` - From Firebase service account
- [ ] `FIREBASE_PRIVATE_KEY` - From Firebase service account (with \n preserved)
- [ ] `LOCATION_VERIFICATION_ENABLED=true`
- [ ] `LOCATION_MAX_DISTANCE_KM=5`
- [ ] `TESTING_MODE=false`

#### Frontend Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` - Backend URL (Railway or Render)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## ✅ Security Checklist

### Secrets Management
- [ ] No secrets committed to git (check with `git log -p | grep -i "password\|secret\|key"`)
- [ ] `.env` files are in `.gitignore`
- [ ] Firebase service account JSON is NOT committed
- [ ] Environment variables are set in platform dashboards (Vercel/Railway/Render)

### API Security
- [ ] CORS configured to only allow frontend domain
- [ ] Rate limiting enabled on API routes
- [ ] Firebase Authentication required for protected endpoints
- [ ] Input validation on all API endpoints
- [ ] File upload size limits enforced

### Database Security
- [ ] MongoDB user has minimal required permissions
- [ ] Connection string uses strong password
- [ ] Database backups configured (if using M10+ tier)

---

## ✅ Testing Checklist

### Backend API Tests
- [ ] Health check endpoint responds: `GET /`
- [ ] API base URL works: `GET /api`
- [ ] Challenges endpoint: `GET /api/challenges`
- [ ] Profile endpoints require authentication
- [ ] Upload endpoint works with multipart/form-data
- [ ] Error responses are properly formatted

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] User can sign up with email/password
- [ ] User can log in with existing account
- [ ] User can view challenges list
- [ ] User can view individual challenge details
- [ ] User can join a challenge (if within location range)
- [ ] User can upload cleanup photos
- [ ] AI classification works for uploaded images
- [ ] User can view their profile
- [ ] User can view dashboard with stats
- [ ] User can earn and view achievements
- [ ] Responsive design works on mobile devices
- [ ] PWA features work (installable, offline-capable)

### Integration Tests
- [ ] Frontend can connect to backend API
- [ ] Images upload and store in MongoDB GridFS
- [ ] AI model processes images correctly
- [ ] Location verification works (if enabled)
- [ ] Firebase authentication flow works end-to-end
- [ ] User data persists across sessions

---

## ✅ Performance Checklist

### Backend Performance
- [ ] AI model loads successfully on startup
- [ ] Database queries are indexed (check MongoDB Atlas)
- [ ] API response times < 2 seconds
- [ ] No memory leaks (monitor in Railway/Render dashboard)

### Frontend Performance
- [ ] Build completes without warnings
- [ ] Images are optimized (Next.js Image component used)
- [ ] Code splitting is working (check build output)
- [ ] First Contentful Paint < 2 seconds
- [ ] Time to Interactive < 3 seconds

---

## ✅ Post-Deployment

### Monitoring Setup
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)
- [ ] Error tracking enabled (optional: Sentry)
- [ ] MongoDB Atlas alerts configured
- [ ] Railway/Render deployment notifications enabled

### Documentation
- [ ] Production URLs documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Team members have access to all platforms

### Communication
- [ ] Team notified of production URLs
- [ ] Instructor/stakeholders notified
- [ ] Demo environment ready for presentation

---

## ✅ Auto-Deploy Configuration

### Vercel (Frontend)
- [ ] Auto-deploy on push to `main` enabled (default)
- [ ] Preview deployments for PRs enabled (default)
- [ ] Build and deployment notifications configured

### Railway/Render (Backend)
- [ ] Auto-deploy on push to `main` enabled (default)
- [ ] Deployment notifications configured
- [ ] Rollback procedure documented

---

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend
**Solution:** 
- Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- Ensure URL starts with `https://` and has NO trailing slash
- Redeploy frontend after fixing

### Issue: CORS errors in browser console
**Solution:**
- Update `FRONTEND_URL` in backend to exact Vercel URL
- Must include `https://` and NO trailing slash
- Redeploy backend after updating

### Issue: MongoDB connection timeout
**Solution:**
- Check Network Access in MongoDB Atlas
- Ensure 0.0.0.0/0 is whitelisted
- Verify connection string is correct
- Check password is URL-encoded

### Issue: Firebase authentication not working
**Solution:**
- Verify all Firebase env vars are set correctly
- Check Firebase console for authorized domains
- Add Vercel domain to Firebase authorized domains

### Issue: AI model timeout on startup
**Solution:**
- Normal for free tier (cold starts)
- Wait 60-90 seconds for model to load
- Check deployment logs for progress
- If persistent, contact Railway/Render support

### Issue: Images not uploading
**Solution:**
- Check file size limits (backend default: 10MB)
- Verify GridFS is working (check MongoDB collections)
- Check backend logs for errors
- Test with smaller image first

---

## 📊 Monitoring Metrics

### What to Monitor

**Backend:**
- Uptime percentage (target: >99%)
- Response time (target: <2s)
- Error rate (target: <1%)
- Memory usage (free tier: 512MB-1GB)
- CPU usage

**Frontend:**
- Build success rate
- Deployment time
- Page load speed
- Core Web Vitals

**Database:**
- Connection count
- Query performance
- Storage usage (M0: max 512MB)
- Index usage

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ All URLs are accessible and responding
2. ✅ Users can sign up, log in, and use all features
3. ✅ No console errors in browser
4. ✅ No deployment errors in logs
5. ✅ Auto-deploy works (test with a small commit)
6. ✅ Performance is acceptable (pages load in <3s)
7. ✅ Mobile responsive design works
8. ✅ PWA features work (can install as app)

---

## 📞 Support Resources

- **Vercel Status:** https://www.vercel-status.com
- **Railway Status:** https://railway.statuspage.io
- **Render Status:** https://status.render.com
- **MongoDB Atlas Status:** https://status.cloud.mongodb.com

---

**Completed by:** _____________  
**Date:** _____________  
**Production URLs:**
- Frontend: _____________
- Backend: _____________

---

**Last Updated:** November 22, 2024  
**Version:** 1.0
