# 🚀 InTransparency Deployment Guide

## Quick Start (5 Minutes)

### 1. Initial Setup
```bash
# Windows
deploy-local.bat

# Mac/Linux
chmod +x deploy-local.sh
./deploy-local.sh
```

### 2. Get Your API Keys
- **OpenAI API Key**: https://platform.openai.com/api-keys
- **GitHub**: https://github.com/settings/tokens (for deployment)

### 3. Local Development
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🌐 Production Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

2. **Configure Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add these:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
   NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.onrender.com
   NEXTAUTH_SECRET=your-secret-here
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Backend Deployment (Render)

1. **Create Account**: https://render.com/

2. **Deploy API Service:**
   - Create new "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Build Command**: `cd backend/api && npm install && npm run build`
     - **Start Command**: `cd backend/api && npm start`
     - **Environment**: Node.js

3. **Deploy AI Service:**
   - Create new "Web Service"
   - Settings:
     - **Build Command**: `cd backend/ai-service && pip install -r requirements.txt`
     - **Start Command**: `cd backend/ai-service && python main.py`
     - **Environment**: Python 3

4. **Add Environment Variables in Render:**
   ```
   DATABASE_URL=your-postgres-url
   REDIS_URL=your-redis-url
   OPENAI_API_KEY=your-openai-key
   JWT_SECRET=your-jwt-secret
   AI_SERVICE_API_KEY=your-api-key
   ```

### Database Setup (Render)

1. **PostgreSQL:**
   - Create new PostgreSQL database in Render
   - Copy the Internal/External URLs

2. **Redis:**
   - Create new Redis instance in Render
   - Copy the connection URL

---

## 🔧 Configuration Files

### render.yaml (Already Created)
Your services will auto-deploy using the `render.yaml` file in your root directory.

### Environment Variables Checklist

#### Frontend (.env.local):
- [x] `NEXT_PUBLIC_API_URL`
- [x] `NEXT_PUBLIC_AI_SERVICE_URL`
- [x] `NEXTAUTH_SECRET`

#### Backend API (.env):
- [x] `DATABASE_URL`
- [x] `REDIS_URL`
- [x] `JWT_SECRET`
- [x] `OPENAI_API_KEY`

#### AI Service (.env):
- [x] `OPENAI_API_KEY`
- [x] `DATABASE_URL`
- [x] `REDIS_URL`
- [x] `AI_SERVICE_API_KEY`

---

## 🧪 Testing Your Deployment

1. **Health Checks:**
   - Frontend: https://your-app.vercel.app/
   - API: https://your-api.onrender.com/health
   - AI Service: https://your-ai.onrender.com/health

2. **Test Core Features:**
   - User registration/login
   - Project creation
   - AI analysis
   - Job matching

---

## 🔍 Troubleshooting

### Common Issues:

**Build Failures:**
- Check Node.js version (needs 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel/Render dashboard

**Database Connection:**
- Verify DATABASE_URL format
- Check firewall settings
- Ensure database is running

**AI Service Issues:**
- Verify OpenAI API key is valid
- Check Python version (needs 3.9+)
- Ensure all Python packages are installed

**CORS Errors:**
- Update ALLOWED_ORIGINS in AI service
- Check API URLs in frontend environment

---

## 📞 Support

If you encounter issues:
1. Check the logs in Vercel/Render dashboards
2. Verify all environment variables are set
3. Test locally first with `npm run dev`

---

## 🎉 Go Live Checklist

- [ ] All services deployed successfully
- [ ] Health checks passing
- [ ] Environment variables configured
- [ ] Database connected
- [ ] AI service responding
- [ ] User registration working
- [ ] Project creation working
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

**Your InTransparency platform is ready to launch! 🚀**