# 🛡️ Chakra CTF Platform

A comprehensive, containerized Capture The Flag (CTF) platform featuring a React frontend, Flask backend, and a dedicated PwnBox environment for security challenges.

## 🚀 Key Features

- **Xterm-powered Web Terminal**: Direct SSH access to challenge environments within your browser.
- **AI-Powered Assistance**: Integrated Gemini AI to help users with challenge hints and explanations.
- **Containerized Architecture**: Fully Dockerized setup for consistent development and deployment.
- **Automated Challenge Management**: Python scripts for initializing and updating web, pwn, and other challenge categories.
- **Secure PwnBox**: A dedicated SSH environment (`chakra_pwnbox`) for practicing exploitation techniques.

## 🛠️ Technical Stack

- **Frontend**: React.js with modern UI components.
- **Backend**: Flask (Python) with Socket.IO for real-time terminal communication.
- **Database**: MySQL 8.0 for challenge and user data persistence.
- **Orchestration**: Docker Compose for managing multi-container services.
- **Security**: Paramiko for SSH handling and environment isolation.

## 📦 Project Structure

```text
├── Backend/                 # Flask API, SSH Manager, AI Services
├── Frontend/                # React Application (Source and Assets)
├── docker-compose.yml       # Docker orchestration configuration
├── DOCKER_SETUP.md          # Detailed Docker instructions
└── README.md                # Project overview and quick start
```

## 🚥 Quick Start (Docker)

Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

1. **Configure Environment Variables**:
   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env to add your GEMINI_API_KEY
   ```

2. **Launch the Platform**:
   ```bash
   docker-compose up --build -d
   ```

3. **Initialize Database**:
   ```bash
   docker exec -it chakra_backend python init_db.py
   ```

4. **Access the Application**:
   - **Frontend**: `http://localhost:3000`
   - **API**: `http://localhost:5000`
   - **SSH PwnBox**: `ssh chakra@localhost -p 2222` (Password: `user`)

## 📄 License

This project is intended for educational purposes in security and CTF competitions.