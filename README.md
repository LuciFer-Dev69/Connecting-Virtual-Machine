# 🛡️ Professional CTF & Security Lab Platform

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

### ⚔️ Real-Life Web Challenges (PwnBox Internal)
These labs are hosted inside the `chakra_pwnbox` container and are accessible through the platform's "Web View" or directly:

| Lab Name | Port | Vulnerability Focus |
| :--- | :--- | :--- |
| **Phantom Login (XSS)** | `5050` | Reflected XSS & Session Hijacking. |
| **Phantom Profile** | `6060` | File Upload Misconfiguration & RCE. |
| **Phantom Login (SQLi)** | `7010` | Authentication Bypass via SQL Injection. |
| **PHANTOM.TECH** | `9090` | **Level: Advanced** - Business Logic & Price Tampering. |
| **SQLi Login Lab** | `3003` | Classic SQLi on a simplified login portal. |
| **Auth API Lab** | `3004` | API-based authentication vulnerabilities. |

---

## 🛠️ Technical Deep Dive

### **1. PwnBox Architecture**
The heart of the project is the `chakra_pwnbox`, a hardened Ubuntu environment that acts as both the attacker's terminal and a host for vulnerable services.
- **Tools Included:** `curl`, `wget`, `netcat`, `nmap`, `python3`, `git`.
- **Logic:** Each Real-Life challenge runs as a separate micro-service (Flask/Node.js) on isolated ports within the container.

### **2. AI Hint Engine (Gemini Pro)**
The platform features an integrated AI assistant that reads the context of your current challenge and provides tailored technical hints, bridging the gap between theory and exploitation.

### **3. Real-Life Web Suite**
- **XSS Lab (Port 5050):** Uses an EJS-based search system that reflects raw input.
- **File Upload (Port 6060):** A Python Flask app with weak extension blacklisting.
- **SQLi (Port 7010):** A SQLite3 backend vulnerable to single-quote escapes in the login field.
- **Business Logic (Port 9090):** A premium e-commerce storefront (PHANTOM.TECH) that trusts client-sent JSON price fields during checkout.

---

## 📂 Project Structure

```text
├── Backend/
│   ├── phantom-shop/         # Sourcess for all Real-Life challenge backends
│   ├── Dockerfile.pwnbox     # Configuration for the isolated lab container
│   └── app.py                # Main Platform API
├── Frontend/
│   ├── src/pages/           # Specialized UI for each challenge type
│   └── components/          # WebTerminal and navigation components
├── images/                   # High-fidelity assets for the e-commerce lab
└── docker-compose.yml       # Global orchestration
```

---

### 🔒 Post-Installation & Access
After launching, initialize the challenge database to populate the dashboard:
```bash
docker exec -it chakra_backend python init_db.py
```

#### **Default Credentials**
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@chakra.com` | `Admin@1234` |
| **PwnBox SSH** | `chakra` (user) | `user` |
| **MySQL Root** | `root` | `rootpassword` |

#### **Admin Portal**
Accessible at `http://localhost:3000/#/admin`.
- **Features:** Challenge CRUD, User Suspension, Audit Logs, and Roadmap Management.
- **RBAC:** Only users with the `admin` role can access this portal.

---

## ⚖️ Disclaimer
This platform is strictly for **educational and ethical hacking research**. Do not use these techniques against systems you do not own or have explicit permission to test.
