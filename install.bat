@echo off
REM ==============================================
REM InTransparency - Windows Setup Script
REM ==============================================

echo.
echo ============================================
echo   InTransparency Quick Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

REM Change to frontend directory
cd frontend

echo Step 1: Installing dependencies...
echo.

REM Install main dependencies
call npm install

echo.
echo Step 2: Installing video upload packages...
call npm install uuid @aws-sdk/client-s3
call npm install --save-dev @types/uuid

echo.
echo Step 3: Setting up environment...

REM Copy environment template if it doesn't exist
if not exist .env.local (
    if exist .env.local.example (
        copy .env.local.example .env.local
        echo [OK] Created .env.local from template
        echo [IMPORTANT] Edit .env.local and add your API keys!
    ) else (
        echo [WARNING] No .env.local.example found
    )
) else (
    echo [OK] .env.local already exists
)

echo.
echo Step 4: Creating upload directories...

REM Create upload directories
if not exist public\uploads\videos mkdir public\uploads\videos
if not exist public\uploads\images mkdir public\uploads\images
if not exist public\uploads\files mkdir public\uploads\files

echo [OK] Upload directories created

echo.
echo Step 5: Setting up database...

REM Generate Prisma client
call npx prisma generate

REM Push schema to database
call npx prisma db push --skip-generate

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next Steps:
echo.
echo 1. Edit .env.local with your API keys
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo Read QUICK_SETUP.md for detailed instructions
echo.
pause
