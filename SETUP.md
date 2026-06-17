# SKYCOIN4444 - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

## Prerequisites

### System Requirements
- **Node.js:** 22.13.0 or higher
- **npm/pnpm:** Latest version
- **Git:** 2.30+
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB minimum

### Install Node.js

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
- Download from https://nodejs.org/
- Run installer and follow prompts

### Install pnpm

```bash
npm install -g pnpm

# Verify installation
pnpm --version
```

## Local Development

### 1. Clone Repository

```bash
# Clone the main repository
git clone https://github.com/skylerblue333/Skycoin-done-.git
cd skycoin4444_permanent

# Or use the ZIP file
unzip skycoin4444-complete.zip
cd skycoin4444_permanent
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# This may take 2-5 minutes depending on internet speed
```

### 3. Verify Installation

```bash
# Check Node version
node --version
# Should be v22.13.0 or higher

# Check pnpm version
pnpm --version

# List installed packages
pnpm list --depth=0
```

## Database Setup

### Option 1: Using Manus Platform (Recommended)

The Manus platform provides a managed MySQL database automatically. No setup required!

### Option 2: Local MySQL

```bash
# Install MySQL (macOS with Homebrew)
brew install mysql

# Start MySQL service
brew services start mysql

# Create database
mysql -u root -p
```

```sql
CREATE DATABASE skycoin4444;
USE skycoin4444;
```

### Option 3: Docker

```bash
# Run MySQL in Docker
docker run --name skycoin-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=skycoin4444 \
  -p 3306:3306 \
  -d mysql:8.0

# Verify connection
mysql -h 127.0.0.1 -u root -proot -e "SELECT 1"
```

### Run Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate

# Verify schema
pnpm drizzle-kit studio  # Opens visual DB editor
```

## Environment Configuration

### 1. Create .env.local

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

```env
# Database Connection
DATABASE_URL=mysql://root:password@localhost:3306/skycoin4444

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# API Configuration
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key-here
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key-here

# Application
VITE_APP_ID=your-app-id
VITE_APP_TITLE=SKYCOIN4444
VITE_APP_LOGO=https://your-logo-url.png

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id

# Node Environment
NODE_ENV=development
```

### 3. Verify Configuration

```bash
# Check if .env.local is loaded
pnpm run check-env

# Should show all required variables
```

## Running the Application

### Development Mode

```bash
# Start development server
pnpm run dev

# Output should show:
# ✓ Server running on http://localhost:3000
# ✓ Vite HMR connected
```

### Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/trpc
- **Database Studio:** http://localhost:3000/studio (if enabled)

### Development Tools

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm type-check

# Build for production
pnpm run build

# Start production server
pnpm run start
```

## Troubleshooting

### Issue: "Cannot find module 'pnpm'"

**Solution:**
```bash
npm install -g pnpm
pnpm install
```

### Issue: "Database connection failed"

**Check:**
1. MySQL is running: `mysql -u root -p -e "SELECT 1"`
2. DATABASE_URL is correct in .env.local
3. Database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Fix:**
```bash
# Recreate database
mysql -u root -p -e "DROP DATABASE skycoin4444; CREATE DATABASE skycoin4444;"

# Re-run migrations
pnpm drizzle-kit migrate
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm run dev
```

### Issue: "OAuth callback failed"

**Check:**
1. VITE_APP_ID is correct
2. OAUTH_SERVER_URL is accessible
3. Redirect URL is whitelisted in OAuth provider

### Issue: "LLM calls not working"

**Check:**
1. BUILT_IN_FORGE_API_KEY is valid
2. BUILT_IN_FORGE_API_URL is correct
3. API key has LLM permissions

### Issue: "Build fails with TypeScript errors"

**Solution:**
```bash
# Clear cache
rm -rf node_modules/.vite
pnpm install

# Run type check
pnpm type-check

# Fix errors and rebuild
pnpm run build
```

## Production Deployment

### Build for Production

```bash
# Create optimized build
pnpm run build

# Output in dist/ directory
ls -la dist/
```

### Deploy to Manus Platform

```bash
# Create checkpoint
webdev_save_checkpoint

# Click "Publish" in Management UI
# Or use CLI:
manus publish --project skycoin4444_permanent
```

### Deploy to Custom Server

```bash
# 1. Build locally
pnpm run build

# 2. Upload dist/ to server
scp -r dist/ user@server:/app/

# 3. Install production dependencies
ssh user@server "cd /app && pnpm install --prod"

# 4. Set environment variables
ssh user@server "cat > /app/.env.production << 'EOF'
DATABASE_URL=...
JWT_SECRET=...
EOF"

# 5. Start server
ssh user@server "cd /app && NODE_ENV=production pnpm run start"
```

### Using Docker

```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY dist ./dist
COPY server ./server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```bash
# Build Docker image
docker build -t skycoin4444:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  skycoin4444:latest
```

### Performance Optimization

```bash
# Enable compression
export COMPRESSION=true

# Set worker threads
export NODE_WORKER_THREADS=4

# Enable clustering
export CLUSTER_MODE=true

# Start optimized server
pnpm run start
```

## Monitoring & Logs

### View Server Logs

```bash
# Development
pnpm run dev 2>&1 | tee server.log

# Production
tail -f /var/log/skycoin4444/server.log
```

### Monitor Performance

```bash
# Check memory usage
node --inspect dist/server.js

# Open chrome://inspect in Chrome DevTools
```

### Database Monitoring

```bash
# Open Drizzle Studio
pnpm drizzle-kit studio

# Monitor queries
mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"
```

## Next Steps

1. **Explore Modules:** Visit http://localhost:3000 to explore all 7 modules
2. **Read API Docs:** Check `docs/API.md` for detailed API reference
3. **Run Tests:** Execute `pnpm test` to verify everything works
4. **Deploy:** Follow production deployment steps when ready
5. **Join Community:** Visit GitHub for issues and discussions

## Support

- **Documentation:** https://docs.skycoin4444.io
- **GitHub Issues:** https://github.com/skylerblue333/Skycoin-done-/issues
- **Email:** support@skycoin4444.io
- **Discord:** https://discord.gg/skycoin4444

---

**Happy coding! 🚀**
