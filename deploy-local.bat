@echo off
echo 🚀 Setting up InTransparency for local development...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 🎨 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Install backend API dependencies
echo ⚙️ Installing backend API dependencies...
cd backend\api
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend API dependencies
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Python is not installed. Please install Python 3.9+ from https://python.org/
    echo You can skip this for now and install Python later.
) else (
    REM Install AI service dependencies
    echo 🤖 Installing AI service dependencies...
    cd backend\ai-service
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ⚠️ Failed to install Python dependencies. Please check your Python installation.
    )
    cd ..\..
)

REM Create environment files from examples
echo 📝 Creating environment files...
if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local
    echo ✅ Created frontend\.env.local
) else (
    echo ✅ frontend\.env.local already exists
)

if not exist backend\api\.env (
    copy backend\api\.env.example backend\api\.env
    echo ✅ Created backend\api\.env
) else (
    echo ✅ backend\api\.env already exists
)

if not exist backend\ai-service\.env (
    copy backend\ai-service\.env.example backend\ai-service\.env
    echo ✅ Created backend\ai-service\.env
) else (
    echo ✅ backend\ai-service\.env already exists
)

echo.
echo ✅ Setup complete!
echo.
echo 🔑 IMPORTANT: Add your OpenAI API key to these files:
echo    - frontend\.env.local
echo    - backend\api\.env
echo    - backend\ai-service\.env
echo.
echo 📊 Next steps:
echo 1. Get OpenAI API key from: https://platform.openai.com/api-keys
echo 2. Edit the .env files with your API key
echo 3. Start databases: docker-compose up postgres redis -d
echo 4. Run: npm run dev
echo.
echo 🌐 Your app will be available at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    AI Service: http://localhost:8000

pause