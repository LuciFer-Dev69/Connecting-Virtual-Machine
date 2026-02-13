# PwnBox API Documentation

## Overview
The PwnBox system provides isolated Ubuntu containers for each user with SSH access. Each container runs essential penetration testing tools.

---

## Endpoints

### 1. Spawn PwnBox
**Endpoint:** `POST /api/pwnbox/spawn`

**Description:** Creates or retrieves an existing PwnBox container for a user.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (Success - 200):**
```json
{
  "ip": "127.0.0.1",
  "port": 13065,
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "abc123...",
  "status": "ready"
}
```

**Response (Error - 500):**
```json
{
  "error": "Docker not available"
}
```

**Notes:**
- If a container already exists and is running, returns existing connection info
- Port is dynamically assigned and returned as an **integer**
- Password is generated based on user_id for consistency

---

### 2. Stop PwnBox
**Endpoint:** `POST /api/pwnbox/stop`

**Description:** Stops and removes a user's PwnBox container.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Response (Not Found - 404):**
```json
{
  "success": false
}
```

---

### 3. Restart PwnBox (ATOMIC)
**Endpoint:** `POST /api/pwnbox/restart`

**Description:** Atomically stops the current PwnBox and spawns a fresh one. This is the **recommended** way to restart a PwnBox.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (Success - 200):**
```json
{
  "ip": "127.0.0.1",
  "port": 14521,
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "def456...",
  "status": "provisioning"
}
```

**Response (Error - 400):**
```json
{
  "error": "User ID required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Container spawn failed: ..."
}
```

**Notes:**
- **Use this endpoint instead of calling stop + spawn separately**
- Handles cleanup automatically with 1-second delay
- Returns new connection info with a new port
- Frontend should reload after successful restart to reconnect

---

## WebSocket Events (Terminal Connection)

### Event: `ssh_connect`
**Description:** Establishes SSH connection to a PwnBox container.

**Emit Data:**
```javascript
{
  "host": "127.0.0.1",
  "port": 13065,
  "username": "kathet",
  "password": "pwn_1_chakra",
  "challenge_id": null  // Optional
}
```

**Received Events:**
- `ssh_output` - Terminal output data
- `ssh_error` - Connection error message
- `ssh_disconnect` - Connection closed

### Event: `ssh_input`
**Description:** Sends user input to the SSH session.

**Emit Data:** Raw string input from terminal

---

## Common Issues & Solutions

### Issue 1: "Unable to connect to port 22"
**Cause:** Frontend is using default port 22 instead of the dynamic port from spawn response.

**Solution:** Ensure the `port` field from `/api/pwnbox/spawn` is passed correctly to `WebTerminal` component:
```javascript
const pwnboxInfo = await fetch('/api/pwnbox/spawn', {...});
// pwnboxInfo.port should be an integer (e.g., 13065)
<WebTerminal connectionInfo={pwnboxInfo} />
```

### Issue 2: "Failed to restart PwnBox"
**Cause:** Race condition when calling stop and spawn separately.

**Solution:** Use the atomic `/api/pwnbox/restart` endpoint instead:
```javascript
// ❌ BAD - Race condition
await fetch('/api/pwnbox/stop', {...});
await fetch('/api/pwnbox/spawn', {...});

// ✅ GOOD - Atomic operation
await fetch('/api/pwnbox/restart', {...});
```

### Issue 3: Port returned as string instead of integer
**Cause:** Docker API returns HostPort as string.

**Solution:** Backend now explicitly converts to integer:
```python
host_port = int(ports['22/tcp'][0]['HostPort'])
```

---

## Best Practices

1. **Always use `/api/pwnbox/restart` for restarting** - Don't manually orchestrate stop + spawn
2. **Reload page after restart** - WebSocket connections need to be re-established
3. **Check response.ok before parsing JSON** - Handle errors properly
4. **Log connection info** - Helps debug SSH connection issues
5. **Display password to user** - Users need it for manual SSH access

---

## Frontend Integration Example

```javascript
// Spawn PwnBox on page load
useEffect(() => {
  const spawn = async () => {
    const res = await fetch(`${API_BASE}/pwnbox/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const data = await res.json();
    setPwnboxInfo(data);
  };
  spawn();
}, [userId]);

// Restart PwnBox
const handleRestart = async () => {
  try {
    const res = await fetch(`${API_BASE}/pwnbox/restart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }
    
    window.location.reload(); // Reconnect
  } catch (err) {
    alert(`Restart failed: ${err.message}`);
  }
};

// Render terminal
<WebTerminal connectionInfo={pwnboxInfo} />
```

---

## System Reconciliation

On backend startup, the system automatically reconciles PwnBoxes:
- Checks all users in database
- Ensures each user has a running PwnBox
- Spawns missing containers
- Logs reconciliation status

This ensures containers are always available even after system restarts.
