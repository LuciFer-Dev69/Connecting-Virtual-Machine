# Chakra View - Advanced Red/Blue Team CTF Platform

Chakra View is a state-of-the-art cybersecurity training platform designed to simulate real-world Red Team (offensive) and Blue Team (defensive) scenarios. It features an integrated "PwnBox" (Attacker VM), vulnerable services, and an **interactive, self-hosted AI opponent** powered by Meta's Llama or Google's Gemma models.

---

## 🚀 Quick Start Guide (a-z)

### 1. Prerequisites
Before you begin, ensure you have the following installed on your host machine:
- **Docker & Docker Compose**: [Get Docker](https://docs.docker.com/get-docker/)
- **Ollama**: [Get Ollama](https://ollama.com/) (Required for AI labs)
- **Git**: [Get Git](https://git-scm.com/downloads)

---

## 🧠 AI System Setup (Ollama)

This platform uses a **real LLM** to power the Prompt Injection labs. Follow these steps exactly:

1.  **Install Ollama**: Run the installer you downloaded from [ollama.com](https://ollama.com).
2.  **Pull the Model**: Open your terminal (PowerShell or Bash) and run:
    ```bash
    ollama pull gemma3:4b
    ```
3.  **Cross-Origin Configuration (IMPORTANT)**: If you face connection issues from Docker to Ollama, ensure Ollama allows cross-origin requests. 
    - On Windows, set the environment variable `OLLAMA_ORIGINS` to `*` and restart Ollama.

---

## 📦 Docker Operations

This project is fully containerized. Here are the essential commands you need:

### 🚀 Initial Setup
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine.git
    cd Connecting-Virtual-Machine
    ```
2.  **Verify Environment**:
    Check `Backend/.env` to ensure it targets your Ollama instance:
    ```ini
    OLLAMA_URL=http://host.docker.internal:11434/api/generate
    AI_MODEL=gemma3:4b
    ```
3.  **Build and Start**:
    ```bash
    docker-compose up --build -d
    ```

### 🛠️ Common Docker Commands
- **Stop the Platform**: `docker-compose down`
- **View Logs**: `docker-compose logs -f` (Use `-f backend` or `-f frontend` to target specific services)
- **Hard Reset**: `docker-compose down -v --rmi all` (Clears everything, including db volumes and images)
- **Check Status**: `docker ps`

---

## 🗄️ Database Initialization

After the containers are healthy, you **MUST** run the following to populate the challenges:

```bash
docker exec -it chakra_backend python init_db.py
```

This script:
1.  Creates all necessary tables.
2.  Seeds the Red Team roadmap with labs (Host Discovery, Web Recon, etc.).
3.  Creates the default admin account.

---

## 🔑 Access Information

| Service | URL / Access | Credentials |
| :--- | :--- | :--- |
| **Web Dashboard** | `http://localhost:3000` | `admin@chakra.com` / `Admin@1234` |
| **PwnBox Terminal** | Built-in Tab | `chakra` / `user` |
| **API Backend** | `http://localhost:5000` | N/A |
| **MySQL DB** | Port `3306` | `user` / `userpassword` |

---

## 🛠️ Troubleshooting

- **PwnBox Terminal "nmap not found"**: 
  - If the terminal loads but `nmap` is missing, try: `docker-compose build --no-cache pwnbox && docker-compose up -d pwnbox`
- **AI Assistant unresponsive**:
  - Ensure Ollama is running on your host (`ollama list` should show the model).
  - Verify `host.docker.internal` is resolving inside the container.
- **Database Connection Refused**:
  - Wait 20 seconds for the MySQL container to fully initialize before running `init_db.py`.

---

## 🛡️ Security Warning
**THIS APPLICATION CONTAINS VULNERABLE CODE BY DESIGN.**
- It is intended for local educational use **ONLY**.
- **DO NOT** expose `localhost:3000` or `localhost:5000` to the public internet.

---

**Developed by LuciFer-Dev69**
