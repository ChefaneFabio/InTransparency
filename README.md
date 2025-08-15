# 🚀 InTransparency Platform

AI-powered academic project showcase platform that connects students and professionals through intelligent project matching and storytelling.

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Docker Desktop (optional, for databases)
- OpenAI API key

### 2. Clone & Setup
```bash
git clone <your-repo-url>
cd InTransparency

# For Windows users
deploy-local.bat

# For Mac/Linux users
chmod +x deploy-local.sh
./deploy-local.sh
```

### 3. Add Your API Keys
Edit these files with your actual keys:
- `frontend/.env.local`
- `backend/api/.env`  
- `backend/ai-service/.env`

Required:
- `OPENAI_API_KEY` (get from https://platform.openai.com/)

### 4. Start Databases (Choose One)

**Option A: Docker (Recommended)**
```bash
docker-compose up postgres redis -d
```

**Option B: Local Installation**
- Install PostgreSQL and Redis locally
- Update connection strings in .env files

### 5. Start the Platform
```bash
npm run dev
```

🎉 **Your platform is now running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001  
- AI Service: http://localhost:8000

---

## 🌐 Production Deployment

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

### Backend Services (Render)
1. Connect your GitHub repository to Render
2. The `render.yaml` file will auto-configure your services
3. Add environment variables in the Render dashboard

**Full deployment guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🏗️ Architecture

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend API**: Node.js + Express + TypeScript + PostgreSQL
- **AI Service**: Python + FastAPI + OpenAI GPT-4
- **Infrastructure**: Docker + Redis + AWS S3
- **Deployment**: Vercel (frontend) + Render (backend)

---

## 🎯 Platform Features

### For Students
- ✅ AI-powered project analysis and scoring
- ✅ Professional story generation from technical projects  
- ✅ Intelligent job matching based on skills and interests
- ✅ Resume optimization with ATS compatibility
- ✅ Career analytics and skill gap analysis
- ✅ Direct messaging with recruiters

### For Recruiters  
- ✅ Advanced candidate search with AI insights
- ✅ Project-based talent discovery
- ✅ Recruitment analytics and pipeline tracking
- ✅ Job posting with intelligent matching
- ✅ Bulk candidate assessment tools

### For Universities
- ✅ Student placement tracking and analytics
- ✅ Employer partnership management  
- ✅ Curriculum optimization based on market data
- ✅ Graduate outcome reporting
- ✅ Skills gap analysis for program improvement

---

## 📁 Project Structure

```
InTransparency/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages and layouts
│   ├── components/          # Reusable UI components  
│   └── lib/                 # Utilities and configurations
├── backend/
│   ├── api/                 # Node.js API service
│   │   ├── src/            # Controllers, routes, middleware
│   │   └── migrations/     # Database migrations
│   └── ai-service/         # Python AI microservice
│       ├── app/            # AI models and services
│       └── utils/          # Caching and utilities
├── shared/                  # Shared types and utilities
├── docs/                   # Documentation
└── deploy/                 # Deployment configurations
```

---

## 🧪 Development

### Run Individual Services
```bash
# Frontend only  
npm run dev:frontend

# Backend API only
npm run dev:api  

# AI service only
npm run dev:ai

# All services together
npm run dev
```

### Database Migrations
```bash
cd backend/api
npx knex migrate:latest
npx knex seed:run  # Optional: seed sample data
```

### Testing
```bash
# All tests
npm test

# Specific service
npm run test:frontend
npm run test:api
```

---

## 🔧 Configuration

### Environment Variables

**Frontend** (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
NEXTAUTH_SECRET=your-secret-here
```

**Backend API** (.env):
```env  
DATABASE_URL=postgresql://postgres:password@localhost:5432/intransparency
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
```

**AI Service** (.env):
```env
OPENAI_API_KEY=your-openai-key  
REDIS_URL=redis://localhost:6379
AI_SERVICE_API_KEY=your-service-key
```

---

## 📞 Support & Contributing

### Getting Help
1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup
2. Review [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database configuration  
3. Open an issue for bugs or feature requests

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🎉 Ready to Deploy?

Your InTransparency platform is production-ready! Follow the deployment guide to go live in minutes.

**Built with ❤️ for the future of career development**