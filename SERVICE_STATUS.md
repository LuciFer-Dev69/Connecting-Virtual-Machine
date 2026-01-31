# Chakra CTF Platform - Service Status Report

**Date:** 2026-01-31  
**Time:** 15:56 NPT  
**Status:** ✅ ALL SERVICES RUNNING

---

## 🎯 Assignment Overview

**Chakra View** is an advanced Red/Blue Team CTF (Capture The Flag) cybersecurity training platform featuring:

- **Red Team Labs**: Offensive security scenarios (Service Enumeration, Web Exploitation, AI Prompt Injection)
- **Blue Team Labs**: Defensive monitoring, log analysis, and threat detection
- **Integrated PwnBox**: Browser-based Kali Linux-style terminal environment
- **AI Opponent**: Hardened AI Security Assistant for social engineering challenges
- **Dynamic Flag System**: Automated flag validation and scoring

---

## 🐳 Running Services

All 4 Docker containers are successfully running:

### 1. **MySQL Database** (`chakra_db`)
- **Status:** ✅ Running
- **Port:** 3306
- **Database:** chakraDB
- **Credentials:**
  - User: `user`
  - Password: `userpassword`
  - Root Password: `rootpassword`
- **Health Check:** Passing
- **Initialization:** ✅ Completed (Tables created, challenges populated)

### 2. **Flask Backend** (`chakra_backend`)
- **Status:** ✅ Running
- **Port:** 5000
- **Technology:** Python Flask, Flask-SocketIO, Paramiko
- **Features:**
  - REST API for authentication and challenges
  - WebSocket server for real-time terminal communication
  - SSH Manager for PwnBox connections
  - AI Service integration (Gemini API)
- **Health Endpoint:** http://localhost:5000/api/health ✅ Responding

### 3. **React Frontend** (`chakra_frontend`)
- **Status:** ✅ Running
- **Port:** 3000
- **Technology:** React.js, Vite, xterm.js, Socket.IO
- **Features:**
  - Interactive dashboard
  - Challenge browser
  - Web-based terminal (xterm.js)
  - Real-time WebSocket communication
- **URL:** http://localhost:3000 ✅ Accessible

### 4. **PwnBox SSH Environment** (`chakra_pwnbox`)
- **Status:** ✅ Running
- **SSH Port:** 2222
- **Additional Ports:** 5050, 3003, 3004, 6060, 7010, 9090, 8088, 9091
- **Technology:** Ubuntu/Debian-based Docker container
- **Credentials:**
  - Username: `chakra`
  - Password: `user`
- **Features:**
  - Pre-installed security tools (nmap, netcat, python3)
  - Vulnerable services for CTF challenges
  - Isolated environment with NET_ADMIN capabilities

---

## 🔐 Default Login Credentials

### Web Dashboard
- **URL:** http://localhost:3000
- **Admin Email:** `admin@chakra.com`
- **Admin Password:** `Admin@1234`
- **Note:** Users can also register new accounts for standard access

### PwnBox SSH Access
- **Command:** `ssh chakra@localhost -p 2222`
- **Username:** `chakra`
- **Password:** `user`

---

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│                 http://localhost:3000                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Port 3000)                 │
│  • Dashboard UI                                         │
│  • xterm.js Terminal                                    │
│  • WebSocket Client                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Flask Backend (Port 5000)                    │
│  • REST API Endpoints                                   │
│  • WebSocket Server (Flask-SocketIO)                    │
│  • SSH Manager (Paramiko)                               │
│  • AI Service (Gemini)                                  │
└─────────┬──────────────────────────┬────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  MySQL Database      │   │   PwnBox Container           │
│  (Port 3306)         │   │   (SSH Port 2222)            │
│  • Users             │   │   • Ubuntu Environment       │
│  • Challenges        │   │   • Security Tools           │
│  • Submissions       │   │   • Vulnerable Services      │
└──────────────────────┘   └──────────────────────────────┘
```

---

## 🚀 How to Access the Platform

### 1. **Web Interface**
Open your browser and navigate to:
```
http://localhost:3000
```

### 2. **Login**
Use the default admin credentials:
- Email: `admin@chakra.com`
- Password: `Admin@1234`

### 3. **Start a Challenge**
1. Choose **Red Team** (Attack) or **Blue Team** (Defense)
2. Click on a challenge card
3. Open the in-browser terminal (PwnBox)
4. Follow instructions to find flags
5. Submit flags to earn points

### 4. **Example Challenges**

#### Service Enumeration
```bash
# Open PwnBox terminal and run:
nmap -p- localhost
# Find hidden service on port 9091
```

#### AI Prompt Injection
- Navigate to Attack Paths > AI Prompt Injection
- Use the terminal chat to trick the AI
- Extract the secret flag

---

## 🛠️ Management Commands

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f pwnbox
```

### Check Service Status
```bash
docker-compose ps
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all
docker-compose up --build -d

# Rebuild specific service
docker-compose up -d --build backend
```

### Access Container Shell
```bash
# Backend
docker exec -it chakra_backend bash

# PwnBox
docker exec -it chakra_pwnbox bash

# Database
docker exec -it chakra_db mysql -u user -p
```

---

## 📁 Project Structure

```
Chakra/
├── Backend/                    # Flask API & WebSocket Server
│   ├── app.py                 # Main application
│   ├── init_db.py             # Database initialization
│   ├── ssh_manager.py         # SSH client logic
│   ├── ai_service.py          # AI integration
│   ├── .env                   # Environment variables ✅
│   ├── requirements.txt       # Python dependencies
│   └── routes/                # API route modules
│
├── Frontend/                   # React.js SPA
│   ├── src/
│   │   ├── App.jsx            # Main router
│   │   ├── components/        # Reusable components
│   │   │   └── WebTerminal.jsx # xterm.js wrapper
│   │   └── pages/             # Page views
│   └── Dockerfile
│
├── vulnerable-apps/            # CTF challenge applications
├── docker-compose.yml          # Service orchestration
├── README.md                   # Setup instructions
└── SERVICE_STATUS.md          # This file

```

---

## ⚠️ Security Warnings

**THIS APPLICATION CONTAINS VULNERABLE CODE BY DESIGN**

- The PwnBox container allows execution of system commands
- The Backend has intentional vulnerabilities for educational purposes
- **DO NOT** deploy this on a public server without strict firewall rules
- **DO NOT** use default passwords in production
- This is for educational and training purposes only

---

## 🎓 Educational Features

### Red Team Skills
- Network reconnaissance (nmap, netcat)
- Web application exploitation
- AI prompt injection
- Service enumeration
- Flag hunting

### Blue Team Skills
- Log analysis
- Threat detection
- Defensive monitoring
- Security incident response

---

## 📞 Support & Documentation

- **Main README:** `README.md`
- **Docker Setup Guide:** `DOCKER_SETUP.md`
- **Project Architecture:** `project_structure_docs.md`
- **GitHub Repository:** https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine

---

## ✅ Verification Checklist

- [x] Docker Desktop installed and running
- [x] All 4 containers built successfully
- [x] All 4 containers running
- [x] Database initialized with schema
- [x] Challenges populated in database
- [x] Frontend accessible at http://localhost:3000
- [x] Backend API responding at http://localhost:5000
- [x] PwnBox SSH service running on port 2222
- [x] Environment variables configured (.env file created)

---

## 🎉 Status: READY FOR USE

All services are running successfully. You can now access the Chakra CTF Platform at:

**http://localhost:3000**

Login with:
- Email: `admin@chakra.com`
- Password: `Admin@1234`

Happy Hacking! 🚀
