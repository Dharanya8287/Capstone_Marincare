#!/bin/bash

# WaveGuard Deployment Verification Script
# This script checks if all deployment prerequisites are met

echo "🔍 WaveGuard Deployment Verification"
echo "===================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "📋 Checking Backend Configuration..."
echo "-----------------------------------"

# Check if backend directory exists
if [ -d "backend" ]; then
    success "Backend directory exists"
else
    error "Backend directory not found"
fi

# Check backend dependencies
if [ -f "backend/package.json" ]; then
    success "Backend package.json exists"
    
    # Check if node_modules exists
    if [ -d "backend/node_modules" ]; then
        success "Backend dependencies installed"
    else
        warning "Backend dependencies not installed (run 'cd backend && npm install')"
    fi
else
    error "Backend package.json not found"
fi

# Check .env.example exists
if [ -f "backend/.env.example" ]; then
    success "Backend .env.example exists"
else
    error "Backend .env.example not found"
fi

# Check deployment config files
if [ -f "backend/railway.json" ]; then
    success "Railway configuration exists"
else
    warning "Railway configuration not found (backend/railway.json)"
fi

if [ -f "backend/render.yaml" ]; then
    success "Render configuration exists"
else
    warning "Render configuration not found (backend/render.yaml)"
fi

if [ -f "backend/.dockerignore" ]; then
    success "Backend .dockerignore exists"
else
    warning "Backend .dockerignore not found"
fi

echo ""
echo "📋 Checking Frontend Configuration..."
echo "------------------------------------"

# Check if frontend directory exists
if [ -d "frontend" ]; then
    success "Frontend directory exists"
else
    error "Frontend directory not found"
fi

# Check frontend dependencies
if [ -f "frontend/package.json" ]; then
    success "Frontend package.json exists"
    
    # Check if node_modules exists
    if [ -d "frontend/node_modules" ]; then
        success "Frontend dependencies installed"
    else
        warning "Frontend dependencies not installed (run 'cd frontend && npm install')"
    fi
else
    error "Frontend package.json not found"
fi

# Check .env.example exists
if [ -f "frontend/.env.example" ]; then
    success "Frontend .env.example exists"
else
    error "Frontend .env.example not found"
fi

# Check deployment config files
if [ -f "frontend/vercel.json" ]; then
    success "Vercel configuration exists"
else
    warning "Vercel configuration not found (frontend/vercel.json)"
fi

if [ -f "frontend/.dockerignore" ]; then
    success "Frontend .dockerignore exists"
else
    warning "Frontend .dockerignore not found"
fi

# Check Next.js config
if [ -f "frontend/next.config.mjs" ]; then
    success "Next.js configuration exists"
else
    error "Next.js configuration not found"
fi

echo ""
echo "📋 Checking Documentation..."
echo "----------------------------"

# Check documentation files
if [ -f "HOSTING_INSTRUCTIONS.md" ]; then
    success "HOSTING_INSTRUCTIONS.md exists"
else
    error "HOSTING_INSTRUCTIONS.md not found"
fi

if [ -f "PRODUCTION_CHECKLIST.md" ]; then
    success "PRODUCTION_CHECKLIST.md exists"
else
    warning "PRODUCTION_CHECKLIST.md not found"
fi

if [ -f "QUICK_START_HOSTING.md" ]; then
    success "QUICK_START_HOSTING.md exists"
else
    warning "QUICK_START_HOSTING.md not found"
fi

if [ -f "DEPLOYMENT_GUIDE.md" ]; then
    success "DEPLOYMENT_GUIDE.md exists"
else
    warning "DEPLOYMENT_GUIDE.md not found"
fi

echo ""
echo "📋 Checking Git Configuration..."
echo "--------------------------------"

# Check .gitignore
if [ -f ".gitignore" ]; then
    success ".gitignore exists"
    
    # Check if .env is ignored
    if grep -q "\.env" ".gitignore"; then
        success ".env files are in .gitignore"
    else
        error ".env files should be in .gitignore"
    fi
else
    error ".gitignore not found"
fi

# Check if .env files are committed
if git ls-files --error-unmatch backend/.env 2>/dev/null; then
    error "backend/.env is committed (should be ignored!)"
fi

if git ls-files --error-unmatch frontend/.env.local 2>/dev/null; then
    error "frontend/.env.local is committed (should be ignored!)"
fi

echo ""
echo "===================================="
echo "📊 Verification Summary"
echo "===================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review and fix if needed.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo ""
    echo "Please fix the errors before deploying."
    echo "See HOSTING_INSTRUCTIONS.md for help."
    exit 1
fi
