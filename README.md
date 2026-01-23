# 🛡️ Chakra Security Lab Platform

A high-fidelity, containerized Capture The Flag (CTF) ecosystem designed for immersive security training. This platform integrates a modern React frontend, a robust Flask backend, and a dedicated **PwnBox** environment pre-configured with real-world vulnerabilities.

---

## 🚀 Deployment & Service Map

Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### 1. Launch the Stack
```bash
# Clone and enter directory
git clone https://github.com/LuciFer-Dev69/Connecting-Virtual-Machine.git
cd Connecting-Virtual-Machine

# Configure Gemini AI (Optional but recommended for hints)
echo "GEMINI_API_KEY=your_key_here" > Backend/.env

# Build and start services
docker-compose up --build -d
```

### 2. Networking & Ports
| Service | Localhost URL | Description |
| :--- | :--- | :--- |
| **🌐 Main Frontend** | `http://localhost:3000` | The primary platform UI and dashboard. |
| **🔌 Backend API** | `http://localhost:5000` | Support services and AI hint engine. |
| **🐚 PwnBox SSH** | `localhost:2222` | Direct terminal access (`ssh chakra@localhost -p 2222`). |

---

## ⚔️ Red Team Roadmap (Tool-Only Curriculum)
The platform now features a strictly curated **30-challenge roadmap** designed to master core security tools.

### **Zero Friction Access**
- **Public Entry**: The roadmap is now accessible to guests without mandatory login.
- **Global Unlock**: All tiers (Easy, Medium, Hard) are **instantly unlocked**. Users can jump to advanced labs immediately without completing previous levels.
- **Progress Sync**: Login is only required to submit flags and save permanent progress.

### **Curriculum Breakdown**
- **10 Easy Labs**: Service enumeration, `nmap`, and basic info leaks.
- **10 Medium Labs**: Credential stuffing, LFI, and intermediate exploitation.
- **10 Hard Labs**: Advanced Prototype Pollution, CSP Bypasses, Supply Chain attacks, and Race Conditions.

---

## 🛡️ Admin & Super Admin Features
The platform includes a robust administrative backend for Lab Managers.

#### **Default Credentials**
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@chakra.com` | `Admin@1234` |
| **PwnBox SSH** | `chakra` (user) | `user` |

#### **Enhanced Admin Experience**
- **Sidebar Integration**: Super Admins now have an **Admin Panel** shortcut directly in the main sidebar for instant navigation.
- **Lab Management**: CRUD for challenges, roadmap configuration, and audit logging.
- **User Governance**: Direct control over user accounts, including suspension and reactivation.

---

## 🛠️ Technical Deep Dive

### **1. PwnBox Architecture**
The heart of the project is the `chakra_pwnbox`, a hardened Ubuntu environment that acts as both the attacker's terminal and a host for vulnerable services.
- **Tools Included:** `curl`, `wget`, `netcat`, `nmap`, `python3`, `git`.

### **2. AI Hint Engine (Gemini Pro)**
The platform features an integrated AI assistant that reads the context of your current challenge and provides tailored technical hints.

---

## 📂 Project Structure

```text
├── Backend/
│   ├── phantom-shop/         # Sources for all Real-Life challenge backends
│   ├── Dockerfile.pwnbox     # Configuration for the isolated lab container
│   ├── app.py                # Main Platform API (Public & Private routes)
│   └── init_db.py            # Initialization script for 30-lab curriculum
├── Frontend/
│   ├── src/pages/           # Specialized UI (Roadmaps, Grid, Admin)
│   └── components/          # Sidebar with Admin shortcut & WebTerminal
└── docker-compose.yml       # Global orchestration
```

---

### 🔒 Post-Installation
After launching, initialize the challenge database to populate the 30-lab curriculum:
```bash
docker exec -it chakra_backend python init_db.py
```

---

## ⚖️ Disclaimer
This platform is strictly for **educational and ethical hacking research**. Do not use these techniques against systems you do not own or have explicit permission to test.
