# Database Setup Guide

## Option 1: Use Render (Recommended for Production)

1. Go to https://render.com/
2. Create a new PostgreSQL database
3. Create a new Redis instance
4. Copy the connection URLs to your environment files

## Option 2: Local Development

### PostgreSQL Setup:
**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install and set password for 'postgres' user
3. Create database: `createdb intransparency`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
createdb intransparency
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb intransparency
```

### Redis Setup:
**Windows:**
1. Enable WSL2 and install Redis in Ubuntu
2. Or use Redis Cloud: https://redis.com/try-free/

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

## Option 3: Docker (Easiest for Development)

1. Install Docker Desktop
2. Run this command in your terminal:

```bash
docker-compose up -d
```

This will start both PostgreSQL and Redis locally.

## Environment Variables

Update these in your .env files:

```
# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/intransparency

# Redis
REDIS_URL=redis://localhost:6379

# Production (Render)
DATABASE_URL=postgresql://user:pass@host:5432/db_name
REDIS_URL=redis://user:pass@host:6379
```