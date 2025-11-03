# 🚀 Quick Setup Guide - Get Running in 10 Minutes

## Step 1: Install Missing Dependencies (2 minutes)

```bash
cd frontend

# Install video upload dependencies
npm install uuid @aws-sdk/client-s3

# Install TypeScript types
npm install --save-dev @types/uuid
```

## Step 2: Setup Environment Variables (3 minutes)

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add your keys
# Minimum required for video features:
# - JWT_SECRET (any random string for now)
# - NEXT_PUBLIC_URL (http://localhost:3000)
```

**Quick Start Environment:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_LTt2zFdkgs1N@ep-still-glitter-agaesk7h-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="development-secret-key-change-in-production"
NEXT_PUBLIC_URL="http://localhost:3000"
```

## Step 3: Create Upload Directory (1 minute)

```bash
# Create local upload directory for development
mkdir -p public/uploads/videos
```

## Step 4: Run Database Migrations (2 minutes)

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (your videos field already exists!)
npx prisma db push
```

## Step 5: Start Development Server (1 minute)

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 6: Test Video Features (2 minutes)

### Test Video Recording:
1. Go to: http://localhost:3000/dashboard/student/projects/new
2. Click "Record Now" tab
3. Allow camera/microphone permissions
4. Record a test video
5. Click "Use This Video"

### Test Video Upload:
1. Same page, click "Upload Video" tab
2. Drag & drop a video file or click to browse
3. Upload completes

---

## ✅ You're Done!

All critical features are now working:
- ✅ Video recording in browser
- ✅ Video file upload
- ✅ Video storage (local for dev)
- ✅ Verification badges ready
- ✅ Cost calculator ready

---

## 🎯 Next: Integrate Components

Follow **IMPLEMENTATION_GUIDE.md** for detailed integration steps.

### Quick Integration Checklist:

**Week 1 Priority:**
- [ ] Add `ProjectVideoStep` to project creation flow
- [ ] Add `CandidateVideoSection` to recruiter profile view
- [ ] Add `SavingsCalculator` to pricing page

**Integration is simple - just import and use:**

```typescript
// Example: Add video to project creation
import { ProjectVideoStep } from '@/components/projects/ProjectVideoStep'

// In your multi-step form:
{step === 'video' && (
  <ProjectVideoStep
    onVideoAdded={(url) => handleVideoAdded(url)}
    onSkip={() => setStep('next')}
  />
)}
```

---

## 🐛 Troubleshooting

### Video upload fails?
**Solution:** Check that `public/uploads/videos` directory exists.

```bash
mkdir -p public/uploads/videos
```

### Camera permissions denied?
**Solution:** Use HTTPS in production, or allow localhost in browser settings.

### TypeScript errors?
**Solution:** Restart TypeScript server in your IDE.

```bash
# VS Code: Cmd/Ctrl + Shift + P > "Restart TS Server"
```

---

## 🚀 Production Setup

When ready for production:

1. **Setup Cloud Storage:**
   - Recommended: Cloudflare R2 (cheaper than S3)
   - Or: AWS S3
   - Update `.env.local` with credentials

2. **Update API Route:**
   - Edit `/frontend/app/api/upload/video/route.ts`
   - Uncomment cloud storage code (lines 31-67)
   - Remove local file saving code

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables in Vercel:**
   - Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

---

## 📊 Test Checklist

After setup, verify these work:

- [ ] Video recording in browser
- [ ] Video upload from file
- [ ] Video preview plays
- [ ] Project creation with video succeeds
- [ ] Verification badges display
- [ ] Cost calculator calculates correctly
- [ ] Trust score shows on profiles

---

## 🎉 Success!

You now have all critical features running locally.

**Next Steps:**
1. Follow IMPLEMENTATION_GUIDE.md for component integration
2. Test the full workflow
3. Deploy to staging
4. Launch! 🚀
