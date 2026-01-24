# Chakra View - Advanced Red/Blue Team CTF Platform

Chakra View is a state-of-the-art cybersecurity training platform designed to simulate real-world Red Team (offensive) and Blue Team (defensive) scenarios. It features an integrated "PwnBox" (Attacker VM), vulnerable services, and an interactive AI opponent.

## 🚀 Key Features

*   **Red Team Labs**: Real-world exploit scenarios including Service Enumeration, Web Exploitation, and AI Prompt Injection.
*   **Blue Team Labs**: Defensive monitoring, log analysis, and threat detection modules.
*   **Integrated PwnBox**: A browser-based Kali Linux-style terminal environment for running exploits directly from the browser.
*   **AI Opponent**: A hardened AI Security Assistant that players must social engineer and exploit (Prompt Injection).
*   **Dynamic Flag System**: Automated flag validation and scoring.
*   **Role-Based Access**: Student, Operator, and Admin roles.

## 🛠️ Architecture

*   **Frontend**: React.js, Lucide Icons, Terminal-style aesthetics.
*   **Backend**: Python Flask, MySQL.
*   **PwnBox**: Dockerized Ubuntu environment with pre-installed security tools (nmap, netcat, python3, etc.).
*   **Orchestration**: Docker Compose.

---

## 📦 Installation & Setup

### 1. Prerequisites
*   Docker & Docker Compose
*   Git

### 2. Clone the Repository
```bash
git clone https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine.git
cd Connecting-Virtual-Machine
```

### 3. Environment Configuration
Create a `.env` file in the `Backend` directory.
**Note:** Do not commit your real `.env` file!

`Backend/.env` example:
```ini
# Flask Config
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_super_secret_key_here

# Database Config (Use defaults for local docker)
DB_HOST=db
DB_USER=user
DB_PASSWORD=userpassword
DB_NAME=chakraDB

# AI Challenge Config (Optional - Required for AI Labs)
# Get a free key from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Launch the Platform
Build and start all services (Database, Backend, Frontend, PwnBox):
```bash
docker-compose up --build -d
```
*Wait for a few minutes for the database to clear and initialize.*

### 5. Initialize the Database
Once the containers are running, you must initialize the database schema and challenge data:
```bash
docker exec -it chakra_backend python init_db.py
```
*This command creates the tables, creates the default admin user, and populates the challenges.*

---

## 🔑 Default Credentials

### Web Dashboard Login
*   **URL**: `http://localhost:3000`
*   **Admin Email**: `admin@chakra.com`
*   **Admin Password**: `Admin@1234`
*   **User Role**: You can register a new user for standard access.

### PwnBox (SSH/Terminal Access)
The PwnBox is accessed transparently via the web interface, but you can also SSH in directly if needed.
*   **Port**: `2222` (Mapped to 22 in container)
*   **User**: `chakra`
*   **Password**: `user`

---

## 🚩 How to Play

1.  **Login**: accessing `http://localhost:3000`.
2.  **Choose a Path**: Select **Red Team** (Attack) or **Blue Team** (Defense).
3.  **Start a Challenge**: Click on a challenge card (e.g., "Service Enumeration").
    *   **PwnBox**: Open the in-browser terminal.
    *   **Objective**: Follow the instructions to find the flag (e.g., `FLAG{...}`).
    *   **Submit**: Enter the flag in the challenge modal to get points.

### Interactive Labs
*   **AI Prompt Injection**: Go to `Attack Paths > AI Prompt Injection`. Use the terminal chat to trick the AI into revealing its secret flag.
*   **Service Enumeration**: Open PwnBox and run `nmap -p- localhost` to find hidden services on port `9091`.

---

## 🛡️ Security Warning
**THIS APPLICATION CONTAINS VULNERABLE CODE BY DESIGN.**
*   The `PwnBox` container allows execution of system commands.
*   The `Backend` has intentional vulnerabilities for educational purposes.
*   **DO NOT** deploy this on a public server without strict firewall rules and network isolation.
*   **DO NOT** use the default passwords in a production environment.

---

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---
**Developed by LuciFer-Dev69**
