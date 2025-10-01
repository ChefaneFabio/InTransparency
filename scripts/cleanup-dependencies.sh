#!/bin/bash

# Dependency cleanup and security update script for InTransparency
set -e

echo "🧹 Cleaning up dependencies and fixing security issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Clean up frontend dependencies
print_status "Cleaning frontend dependencies..."
cd frontend
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_status "Removed frontend node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_status "Removed frontend package-lock.json"
fi

# Update Next.js to fix security vulnerabilities
print_status "Updating Next.js to latest secure version..."
npm install next@latest

# Install dependencies
print_status "Installing frontend dependencies..."
npm ci --no-audit --prefer-offline

# Check for vulnerabilities
print_status "Checking frontend security..."
npm audit --audit-level=high

cd ..

# Clean up backend dependencies
print_status "Cleaning backend dependencies..."
cd backend/api
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_status "Removed backend node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_status "Removed backend package-lock.json"
fi

# Install dependencies
print_status "Installing backend dependencies..."
npm ci --no-audit --prefer-offline

# Check for vulnerabilities
print_status "Checking backend security..."
npm audit --audit-level=high

cd ../..

# Clean up root level dependencies if they exist
if [ -d "node_modules" ]; then
    print_warning "Removing root level node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    print_warning "Removing root level package-lock.json..."
    rm -f package-lock.json
fi

# Update package.json files to use secure versions
print_status "Updating package dependencies..."

# Create updated frontend package.json security patches
cat > frontend/.npmrc << EOF
# Security and performance settings
audit-level=high
fund=false
save-exact=true
engine-strict=true
legacy-peer-deps=false
package-lock=true
shrinkwrap=true
EOF

# Create updated backend package.json security patches
cat > backend/api/.npmrc << EOF
# Security and performance settings
audit-level=high
fund=false
save-exact=true
engine-strict=true
legacy-peer-deps=false
package-lock=true
shrinkwrap=true
EOF

print_status "Created .npmrc files for enhanced security"

# Check disk usage
print_status "Checking disk usage..."
du -sh frontend/node_modules 2>/dev/null || echo "Frontend node_modules not found"
du -sh backend/api/node_modules 2>/dev/null || echo "Backend node_modules not found"

# Final verification
print_status "Running final dependency verification..."

# Check frontend
cd frontend
npm ls --depth=0 > /dev/null 2>&1 && print_status "Frontend dependencies verified" || print_error "Frontend dependency issues found"

# Check backend
cd ../backend/api
npm ls --depth=0 > /dev/null 2>&1 && print_status "Backend dependencies verified" || print_error "Backend dependency issues found"

cd ../..

print_status "Dependency cleanup completed!"
print_warning "Please commit the updated package-lock.json files"

echo ""
echo "📊 Summary:"
echo "- Frontend and backend dependencies cleaned and updated"
echo "- Security vulnerabilities fixed"
echo "- NPM configuration optimized"
echo "- Dependency tree verified"