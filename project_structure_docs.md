# CTF Platform Technical Architecture & SSH Implementation Plan

## 1. High-Level Architecture (Microservices)
The platform is composed of 4 distinct Docker containers orchestrated via `docker-compose`.

### A. Frontend Service (`chakra_frontend`)
- **Tech Stack**: React.js, Vite, TailwindCSS equivalent (Vanilla CSS variables), Socket.IO Client, xterm.js.
- **Port**: 3000 (Exposed to host).
- **Function**:
  - Renders the UI (Dashboard, Challenges, Admin Panel).
  - Manages protected routes (Login/Signup).
  - **WebTerminal.jsx**: A specialized component that renders the SSH interface using `xterm.js` and communicates via WebSockets.

### B. Backend Service (`chakra_backend`)
- **Tech Stack**: Python (Flask), Flask-SocketIO, Paramiko (SSH), MySQL-Connector.
- **Port**: 5000 (API exposed to host).
- **Function**:
  - **REST API**: endpoints for Auth (`/auth/login`), Challenges (`/api/challenges`), and Flag Submission (`/api/submit`).
  - **WebSocket Server**: Manages real-time bidirectional communication for the web terminal.
  - **SSH Manager**: A threaded Python module that bridges the gap between WebSockets (Browser) and raw TCP sockets (Linux Container).

### C. Database Service (`chakra_db`)
- **Tech Stack**: MySQL 8.0.
- **Port**: 3306 (Internal network, optionally exposed).
- **Function**:
  - Stores relational data: Users, Challenges, Submissions, Hint Usage, User Statistics.
  - Persistent storage via Docker Volumes (`mysql_data`).

### D. PwnBox Service (`chakra_pwnbox`)
- **Tech Stack**: Ubuntu/Debian-based Docker Image.
- **Port**: 22 (SSH internal).
- **Function**:
  - The "Target" machine.
  - Contains vulnerable configurations, CTF flags in files (e.g., `.hidden`, `root.txt`), and pre-installed security tools (netcat, nmap).
  - Isolated from the host system for security.

---

## 2. Deep Dive: Web SSH Implementation Flow

This system allows a browser to act as a fully interactive SSH client without local tools.

### Phase 1: Initiation (Frontend)
1. User clicks **"Spawn PwnBox"**.
2. React mounts the `<WebTerminal />` component.
3. `socket.io-client` establishes a WebSocket connection to `http://localhost:5000`.
4. **Handshake**: Browser emits `ssh_connect` event. Crucially, it does **not** send credentials; the backend handles auth internally.

### Phase 2: The Bridge (Backend)
1. Flask-SocketIO receives the `ssh_connect` event.
2. Backend loads secrets (Host, User, Pass) securely from `.env`.
3. **Paramiko Connection**:
   - `ssh_manager.py` initializes a `paramiko.SSHClient`.
   - Connects to the `chakra_pwnbox` container on internal port 22.
   - Invokes an interactive shell: `client.invoke_shell(term='xterm')`.
   - Sets the shell to **non-blocking mode**.

### Phase 3: The Real-Time Information Loop

#### A. Data Flow: Linux -> Browser (Output)
1. A background thread (`listen_output`) runs on the backend.
2. It constantly polls the SSH shell: `if shell.recv_ready()`.
3. If data exists (e.g., directory listing text), it is read (`shell.recv(4096)`).
4. Data is emitted to the specific client's WebSocket room: `emit('ssh_output', data)`.
5. Frontend receives `ssh_output` and writes it to the xterm.js instance: `term.write(data)`.

#### B. Data Flow: Browser -> Linux (Input)
1. User types a key in the browser.
2. xterm.js captures the keystroke via `term.onData()`.
3. Browser emits `ssh_input` with the keystroke data.
4. Flask receives `ssh_input`.
5. Backend writes the byte directly to the SSH shell's input stream: `shell.send(data)`.

### Phase 4: Termination
- If the socket disconnects (User navigates away), the backend triggers `ssh_manager.close_session()`.
- Validations ensure the SSH wrapper is closed to prevent zombie processes.

---

## 3. Full Project Directory Structure

```plaintext
Final-YearProject-CTF-/
├── docker-compose.yml          # Orchestration for DB, Backend, Frontend, PwnBox
├── README.md                   # Setup instructions
│
├── Backend/                    # Python Flask API & WebSocket Server
│   ├── app.py                  # Main Entry Point (Routes + Socket Events)
│   ├── ssh_manager.py          # SSH Client Logic (Paramiko)
│   ├── pwnbox_manager.py       # Docker Control Logic (Start/Stop containers)
│   ├── init_db.py              # Database Initialization Script
│   ├── ai_service.py           # AI Wrapper (Gemini integration)
│   ├── Dockerfile              # Backend Container Config
│   ├── requirements.txt        # Python Dependencies
│   ├── .env                    # Secrets (Not committed to git)
│   │
│   ├── routes/                 # API Route Modules
│   │   ├── challenges.py
│   │   └── ...
│   │
│   └── scripts/                # Utility Scripts
│       ├── add_linux_curriculum.py
│       ├── add_all_challenges.py
│       └── ...
│
└── Frontend/                   # React.js SPA
    ├── index.html
    ├── vite.config.js          # Build Configuration
    ├── Dockerfile              # Frontend Container Config
    │
    └── src/
        ├── App.jsx             # Main Router
        ├── index.css           # Global Styles (Theme variables)
        ├── config.js           # API URL Configuration
        │
        ├── components/         # Reusable UI Components
        │   ├── WebTerminal.jsx # xterm.js Wrapper (THE KEY COMPONENT)
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   └── CheckConstraint.jsx
        │
        └── pages/              # Page Views
            ├── Dashboard.jsx
            ├── Challenges.jsx          # Challenge List
            ├── LinuxChallenge.jsx      # Linux Interface
            ├── WebChallenge.jsx        # Web Exploitation Interface
            ├── Login.jsx
            ├── Profile.jsx
            └── Admin.jsx
```
