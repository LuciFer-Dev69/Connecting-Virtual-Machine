# 🚀 Chakra CTF Platform - Quick Reference

## 📍 Access URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** localhost:3306
- **PwnBox SSH:** `ssh chakra@localhost -p 2222`

## 🔐 Login Credentials

### Web Dashboard
```
Email:    admin@chakra.com
Password: Admin@1234
```

### PwnBox SSH
```
Username: chakra
Password: user
```

## 🎯 Quick Start
1. Open browser: http://localhost:3000
2. Login with admin credentials
3. Choose Red Team or Blue Team
4. Select a challenge
5. Open PwnBox terminal
6. Find and submit flags

## 🛠️ Common Commands

### Service Management
```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### Database Management
```bash
# Reinitialize database
docker exec -it chakra_backend python init_db.py

# Access MySQL
docker exec -it chakra_db mysql -u user -p
# Password: userpassword
```

### Container Access
```bash
# Backend shell
docker exec -it chakra_backend bash

# PwnBox shell
docker exec -it chakra_pwnbox bash

# Frontend shell
docker exec -it chakra_frontend sh
```

## 🎮 Example Challenges

### Service Enumeration
```bash
# In PwnBox terminal:
nmap -p- localhost
# Look for service on port 9091
```

### AI Prompt Injection
- Navigate to: Attack Paths > AI Prompt Injection
- Chat with AI to extract secret flag

## 📊 Service Ports

| Service  | Port | Purpose                    |
|----------|------|----------------------------|
| Frontend | 3000 | Web UI                     |
| Backend  | 5000 | REST API + WebSocket       |
| Database | 3306 | MySQL                      |
| PwnBox   | 2222 | SSH Access                 |
| PwnBox   | 5050 | Challenge Service          |
| PwnBox   | 9091 | Hidden Service (Challenge) |

## ⚠️ Important Notes
- This is an educational platform with intentional vulnerabilities
- Do NOT expose to public internet
- Use only in isolated/controlled environments
- Default passwords are for development only

## 🆘 Troubleshooting

### Services won't start
```bash
docker-compose down
docker-compose up --build -d
```

### Database connection issues
```bash
docker-compose restart db
docker exec -it chakra_backend python init_db.py
```

### Frontend not loading
```bash
docker-compose restart frontend
docker-compose logs -f frontend
```

### Port conflicts
```bash
# Check what's using the port
netstat -ano | findstr :3000
# Kill the process if needed
taskkill /PID <PID> /F
```

## 📚 Documentation
- Full README: `README.md`
- Docker Setup: `DOCKER_SETUP.md`
- Service Status: `SERVICE_STATUS.md`
- Architecture: `project_structure_docs.md`

---
**Status:** ✅ All Services Running
**Last Updated:** 2026-01-31 15:58 NPT
