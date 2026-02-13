# Chakra View - Advanced Red/Blue Team CTF Platform

Chakra View is a state-of-the-art cybersecurity training platform designed to simulate real-world Red Team (offensive) and Blue Team (defensive) scenarios. It features an integrated "PwnBox" (Attacker VM), vulnerable services, and an **interactive, self-hosted AI opponent** powered by Meta's Llama or Google's LLM models via Ollama.

---

## 🚀 Key Features

- **PwnBox Isolation**: Each user gets a private, sandboxed Ubuntu terminal with pre-installed hacking tools (`nmap`, `gobuster`, `metasploit-framework`, etc.).
- **Dynamic Port Scaling**: PwnBox SSH instances are mapped to random high-range ports on the host to prevent conflicts and enhance security.
- **Anti-Gravity Stability Engine**: A custom backend lifecycle manager that verifies SSH readiness and performs health checks before allowing user access.
- **AI Mentorship**: Real-time AI assistance based on your command history to guide you through complex red-team phases.
- **Atomic Restarts**: "Terminate & Respawn" functionality that cleanly nukes old environments and provisions new ones in seconds.

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Docker & Docker Compose**: [Get Docker](https://docs.docker.com/get-docker/)
- **Ollama**: [Get Ollama](https://ollama.com/) (Required for AI labs)
- **Git**: [Get Git](https://git-scm.com/downloads)

### 2. Initial Setup
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine.git
    cd Connecting-Virtual-Machine
    ```
2.  **Configuration**:
    Create or verify `Backend/.env`:
    ```ini
    DB_HOST=localhost
    DB_USER=user
    DB_PASSWORD=userpassword
    DB_NAME=chakraDB
    SSH_HOST=localhost
    OLLAMA_BASE_URL=http://localhost:11434
    ```

### 3. Build and Start
Execute the following to start the platform:
```bash
docker-compose up --build -d
```

### 4. AI Model Initialization (CRITICAL STEP)
After the containers are running, you must pull the required AI models into the `chakra_ollama` container.
**Open a new terminal and run:**

1.  **Pull SOC Analyst Model:**
    ```bash
    docker exec -it chakra_ollama ollama pull qwen3:8b
    ```

2.  **Pull Prompt Injector Model:**
    ```bash
    docker exec -it chakra_ollama ollama pull gpt-oss:20b
    ```

*(Note: This uses the container's volume, so you only need to do this once.)*

### 4. Database Population
After the containers are healthy, you **MUST** run the initialization script:
```bash
docker exec -it chakra_backend python init_db.py
```

---

## 🔑 Access Information

| Service | URL / Access | Credentials |
| :--- | :--- | :--- |
| **Web Dashboard** | `http://localhost:3000` | `admin@chakra.com` / `Admin@1234` |
| **PwnBox Terminal** | Built-in Tab | Shared via API on spawn |
| **API Backend** | `http://localhost:5000` | N/A |
| **MySQL DB** | Port `3306` | `user` / `userpassword` |

---

## 🛡️ Anti-Gravity Stability Protocol

The platform implements a strict stability protocol for PwnBox instances:
1. **Wait-for-SSH**: Backend verifies TCP handshake on the new dynamic port before returning success.
2. **Atomic Respawn**: Entire container lifecycle (Stop -> Remove -> Start -> Verify) is handled as a single atomic unit.
3. **No Port 22 Fallback**: Connections are strictly routed through dynamically assigned ports to ensure scalability.

---

## 🧹 Maintenance Commands

- **Stop Everything**: `docker-compose down`
- **Global Reset**: `docker-compose down -v --rmi all`
- **Clean Users/Containers**: `python auto_cleanup.py` (Deletes all non-admin users and their containers)
- **Check Status**: `docker ps`

---

## ⚠️ Security Warning
**THIS APPLICATION CONTAINS VULNERABLE CODE BY DESIGN.**
- It is intended for local educational use **ONLY**.
- **DO NOT** expose `localhost:3000` or `localhost:5000` to the public internet.
- Ensure only trusted users have access to your Docker host.

---


---

## 🧠 AI Prompt Injection Lab
The **Prompt Injection Lab** uses a specialized model (`gpt-oss:20b`) to simulate a "Live AI" security assistant (`AstraNova`).
- **Goal**: tricked the AI into revealing the hidden flag.
- **Engine**: The backend automatically routes injection attempts to the high-fidelity model.

**Developed by LuciFer-Dev69**
