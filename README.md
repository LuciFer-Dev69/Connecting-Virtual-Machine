# Chakra View - Advanced Red/Blue Team CTF Platform

Chakra View is a state-of-the-art cybersecurity training platform designed to simulate real-world Red Team (offensive) and Blue Team (defensive) scenarios. It features an integrated "PwnBox" (Attacker VM), vulnerable services, and an **interactive, self-hosted AI opponent** powered by Meta's Llama or Google's Gemma models.

---

## 🚀 Key Features

*   **Red Team Labs**: Real-world exploit scenarios including Service Enumeration, Web Exploitation, and AI Prompt Injection.
*   **Blue Team Labs**: Defensive monitoring, log analysis, and threat detection modules.
*   **Integrated PwnBox**: A browser-based Kali Linux-style terminal environment for running exploits directly from the browser.
*   **Self-Hosted AI Opponent**: A live conversational AI (running via Ollama) that players must social engineer and exploit (Prompt Injection).
*   **Dynamic Flag System**: Automated flag validation and scoring.
*   **Role-Based Access**: Student, Operator, and Admin roles.

---

## 🧠 AI System Setup (Ollama)

This platform uses a **real LLM** (Large Language Model) to power the Prompt Injection labs. You must set up Ollama on your host machine before running the labs.

### 1. Install Ollama
Download and install Ollama from [ollama.com](https://ollama.com).

### 2. Pull the Model
Open your terminal and run the following command to download the **Gemma 3 4B** model:
```bash
ollama pull gemma3:4b
```

### 3. Verify Ollama API
The backend expects the Ollama API to be reachable. By default, the lab is configured to use `host.docker.internal` to talk to your host machine's Ollama service.

---

## 📦 Installation & Setup

### 1. Prerequisites
*   Docker & Docker Compose
*   Ollama (with `gemma3:4b` pulled)
*   Git

### 2. Clone the Repository
```bash
git clone https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine.git
cd Connecting-Virtual-Machine
```

### 3. Environment Configuration
Copy the example environment file to create your own configuration:
```bash
cp Backend/.env.example Backend/.env
```

Ensure your `Backend/.env` contains the Ollama configuration:
```ini
# AI Challenge Config (Ollama Integration)
OLLAMA_URL=http://host.docker.internal:11434/api/generate
AI_MODEL=gemma3:4b
```

### 4. Launch the Platform
Build and start all services (Database, Backend, Frontend, PwnBox):
```bash
docker-compose up --build -d
```

### 5. Initialize the Database
Once the containers are running, initialize the database schema and challenge data:
```bash
docker exec -it chakra_backend python init_db.py
```

---

## 🤖 Antigravity Deployment (For Quick Start)

If you are using the **Antigravity AI Agent**, you can automate the entire setup by giving it this single command:

> *"Deploy the Chakra platform and set up the Gemma 3 LLM. Ensure Docker is running and pull the model via Ollama."*

Antigravity will automatically check your environment, install dependencies, and launch the lab for you.

---

## 🔑 Default Credentials

### Web Dashboard Login
*   **URL**: `http://localhost:3000`
*   **Admin Email**: `admin@chakra.com`
*   **Admin Password**: `Admin@1234`

### PwnBox (Terminal Access)
*   **User**: `chakra`
*   **Password**: `user`

---

## 🛡️ Security Warning
**THIS APPLICATION CONTAINS VULNERABLE CODE BY DESIGN.**
*   The `PwnBox` container allows execution of system commands.
*   The `Backend` has intentional vulnerabilities for educational purposes.
*   **DO NOT** deploy this on a public server without strict firewall rules.

---

**Developed by LuciFer-Dev69**
