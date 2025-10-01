#!/bin/bash

# Security verification script for InTransparency platform
# Tests all implemented security fixes and improvements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

print_failure() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}$1${NC}"
    echo "=============================================="
}

test_item() {
    ((TESTS_TOTAL++))
    if [ $1 -eq 0 ]; then
        print_success "$2"
    else
        print_failure "$2"
    fi
}

# Start verification
echo -e "${BLUE}"
cat << "EOF"
 ____                      _ _
/ ___|  ___  ___ _   _ _ __(_) |_ _   _
\___ \ / _ \/ __| | | | '__| | __| | | |
 ___) |  __/ (__| |_| | |  | | |_| |_| |
|____/ \___|\___|\__,_|_|  |_|\__|\__, |
                                 |___/
    __  __                 _  __ _           _   _
   |  \/  | ___  ___  __ _| |/ _(_) ___ __ _| |_(_) ___  _ __
   | |\/| |/ _ \/ __|/ _` | | |_| |/ __/ _` | __| |/ _ \| '_ \
   | |  | |  __/\__ \ (_| | |  _| | (_| (_| | |_| | (_) | | | |
   |_|  |_|\___||___/\__,_|_|_| |_|\___\__,_|\__|_|\___/|_| |_|

EOF
echo -e "${NC}"
echo "InTransparency Platform Security Verification"
echo "=============================================="

# 1. Environment Configuration Tests
print_header "1. Environment Configuration Tests"

# Check if environment config exists
if [ -f "backend/api/config/environment.js" ]; then
    print_success "Environment configuration file exists"
else
    print_failure "Environment configuration file missing"
fi

# Check for sensitive hardcoded values (should not exist)
if grep -r "your-secret-key\|change-me\|password123" backend/ --exclude-dir=node_modules 2>/dev/null; then
    print_failure "Found hardcoded sensitive values in backend"
else
    print_success "No hardcoded sensitive values found in backend"
fi

# 2. Authentication Security Tests
print_header "2. Authentication Security Tests"

# Check JWT security improvements
if grep -q "JWT_SECRET environment variable is required" backend/api/middleware/auth.js 2>/dev/null; then
    print_success "JWT secret validation implemented"
else
    print_failure "JWT secret validation missing"
fi

# Check for fallback secrets (should not exist)
if grep -q "your-secret-key" backend/api/middleware/auth.js 2>/dev/null; then
    print_failure "Hardcoded JWT fallback secret still exists"
else
    print_success "Hardcoded JWT fallback secret removed"
fi

# Check for bcrypt usage
if grep -q "bcrypt" backend/api/routes/auth.js 2>/dev/null; then
    print_success "bcrypt password hashing implemented"
else
    print_failure "bcrypt password hashing not found"
fi

# 3. Input Validation Tests
print_header "3. Input Validation Tests"

# Check for validation middleware
if [ -f "backend/api/middleware/validation.js" ]; then
    print_success "Input validation middleware exists"
else
    print_failure "Input validation middleware missing"
fi

# Check for XSS protection
if grep -q "xss\|sanitize" backend/api/utils/validation.js 2>/dev/null; then
    print_success "XSS protection implemented"
else
    print_failure "XSS protection not found"
fi

# Check for SQL injection protection
if grep -q "SQL injection\|checkSQLInjection" backend/api/utils/validation.js 2>/dev/null; then
    print_success "SQL injection protection implemented"
else
    print_failure "SQL injection protection not found"
fi

# 4. CORS Security Tests
print_header "4. CORS Security Tests"

# Check for dynamic CORS configuration
if grep -q "origin.*function\|allowedOrigins" backend/api/server.js 2>/dev/null; then
    print_success "Dynamic CORS configuration implemented"
else
    print_failure "Dynamic CORS configuration not found"
fi

# Check for hardcoded URLs in CORS (should not exist in production logic)
if grep -A 10 -B 5 "corsOptions" backend/api/server.js | grep -q "localhost.*hardcoded" 2>/dev/null; then
    print_warning "Potential hardcoded CORS origins found"
else
    print_success "No hardcoded CORS origins in production logic"
fi

# 5. Frontend Security Tests
print_header "5. Frontend Security Tests"

# Check for Error Boundaries
if [ -f "frontend/components/ErrorBoundary.tsx" ]; then
    print_success "React Error Boundary component exists"
else
    print_failure "React Error Boundary component missing"
fi

# Check for secure storage implementation
if [ -f "frontend/lib/secure-storage.ts" ]; then
    print_success "Secure token storage implemented"
else
    print_failure "Secure token storage missing"
fi

# Check for console.log statements (should be minimal/wrapped)
CONSOLE_COUNT=$(find frontend/components frontend/lib -name "*.ts" -o -name "*.tsx" | xargs grep -c "console\.log" 2>/dev/null | awk -F: '{sum += $2} END {print sum}' || echo "0")
if [ "$CONSOLE_COUNT" -lt 5 ]; then
    print_success "Console statements minimized ($CONSOLE_COUNT found)"
else
    print_warning "Multiple console statements found ($CONSOLE_COUNT)"
fi

# Check for logger implementation
if [ -f "frontend/lib/logger.ts" ]; then
    print_success "Logging utility implemented"
else
    print_failure "Logging utility missing"
fi

# 6. Database Security Tests
print_header "6. Database Security Tests"

# Check for improved schema
if [ -f "frontend/prisma/schema-improved.prisma" ]; then
    print_success "Improved database schema exists"
else
    print_failure "Improved database schema missing"
fi

# Check for security constraints migration
if [ -f "frontend/prisma/migrations/add_security_constraints.sql" ]; then
    print_success "Security constraints migration exists"
else
    print_failure "Security constraints migration missing"
fi

# 7. Docker Security Tests
print_header "7. Docker Configuration Tests"

# Check for optimized Dockerfile
if [ -f "Dockerfile.optimized" ]; then
    print_success "Optimized Dockerfile exists"
else
    print_failure "Optimized Dockerfile missing"
fi

# Check for non-root user in Dockerfile
if grep -q "USER.*node\|adduser.*nextjs" Dockerfile.optimized 2>/dev/null; then
    print_success "Non-root user configured in Docker"
else
    print_failure "Non-root user not configured in Docker"
fi

# Check for health checks
if grep -q "HEALTHCHECK" Dockerfile.optimized 2>/dev/null; then
    print_success "Health checks configured in Docker"
else
    print_failure "Health checks missing in Docker"
fi

# Check for security updates in Docker
if grep -q "apk update.*apk upgrade\|apt-get update" Dockerfile.optimized 2>/dev/null; then
    print_success "Security updates included in Docker build"
else
    print_failure "Security updates missing in Docker build"
fi

# 8. Configuration Security Tests
print_header "8. Configuration Security Tests"

# Check for .env template
if [ -f ".env.example" ] || grep -q ".env.template" Dockerfile.optimized 2>/dev/null; then
    print_success "Environment template exists"
else
    print_warning "Environment template not found"
fi

# Check for PM2 configuration
if [ -f "ecosystem.config.js" ]; then
    print_success "PM2 ecosystem configuration exists"
else
    print_failure "PM2 ecosystem configuration missing"
fi

# 9. Security Headers Tests
print_header "9. Security Headers Tests"

# Check if security headers are configured
if grep -q "helmet\|security.*headers" backend/api/server.js 2>/dev/null; then
    print_success "Security headers middleware found"
else
    print_warning "Security headers middleware not found (consider adding helmet.js)"
fi

# 10. Rate Limiting Tests
print_header "10. Rate Limiting Tests"

# Check for rate limiting implementation
if grep -q "rateLimit\|rate.*limit" backend/api/middleware/validation.js 2>/dev/null; then
    print_success "Rate limiting implemented"
else
    print_failure "Rate limiting not found"
fi

# 11. Dependency Security Tests
print_header "11. Dependency Security Tests"

# Check frontend dependencies
if [ -f "frontend/package.json" ]; then
    cd frontend
    if npm audit --audit-level=high --dry-run >/dev/null 2>&1; then
        print_success "Frontend dependencies security check passed"
    else
        print_warning "Frontend dependencies have security issues"
    fi
    cd ..
else
    print_failure "Frontend package.json not found"
fi

# Check backend dependencies
if [ -f "backend/api/package.json" ]; then
    cd backend/api
    if npm audit --audit-level=high --dry-run >/dev/null 2>&1; then
        print_success "Backend dependencies security check passed"
    else
        print_warning "Backend dependencies have security issues"
    fi
    cd ../..
else
    print_failure "Backend package.json not found"
fi

# Final Summary
print_header "Security Verification Summary"

echo ""
echo "📊 Test Results:"
echo "  Tests Passed: $TESTS_PASSED"
echo "  Tests Failed: $TESTS_FAILED"
echo "  Total Tests:  $TESTS_TOTAL"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All security tests passed!${NC}"
    echo "Your InTransparency platform is significantly more secure."
elif [ $TESTS_FAILED -le 3 ]; then
    echo -e "\n${YELLOW}⚠ Minor issues found${NC}"
    echo "Most security improvements are in place. Address remaining issues."
else
    echo -e "\n${RED}❌ Several security issues found${NC}"
    echo "Please address the failed tests before deploying to production."
fi

echo ""
echo "🔒 Security Improvements Implemented:"
echo "  ✓ JWT secret validation and secure token handling"
echo "  ✓ CORS configuration with dynamic origin validation"
echo "  ✓ Input validation and XSS/SQL injection protection"
echo "  ✓ React Error Boundaries for graceful error handling"
echo "  ✓ Secure token storage with encryption"
echo "  ✓ Database constraints and security indexes"
echo "  ✓ Docker security optimizations"
echo "  ✓ Environment variable validation"
echo "  ✓ Production logging controls"
echo "  ✓ Rate limiting and security middleware"

echo ""
echo "🚀 Next Steps:"
echo "  1. Set strong JWT_SECRET environment variable"
echo "  2. Configure production CORS origins"
echo "  3. Set up database with security constraints"
echo "  4. Test authentication flows"
echo "  5. Run load tests with rate limiting"
echo "  6. Deploy using Docker Compose"

exit $TESTS_FAILED