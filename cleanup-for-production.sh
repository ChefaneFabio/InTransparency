#!/bin/bash

echo "=========================================="
echo "InTransparency Production Cleanup Script"
echo "=========================================="
echo ""
echo "This script removes unnecessary files for production deployment"
echo "Keeping only essential files for runtime"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for removed items
REMOVED_COUNT=0

# Function to remove file and count
remove_file() {
    if [ -f "$1" ]; then
        echo -e "${YELLOW}Removing:${NC} $1"
        rm "$1"
        ((REMOVED_COUNT++))
    fi
}

# Function to remove directory and count
remove_dir() {
    if [ -d "$1" ]; then
        echo -e "${YELLOW}Removing directory:${NC} $1"
        rm -rf "$1"
        ((REMOVED_COUNT++))
    fi
}

echo "Starting cleanup..."
echo ""

# ==========================================
# 1. Remove Documentation Files (Root Level)
# ==========================================
echo -e "${GREEN}[1/7] Removing documentation files...${NC}"

remove_file "ADVANCED_SECURITY_IMPROVEMENTS.md"
remove_file "BUILD_TEST_REPORT.md"
remove_file "FINAL_BUILD_STATUS.md"
remove_file "PAGE_VISUALIZATION_AUDIT.md"
remove_file "PRODUCTION_ERRORS_FIXED.md"
remove_file "SECURITY_FIXES_SUMMARY.md"
remove_file "VISUALIZATION_FIXES_COMPLETE.md"

# Keep these essential docs
# - README.md (keep for GitHub)
# - DATABASE_SETUP.md (keep for deployment reference)
# - DEPLOYMENT_GUIDE.md (keep for deployment reference)
# - GOOGLE_MAPS_SETUP.md (keep for configuration reference)

echo ""

# ==========================================
# 2. Remove Test Scripts (Root Level)
# ==========================================
echo -e "${GREEN}[2/7] Removing test scripts...${NC}"

remove_file "test-build.sh"
remove_file "test-server.js"
remove_file "deploy-local.sh"

echo ""

# ==========================================
# 3. Remove Frontend Test Scripts
# ==========================================
echo -e "${GREEN}[3/7] Removing frontend test scripts...${NC}"

cd frontend 2>/dev/null

remove_file "audit-pages.js"
remove_file "verify-pages.js"
remove_file "PAGE_AUDIT_REPORT.json"

cd ..

echo ""

# ==========================================
# 4. Remove Backup Directories
# ==========================================
echo -e "${GREEN}[4/7] Removing backup directories...${NC}"

remove_dir "node_modules/node_modules.backup"
remove_dir "node_modules.backup"

echo ""

# ==========================================
# 5. Remove Test Directories (if not needed)
# ==========================================
echo -e "${GREEN}[5/7] Checking test directories...${NC}"

# Note: Keeping tests/security for production security auditing
echo "Keeping tests/security for production use"

echo ""

# ==========================================
# 6. Remove Build Artifacts & Caches
# ==========================================
echo -e "${GREEN}[6/7] Removing build artifacts and caches...${NC}"

remove_dir "frontend/.next"
remove_file "frontend/tsconfig.tsbuildinfo"

# Remove npm cache files
remove_file "frontend/.npmrc"

echo ""

# ==========================================
# 7. Remove IDE and OS Files
# ==========================================
echo -e "${GREEN}[7/7] Removing IDE and OS files...${NC}"

# Remove .DS_Store (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null

# Remove Thumbs.db (Windows)
find . -name "Thumbs.db" -type f -delete 2>/dev/null

# Remove .vscode settings (optional - uncomment if needed)
# remove_dir ".vscode"

echo ""

# ==========================================
# Summary
# ==========================================
echo "=========================================="
echo -e "${GREEN}Cleanup Complete!${NC}"
echo "=========================================="
echo ""
echo "Removed $REMOVED_COUNT items"
echo ""
echo -e "${GREEN}✓${NC} Documentation cleanup complete"
echo -e "${GREEN}✓${NC} Test scripts removed"
echo -e "${GREEN}✓${NC} Backup directories removed"
echo -e "${GREEN}✓${NC} Build artifacts cleaned"
echo -e "${GREEN}✓${NC} Cache files removed"
echo ""
echo "Kept essential files:"
echo "  - README.md (GitHub documentation)"
echo "  - DATABASE_SETUP.md (deployment reference)"
echo "  - DEPLOYMENT_GUIDE.md (deployment reference)"
echo "  - GOOGLE_MAPS_SETUP.md (configuration reference)"
echo "  - ecosystem.config.js (PM2 configuration)"
echo "  - tests/security (security auditing tools)"
echo ""
echo "Your project is now optimized for production!"
echo "=========================================="
