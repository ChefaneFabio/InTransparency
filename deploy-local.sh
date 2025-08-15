#!/bin/bash

echo "🚀 Setting up InTransparency for local development..."

# Navigate to project root
cd "$(dirname "$0")"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend API dependencies
echo "⚙️ Installing backend API dependencies..."
cd backend/api
npm install
cd ../..

# Install AI service dependencies
echo "🤖 Installing AI service dependencies..."
cd backend/ai-service
pip install -r requirements.txt
cd ../..

# Create environment files from examples
echo "📝 Creating environment files..."
cp frontend/.env.example frontend/.env.local
cp backend/api/.env.example backend/api/.env
cp backend/ai-service/.env.example backend/ai-service/.env

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit the .env files with your actual API keys"
echo "2. Set up your database (PostgreSQL) and Redis"
echo "3. Run 'npm run dev' to start all services"
echo ""
echo "🌐 Your app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   AI Service: http://localhost:8000"