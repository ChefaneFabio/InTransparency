#!/bin/bash

# ==============================================
# InTransparency - Quick Setup Script
# ==============================================
# This script sets up all dependencies and configurations

set -e  # Exit on error

echo "🚀 InTransparency Setup Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==============================================
# Step 1: Check Prerequisites
# ==============================================
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version) found${NC}"

echo ""

# ==============================================
# Step 2: Install Frontend Dependencies
# ==============================================
echo -e "${BLUE}Step 2: Installing frontend dependencies...${NC}"

cd frontend

# Install main dependencies
echo "Installing main packages..."
npm install

# Install video upload dependencies
echo "Installing video upload packages..."
npm install uuid @aws-sdk/client-s3

# Install TypeScript types
echo "Installing TypeScript types..."
npm install --save-dev @types/uuid

echo -e "${GREEN}✅ All dependencies installed${NC}"
echo ""

# ==============================================
# Step 3: Setup Environment Variables
# ==============================================
echo -e "${BLUE}Step 3: Setting up environment variables...${NC}"

if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ Created .env.local from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env.local and add your API keys${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env.local.example found${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

echo ""

# ==============================================
# Step 4: Create Upload Directories
# ==============================================
echo -e "${BLUE}Step 4: Creating upload directories...${NC}"

mkdir -p public/uploads/videos
mkdir -p public/uploads/images
mkdir -p public/uploads/files

echo -e "${GREEN}✅ Upload directories created${NC}"
echo ""

# ==============================================
# Step 5: Setup Database
# ==============================================
echo -e "${BLUE}Step 5: Setting up database...${NC}"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to database..."
if npx prisma db push --skip-generate; then
    echo -e "${GREEN}✅ Database schema updated${NC}"
else
    echo -e "${YELLOW}⚠️  Database push failed. Check your DATABASE_URL in .env.local${NC}"
fi

echo ""

# ==============================================
# Step 6: Build Check
# ==============================================
echo -e "${BLUE}Step 6: Running type check...${NC}"

if npm run type-check; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript errors found. You may want to fix these before running.${NC}"
fi

echo ""

# ==============================================
# Summary
# ==============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Edit .env.local with your API keys:"
echo "   - JWT_SECRET (required)"
echo "   - STRIPE keys (for payments)"
echo "   - OPENAI_API_KEY (for AI features)"
echo ""
echo "2. Start the development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "3. Open your browser:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "4. Test video features:"
echo "   ${BLUE}http://localhost:3000/dashboard/student/projects/new${NC}"
echo ""
echo -e "${YELLOW}📖 Read QUICK_SETUP.md for detailed instructions${NC}"
echo -e "${YELLOW}📖 Read IMPLEMENTATION_GUIDE.md for integration steps${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
