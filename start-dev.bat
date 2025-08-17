@echo off
echo 🚀 Starting InTransparency Development Servers...
echo.
echo ⚠️ Make sure you have:
echo 1. Added OpenAI API key to .env files
echo 2. PostgreSQL and Redis running (or using cloud services)
echo.

REM Start all services in parallel
echo 🎨 Starting Frontend (http://localhost:3000)...
start cmd /k "cd frontend && npm run dev"

echo ⚙️ Starting Backend API (http://localhost:3001)...
start cmd /k "cd backend\api && npm run dev"

echo 🤖 Starting AI Service (http://localhost:8000)...
start cmd /k "cd backend\ai-service && python main.py"

echo.
echo ✅ All servers starting...
echo.
echo 🌐 Access your application at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    AI Service: http://localhost:8000
echo.
echo Press Ctrl+C in each window to stop the servers.
pause