# 🔐 CHAKRA VIEW PWNBOX SYSTEM - COMPLETE RULES & ARCHITECTURE

## 📋 SYSTEM OVERVIEW

**PwnBox** is an isolated, containerized Ubuntu environment that provides each user with their own personal penetration testing lab. Each user gets a dedicated Docker container with SSH access and pre-installed hacking tools.

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    CHAKRA VIEW FRONTEND                      │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ PwnBoxLayout   │→ │ChakraTerminal│→ │  WebTerminal    │ │
│  │ (Header/UI)    │  │ (Page Logic) │  │ (xterm.js SSH)  │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    FLASK BACKEND (app.py)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Endpoints:                                      │   │
│  │  • POST /api/pwnbox/spawn    → Get/Create container │   │
│  │  • POST /api/pwnbox/stop     → Stop container       │   │
│  │  • POST /api/pwnbox/restart  → Atomic restart       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  WebSocket Events:                                   │   │
│  │  • ssh_connect    → Establish SSH to container      │   │
│  │  • ssh_input      → Send terminal commands          │   │
│  │  • ssh_output     → Receive terminal output         │   │
│  │  • ssh_error      → Connection errors               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ Docker API
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER ENGINE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Container 1  │  │ Container 2  │  │ Container N  │      │
│  │ User: kathet │  │ User: admin  │  │ User: ...    │      │
│  │ Port: 13065  │  │ Port: 14521  │  │ Port: XXXX   │      │
│  │ SSH Server   │  │ SSH Server   │  │ SSH Server   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CORE RULES

### Rule 1: One Container Per User
- **Each user gets exactly ONE PwnBox container**
- Container name format: `chakra_pwnbox_{sanitized_username}`
- Example: User "Kathet" → Container "chakra_pwnbox_kathet"

### Rule 2: Dynamic Port Assignment
- **SSH port is NEVER hardcoded to 22**
- Each container gets a random free port on the host
- Port range: Typically 10000-65535
- Port is returned as **INTEGER** in API responses

### Rule 3: Automatic Reconciliation
- **On backend startup, all user containers are auto-spawned**
- Ensures containers are always available
- Checks database for all users with role='user'
- Creates missing containers automatically

### Rule 4: Container Persistence
- **Containers persist until explicitly stopped**
- If container exists and is running, spawn returns existing info
- No duplicate containers for the same user

### Rule 5: Atomic Operations
- **Restart MUST be atomic (single operation)**
- Never call stop + spawn separately (causes race conditions)
- Always use `/api/pwnbox/restart` endpoint

---

## 🔄 LIFECYCLE FLOW

### 1️⃣ **Initial Spawn (First Time)**

```
User logs in → Frontend loads PwnBox page
    ↓
Frontend calls: POST /api/pwnbox/spawn
    ↓
Backend checks: Does container exist?
    ↓ NO
Backend creates new container:
    • Pulls chakra_pwnbox_img image
    • Assigns random port (e.g., 13065)
    • Sets environment: PWN_USER, PWN_PASS
    • Starts container with 512MB RAM, 0.8 CPU
    ↓
Backend returns:
{
  "ip": "127.0.0.1",
  "port": 13065,
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "abc123...",
  "status": "provisioning"
}
    ↓
Frontend passes to WebTerminal
    ↓
WebTerminal connects via WebSocket:
    • Emits: ssh_connect with {host, port, username, password}
    • Backend establishes SSH connection
    • Terminal becomes interactive
```

### 2️⃣ **Subsequent Access (Container Exists)**

```
User returns to PwnBox page
    ↓
Frontend calls: POST /api/pwnbox/spawn
    ↓
Backend checks: Does container exist?
    ↓ YES (already running)
Backend reads existing port from Docker
    ↓
Backend returns existing connection info:
{
  "ip": "127.0.0.1",
  "port": 13065,  ← Same port as before
  "user": "kathet",
  "password": "pwn_1_chakra",
  "status": "ready"
}
    ↓
Frontend reconnects to existing container
```

### 3️⃣ **Restart (User Clicks Button)**

```
User clicks "TERMINATE & RESPAWN"
    ↓
Frontend calls: POST /api/pwnbox/restart
    ↓
Backend executes atomic restart:
    1. Stop existing container (timeout: 5s)
    2. Remove container
    3. Wait 1 second for cleanup
    4. Get new random port (e.g., 14521)
    5. Create fresh container
    ↓
Backend returns NEW connection info:
{
  "ip": "127.0.0.1",
  "port": 14521,  ← NEW port
  "user": "kathet",
  "password": "pwn_1_chakra",
  "status": "provisioning"
}
    ↓
Frontend reloads page
    ↓
WebTerminal connects to NEW container
```

---

## 🔐 SECURITY RULES

### Authentication
- **User must be logged in** (user_id required for all operations)
- Password is generated per user: `pwn_{user_id}_chakra`
- SSH authentication uses username/password (not keys)

### Isolation
- **Each container is isolated** (separate network namespace)
- Resource limits enforced:
  - Memory: 512MB max
  - CPU: 0.8 cores (80% of one core)
- Containers cannot access host filesystem directly

### Port Security
- **Ports are bound to localhost (127.0.0.1)**
- Not exposed to external network
- Only accessible from the same machine

---

## 📡 API RULES

### Endpoint: `/api/pwnbox/spawn`
**Purpose:** Get or create a PwnBox container

**Request:**
```json
{
  "user_id": 1
}
```

**Response (Success):**
```json
{
  "ip": "127.0.0.1",
  "port": 13065,
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "abc123",
  "status": "ready"
}
```

