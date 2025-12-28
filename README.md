# 🛡️ CTF Platform

A professional, containerized Capture The Flag (CTF) platform designed for security enthusiasts. This project features a React-based frontend, a Flask-powered backend, and a dedicated PwnBox environment for hands-on security challenges.

---

## ✨ Key Features

- **💻 Xterm-powered Web Terminal**: Seamless SSH access to challenge environments directly from your browser.
- **🤖 AI-Powered Assistance**: Integrated Gemini AI provides intelligent hints and deep-dives into challenge concepts.
- **🐳 Containerized Architecture**: Fully Dockerized ecosystem ensures consistent "it works on my machine" development and deployment.
- **⚙️ Automated Challenge Management**: Streamlined Python scripts for initializing and scaling challenge categories.
- **⚔️ Hardened PwnBox**: A pre-configured, isolated environment (`chakra_pwnbox`) for mastering exploitation techniques.

---

## 🛠️ Technical Ecosystem

### Frontend
- **React.js**: Modern, responsive UI with state management.
- **Xterm.js**: High-performance terminal emulator.
- **Socket.io-client**: Real-time communication for the web terminal.

### Backend
- **Flask (Python)**: Robust REST API handling authentication and challenge logic.
- **Gevent/Socket.IO**: Asynchronous handling of concurrent terminal sessions.
- **Paramiko**: Secure SSH bridge for challenge interaction.
- **Google Generative AI**: Powering the intelligent hint system.

### Infrastructure
- **MySQL 8.0**: Reliable persistence for user data and discovery.
- **Docker & Docker Compose**: Orchestration of the entire microservices stack.

---

## 📦 Project Structure

```text
├── Backend/                 # Flask API, SSH Manager, AI Services
├── Frontend/                # React Application (Source and Assets)
├── docker-compose.yml       # Docker orchestration configuration
├── DOCKER_SETUP.md          # Detailed Docker instructions
└── README.md                # Project overview and quick start
```

---

## 🚀 Quick Start (Docker)

Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### 1. Configure Environment
```bash
cd Backend
cp .env.example .env
# 💡 IMPORTANT: Edit .env and add your GEMINI_API_KEY
```

### 2. Launch the Platform
```bash
docker-compose up --build -d
```

### 3. Initialize Database
```bash
docker exec -it chakra_backend python init_db.py
```

### 4. Access the Application
- **🌐 Frontend**: `http://localhost:3000`
- **🔌 API Documentation**: `http://localhost:5000/api/health`
- **🐚 Direct SSH PwnBox**: `ssh chakra@localhost -p 2222` (Password: `user`)

---

## 🔒 Security Notice

This platform is designed for **educational purposes**. Ensure challenge environments are properly isolated when deploying to public networks. The integration of Gemini AI requires a valid API key, which should be handled securely via environment variables and never committed to version control.

## 📄 License

This project is intended for educational purposes in security and CTF competitions.
