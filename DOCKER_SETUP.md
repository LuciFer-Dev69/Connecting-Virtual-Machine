# Chakra CTF Platform - Docker Setup Guide

## 🚀 Quick Start

This project consists of:
- **Frontend**: React application (Port 3000)
- **Backend**: Flask API (Port 5000)
- **Database**: MySQL 8.0 (Port 3306)
- **PwnBox**: SSH Challenge Environment (Port 2222)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Ports 3000, 5000, 3306, and 2222 available

## 🔧 Setup Instructions

### 1. Configure Environment Variables

Copy the example environment file:
```bash
cd Backend
copy .env.example .env
```

Edit `.env` and add your API keys if needed (especially `GEMINI_API_KEY` for AI features).

### 2. Build and Run All Services

From the project root directory:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Initialize the Database

Once the services are running, initialize the database:

```bash
# Access the backend container
docker exec -it chakra_backend bash

# Run database initialization
python init_db.py

# Create admin user (optional)
python create_admin.py

# Exit the container
exit
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL Database**: localhost:3306
- **PwnBox SSH**: `ssh chakra@localhost -p 2222` (password: `user`)

## 🐳 Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f pwnbox
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete database data)
```bash
docker-compose down -v
```

### Restart a Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
docker-compose restart pwnbox
```

### Rebuild a Specific Service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## 🔍 Troubleshooting

### Port Already in Use
If you get a port conflict error:
```bash
# Find what's using the port (example for port 3000)
netstat -ano | findstr :3000

# Kill the process using the PID from above
taskkill /PID <PID> /F
```

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
docker-compose down
docker-compose up -d --build frontend
```

### Backend Errors
```bash
# View backend logs
docker-compose logs -f backend

# Access backend container for debugging
docker exec -it chakra_backend bash
```

## 📦 Service Details

### MySQL Database
- **Container**: chakra_db
- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: chakraDB
- **User**: user
- **Password**: userpassword
- **Root Password**: rootpassword

### Flask Backend
- **Container**: chakra_backend
- **Port**: 5000
- **Hot Reload**: Enabled (code changes auto-reload)
- **Docker Socket**: Mounted for PwnBox management

### React Frontend
- **Container**: chakra_frontend
- **Port**: 3000
- **Hot Reload**: Enabled (code changes auto-reload)
- **API URL**: http://localhost:5000

### PwnBox SSH
- **Container**: chakra_pwnbox
- **Port**: 2222
- **Username**: chakra
- **Password**: user
- **Purpose**: CTF challenge environment

## 🔄 Development Workflow

1. **Make code changes** in your local files
2. **Changes auto-reload** in both frontend and backend containers
3. **View logs** to debug: `docker-compose logs -f`
4. **Test changes** in your browser

## 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

## 📝 Notes

- The frontend and backend have hot-reload enabled, so code changes will automatically reflect
- Database data persists in a Docker volume even after stopping containers
- Use `docker-compose down -v` only if you want to completely reset the database
- The PwnBox container requires NET_ADMIN capability for networking challenges

## 🆘 Need Help?

Check the logs for any service:
```bash
docker-compose logs -f [service-name]
```

Access any container:
```bash
docker exec -it [container-name] bash
```