**Rules:**
- ✅ Returns existing container if already running
- ✅ Creates new container if none exists
- ✅ Port is ALWAYS an integer
- ❌ Never creates duplicate containers

---

### Endpoint: `/api/pwnbox/restart`
**Purpose:** Atomically restart a PwnBox (stop + recreate)

**Request:**
```json
{
  "user_id": 1
}
```

**Response (Success):**
```json
{
  "ip": "127.0.0.1",
  "port": 14521,
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "def456",
  "status": "provisioning"
}
```

**Rules:**
- ✅ Stops old container completely
- ✅ Assigns NEW port
- ✅ Creates fresh environment
- ✅ Atomic operation (no race conditions)
- ❌ Frontend MUST reload after restart

---

### Endpoint: `/api/pwnbox/stop`
**Purpose:** Stop and remove a PwnBox container

**Request:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "success": true
}
```

**Rules:**
- ✅ Only for cleanup/shutdown
- ❌ Don't use for restart (use /restart instead)

---

## 🖥️ WEBSOCKET RULES

### Event: `ssh_connect`
**Direction:** Client → Server

**Payload:**
```javascript
{
  "host": "127.0.0.1",
  "port": 13065,  // ⚠️ MUST be from spawn response
  "username": "kathet",
  "password": "pwn_1_chakra",
  "challenge_id": null  // Optional
}
```

**Rules:**
- ✅ Port MUST come from API response
- ❌ NEVER hardcode port to 22
- ✅ Connection established via SSH library (paramiko)

---

### Event: `ssh_input`
**Direction:** Client → Server

**Payload:** Raw string (e.g., "ls -la\n")

**Rules:**
- ✅ Sent on every keystroke
- ✅ Includes special chars (\r, \n, \x7f for backspace)
- ✅ Forwarded directly to SSH session

---

### Event: `ssh_output`
**Direction:** Server → Client

**Payload:** Raw terminal output string

**Rules:**
- ✅ Written directly to xterm.js terminal
- ✅ Includes ANSI escape codes for colors
- ✅ Real-time streaming

---

## 🛠️ CONTAINER RULES

### Image: `chakra_pwnbox_img`
**Base:** Ubuntu 22.04

**Pre-installed Tools:**
- nmap, netcat, curl, wget
- python3, gcc, make
- vim, nano
- SSH server (openssh-server)

### Environment Variables:
```bash
PWN_USER=kathet        # Username for SSH
PWN_PASS=pwn_1_chakra  # Password for SSH
```

### Startup Process:
1. Container starts
2. Entrypoint script creates user with PWN_USER
3. Sets password to PWN_PASS
4. Starts SSH server on port 22 (internal)
5. Port 22 is mapped to random host port

---

## ⚠️ CRITICAL DON'TS

### ❌ DON'T: Hardcode Port 22
```javascript
// WRONG
socket.emit('ssh_connect', { port: 22 });

// CORRECT
socket.emit('ssh_connect', { port: connectionInfo.port });
```

### ❌ DON'T: Call Stop + Spawn Separately
```javascript
// WRONG - Race condition
await fetch('/api/pwnbox/stop');
await fetch('/api/pwnbox/spawn');

// CORRECT - Atomic
await fetch('/api/pwnbox/restart');
```

### ❌ DON'T: Forget to Reload After Restart
```javascript
// WRONG - Stale connection
await fetch('/api/pwnbox/restart');
// Terminal still connected to old container!

// CORRECT
await fetch('/api/pwnbox/restart');
window.location.reload();
```

### ❌ DON'T: Assume Port is a String
```python
# WRONG
port = ports['22/tcp'][0]['HostPort']  # Returns "13065"

# CORRECT
port = int(ports['22/tcp'][0]['HostPort'])  # Returns 13065
```

---

## 🎓 BEST PRACTICES

1. **Always use atomic endpoints** - Prevents race conditions
2. **Always validate API responses** - Check response.ok before parsing
3. **Always reload after restart** - Ensures clean reconnection
4. **Always log connection info** - Helps debugging
5. **Always show password to user** - They need it for manual access
6. **Always handle errors gracefully** - Show user-friendly messages
7. **Always use dynamic ports** - Never hardcode 22

---

## 🐛 DEBUGGING CHECKLIST

When PwnBox doesn't work:

1. ✅ Check if container is running: `docker ps | findstr pwnbox`
2. ✅ Check port mapping: `docker port chakra_pwnbox_kathet`
3. ✅ Check API response has integer port
4. ✅ Check WebSocket ssh_connect event has correct port
5. ✅ Check backend logs for SSH connection attempts
6. ✅ Check browser console for errors
7. ✅ Verify user is authenticated (localStorage has user object)

---

## 📊 SYSTEM LIMITS

- **Max containers:** Unlimited (one per user)
- **Memory per container:** 512MB
- **CPU per container:** 0.8 cores
- **Port range:** 10000-65535 (dynamic)
- **Container lifetime:** Until manually stopped
- **Restart time:** ~3-5 seconds

---

## 🔄 STATE DIAGRAM

```
┌─────────────┐
│  NO         │
│  CONTAINER  │
└──────┬──────┘
       │ spawn
       ↓
┌─────────────┐
│  CREATING   │
│  (pulling   │
│   image)    │
└──────┬──────┘
       │
       ↓
┌─────────────┐  ←──────┐
│  RUNNING    │         │
│  (ready for │         │ restart
│   SSH)      │         │
└──────┬──────┘         │
       │                │
       │ stop           │
       ↓                │
┌─────────────┐         │
│  STOPPED    │─────────┘
│  (removed)  │
└─────────────┘
```

---

This is the complete rule set for the Chakra View PwnBox system. Follow these rules to ensure reliable, secure, and bug-free operation! 🚀
