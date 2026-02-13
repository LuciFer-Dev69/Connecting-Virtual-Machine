# PwnBox Frontend Integration Guide

## Component Architecture

```
PwnBoxLayout (Header with controls)
  └── ChakraTerminal (Mission briefing + stats)
       └── WebTerminal (xterm.js + Socket.IO)
```

---

## Key Files

1. **`layouts/PwnBoxLayout.jsx`** - Top-level layout with status bar and restart button
2. **`pages/ChakraTerminal.jsx`** - Main PwnBox page with mission context
3. **`components/WebTerminal.jsx`** - Terminal component with SSH connection

---

## Critical Implementation Details

### 1. Connection Info Flow

```javascript
// ChakraTerminal.jsx - Fetches connection info
const [pwnboxInfo, setPwnboxInfo] = useState(null);

useEffect(() => {
  const spawn = async () => {
    const res = await fetch(`${API_BASE}/pwnbox/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const data = await res.json();
    setPwnboxInfo(data); // { ip, port, user, password, ... }
  };
  spawn();
}, [userId]);

// Pass to WebTerminal
<WebTerminal connectionInfo={pwnboxInfo} />
```

### 2. WebTerminal SSH Connection

```javascript
// WebTerminal.jsx
socket.on('connect', () => {
  socket.emit('ssh_connect', {
    host: connectionInfo?.ip || 'localhost',
    port: connectionInfo?.port || 22,  // ⚠️ CRITICAL: Must use dynamic port
    username: connectionInfo?.user || 'chakra',
    password: connectionInfo?.password || 'user'
  });
});
```

**⚠️ CRITICAL:** The `port` field MUST come from `connectionInfo.port`, not hardcoded to 22!

---

## Restart Button Implementation

### ✅ CORRECT (Atomic)

```javascript
const handleRestart = async () => {
  setTerminating(true);
  
  try {
    const response = await fetch(`${API_BASE}/pwnbox/restart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to restart');
    }

    window.location.reload(); // Reconnect with new container
  } catch (error) {
    alert(`Restart failed: ${error.message}`);
    setTerminating(false);
  }
};
```

### ❌ INCORRECT (Race Condition)

```javascript
// DON'T DO THIS - Can cause race conditions
await fetch('/api/pwnbox/stop', {...});
await new Promise(r => setTimeout(r, 1000));
await fetch('/api/pwnbox/spawn', {...});
```

---

## Common Pitfalls

### Pitfall 1: Hardcoded Port 22
```javascript
// ❌ BAD
socket.emit('ssh_connect', {
  host: 'localhost',
  port: 22  // WRONG! This is hardcoded
});

// ✅ GOOD
socket.emit('ssh_connect', {
  host: connectionInfo.ip,
  port: connectionInfo.port  // Dynamic port from API
});
```

### Pitfall 2: Not Checking response.ok
```javascript
// ❌ BAD
const data = await fetch('/api/pwnbox/restart', {...}).then(r => r.json());
// If API returns 500, data.error exists but you don't check it

// ✅ GOOD
const response = await fetch('/api/pwnbox/restart', {...});
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error);
}
const data = await response.json();
```

### Pitfall 3: Not Reloading After Restart
```javascript
// ❌ BAD
await fetch('/api/pwnbox/restart', {...});
// Terminal still connected to old container!

// ✅ GOOD
await fetch('/api/pwnbox/restart', {...});
window.location.reload(); // Re-establish WebSocket connection
```

---

## UI/UX Best Practices

### 1. Display Connection Info
```javascript
<span>
  {pwnboxInfo ? 
    `${pwnboxInfo.user}@chakraview:~/ops# [PASS: ${pwnboxInfo.password}]` 
    : 'Establishing neural uplink...'
  }
</span>
```

### 2. Loading States
```javascript
const [loading, setLoading] = useState(true);
const [terminating, setTerminating] = useState(false);

// Show loading during spawn
{loading && <div>Initializing PwnBox...</div>}

// Disable button during restart
<button disabled={terminating}>
  {terminating ? 'RESTARTING...' : 'TERMINATE & RESPAWN'}
</button>
```

### 3. Error Handling
```javascript
try {
  const res = await fetch(...);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Unknown error');
  }
} catch (error) {
  console.error('❌ Error:', error);
  alert(`Operation failed: ${error.message}`);
}
```

---

## WebSocket Event Handling

### Connection Events
```javascript
socket.on('connect', () => {
  // Emit ssh_connect with connection info
});

socket.on('ssh_output', (data) => {
  term.write(data); // Write to xterm
});

socket.on('ssh_error', (msg) => {
  term.write(`\r\n\x1b[31mError: ${msg}\x1b[0m\r\n`);
});

socket.on('ssh_disconnect', () => {
  term.write('\r\n\x1b[33mDisconnected\x1b[0m\r\n');
});
```

### User Input
```javascript
term.onData((data) => {
  if (connected) {
    socket.emit('ssh_input', data);
  }
});
```

---

## Testing Checklist

- [ ] PwnBox spawns on page load
- [ ] Terminal connects to correct port (not 22)
- [ ] Password is displayed to user
- [ ] User can type commands and see output
- [ ] Restart button works without errors
- [ ] Page reloads after restart
- [ ] New terminal session connects successfully
- [ ] No "port 22" errors in console

---

## Debugging Tips

1. **Check Network Tab:**
   - Verify `/api/pwnbox/spawn` returns `port` as integer
   - Check `/api/pwnbox/restart` response

2. **Check Console Logs:**
   - Look for "SSH Connecting to..." message
   - Verify port number is NOT 22

3. **Check WebSocket:**
   - Ensure `ssh_connect` event includes correct port
   - Look for `ssh_error` events

4. **Check Backend Logs:**
   - Look for "🔄 Restarting PwnBox..." messages
   - Check for Docker errors

---

## Future-Proofing

To prevent similar issues in the future:

1. **Always use TypeScript interfaces** for API responses
2. **Add runtime validation** for connection info
3. **Log all API calls** with request/response data
4. **Use atomic endpoints** instead of multi-step operations
5. **Document all APIs** in markdown files
6. **Add integration tests** for critical flows
