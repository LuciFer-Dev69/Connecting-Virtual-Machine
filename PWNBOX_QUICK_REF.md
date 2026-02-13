# PwnBox Quick Reference

## ⚠️ CRITICAL RULES

### 1. NEVER hardcode port 22
```javascript
// ❌ WRONG
port: 22

// ✅ CORRECT
port: connectionInfo.port
```

### 2. ALWAYS use atomic restart endpoint
```javascript
// ❌ WRONG
await fetch('/api/pwnbox/stop');
await fetch('/api/pwnbox/spawn');

// ✅ CORRECT
await fetch('/api/pwnbox/restart');
```

### 3. ALWAYS reload after restart
```javascript
// ❌ WRONG
await fetch('/api/pwnbox/restart');
// Terminal still connected to old container

// ✅ CORRECT
await fetch('/api/pwnbox/restart');
window.location.reload();
```

### 4. ALWAYS check response.ok
```javascript
// ❌ WRONG
const data = await fetch(...).then(r => r.json());

// ✅ CORRECT
const res = await fetch(...);
if (!res.ok) throw new Error((await res.json()).error);
const data = await res.json();
```

---

## API Endpoints

| Endpoint | Method | Purpose | Use When |
|----------|--------|---------|----------|
| `/api/pwnbox/spawn` | POST | Get/create PwnBox | Initial load |
| `/api/pwnbox/stop` | POST | Stop PwnBox | Cleanup only |
| `/api/pwnbox/restart` | POST | Atomic restart | User clicks restart |

---

## Response Format

```javascript
{
  "ip": "127.0.0.1",
  "port": 13065,        // ⚠️ ALWAYS an integer
  "user": "kathet",
  "password": "pwn_1_chakra",
  "container_id": "abc123",
  "status": "ready"
}
```

---

## WebSocket Events

| Event | Direction | Data |
|-------|-----------|------|
| `ssh_connect` | Client → Server | `{host, port, username, password}` |
| `ssh_output` | Server → Client | Terminal output string |
| `ssh_error` | Server → Client | Error message string |
| `ssh_disconnect` | Server → Client | (no data) |
| `ssh_input` | Client → Server | User input string |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Unable to connect to port 22" | Hardcoded port | Use `connectionInfo.port` |
| "Failed to restart" | Race condition | Use `/api/pwnbox/restart` |
| Terminal not responding | Stale connection | Reload page after restart |
| "User ID required" | Missing user_id | Check localStorage user object |

---

## File Locations

- **Backend API:** `Backend/app.py` (lines 66-106)
- **PwnBox Manager:** `Backend/pwnbox_manager.py`
- **Frontend Layout:** `Frontend/src/layouts/PwnBoxLayout.jsx`
- **Terminal Page:** `Frontend/src/pages/ChakraTerminal.jsx`
- **Terminal Component:** `Frontend/src/components/WebTerminal.jsx`

---

## Testing Commands

```bash
# Check if PwnBox is running
docker ps | findstr pwnbox

# Check port mapping
docker port chakra_pwnbox_kathet

# Test SSH connection
ssh -p 13065 kathet@localhost

# View backend logs
# (Check terminal running py app.py)

# View frontend logs
# (Check browser console)
```

---

## Debugging Workflow

1. **Check Network Tab** → Verify API response has correct port
2. **Check Console** → Look for "SSH Connecting to..." with port number
3. **Check WebSocket** → Verify `ssh_connect` event has correct port
4. **Check Backend** → Look for connection logs
5. **Check Docker** → Verify container is running on correct port

---

## Documentation Files

- `Backend/PWNBOX_API.md` - Complete API documentation
- `Frontend/PWNBOX_INTEGRATION.md` - Frontend integration guide
- `Backend/PWNBOX_QUICK_REF.md` - This file
