import docker
import socket
import db

# Initialize Docker client
try:
    client = docker.from_env()
except Exception as e:
    print(f"Warning: Docker client failed to initialize: {e}")
    client = None

PWNBOX_IMAGE = "chakra_pwnbox_img"

def get_free_port():
    """Finds a free port on the host"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        port = s.getsockname()[1]
        # Validate port is in acceptable range
        if port < 1000:
            return get_free_port()  # Retry if port too low
        return port

def wait_for_ssh(host, port, timeout=15):
    """
    Wait for SSH service to be ready on the container.
    This prevents "connection refused" errors.
    """
    import time
    start_time = time.time()
    
    print(f"   ⏳ Waiting for SSH on {host}:{port}...")
    
    while time.time() - start_time < timeout:
        try:
            # Attempt TCP connection to SSH port
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(1)
                result = sock.connect_ex((host, port))
                if result == 0:
                    print(f"   ✅ SSH is ready on port {port}")
                    return True
        except Exception as e:
            pass
        
        time.sleep(1)
    
    print(f"   ❌ SSH not ready after {timeout} seconds")
    return False

def get_username(user_id):
    """Fetch username from database"""
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM users WHERE user_id = %s", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else f"user_{user_id}"
    except:
        return f"user_{user_id}"

def spawn_pwnbox(user_id):
    """Starts a pwnbox container for the user immediately."""
    if not client: 
        raise Exception("Docker not available")

    username = get_username(user_id)
    safe_user = "".join(c for c in username if c.isalnum()).lower()
    container_name = f"chakra_pwnbox_{safe_user}"
    pwn_pass = f"pwn_{user_id}_chakra" 

    # Check if already running
    try:
        existing = client.containers.get(container_name)
        if existing.status == "running":
            ports = existing.attrs['NetworkSettings']['Ports']
            host_port = int(ports['22/tcp'][0]['HostPort'])
            return {
                "ip": "127.0.0.1",
                "port": host_port,
                "user": safe_user,
                "password": pwn_pass,
                "container_id": existing.id,
                "status": "ready"
            }
        else:
            existing.remove()
    except:
        pass

    # Create new container
    port = get_free_port()
    try:
        container = client.containers.run(
            PWNBOX_IMAGE,
            name=container_name,
            detach=True,
            ports={'22/tcp': port},
            environment={
                "PWN_USER": safe_user,
                "PWN_PASS": pwn_pass
            },
            mem_limit="512m",
            cpu_period=100000,
            cpu_quota=80000
        )
        
        return {
            "ip": "127.0.0.1",
            "port": port,
            "user": safe_user,
            "password": pwn_pass,
            "container_id": container.id,
            "status": "ready"
        }
    except Exception as e:
        print(f"Spawn error: {e}")
        raise e

def get_pwnbox_status(user_id):
    """Check if PwnBox is running and SSH is ready"""
    if not client:
        return {"running": False, "error": "Docker not available"}
    
    username = get_username(user_id)
    safe_user = "".join(c for c in username if c.isalnum()).lower()
    container_name = f"chakra_pwnbox_{safe_user}"
    
    try:
        container = client.containers.get(container_name)
        if container.status != "running":
            return {"running": False, "status": container.status}
        
        # Get port
        ports = container.attrs['NetworkSettings']['Ports']
        if not ports.get('22/tcp'):
            return {"running": True, "ssh_ready": False, "error": "No port mapping"}
        
        host_port = int(ports['22/tcp'][0]['HostPort'])
        
        # Quick SSH check (1 second timeout)
        ssh_ready = wait_for_ssh("127.0.0.1", host_port, timeout=1)
        
        return {
            "running": True,
            "port": host_port,
            "ssh_ready": ssh_ready,
            "status": "ready" if ssh_ready else "starting"
        }
    except docker.errors.NotFound:
        return {"running": False, "error": "Container not found"}
    except Exception as e:
        return {"running": False, "error": str(e)}

def stop_pwnbox(user_id):
    """Stops the user's pwnbox"""
    if not client: return False
    username = get_username(user_id)
    safe_user = "".join(c for c in username if c.isalnum()).lower()
    container_name = f"chakra_pwnbox_{safe_user}"
    try:
        container = client.containers.get(container_name)
        container.stop()
        container.remove()
        return True
    except:
        return False

def restart_pwnbox(user_id):
    """
    Atomically restart a user's PwnBox with STRICT SSH READINESS CHECK.
    NEVER returns until new container SSH is confirmed ready.
    """
    if not client:
        raise Exception("Docker not available")
    
    username = get_username(user_id)
    safe_user = "".join(c for c in username if c.isalnum()).lower()
    container_name = f"chakra_pwnbox_{safe_user}"
    pwn_pass = f"pwn_{user_id}_chakra"
    
    print(f"🔄 Restarting PwnBox for user {user_id} ({username})...")
    
    # Step 1: Stop and remove existing container
    try:
        existing = client.containers.get(container_name)
        print(f"   Stopping existing container...")
        existing.stop(timeout=5)
        existing.remove()
        print(f"   ✅ Old container removed")
    except docker.errors.NotFound:
        print(f"   No existing container found")
    except Exception as e:
        print(f"   Warning during cleanup: {e}")
    
    # Step 2: Wait for cleanup
    import time
    time.sleep(2)
    
    # Step 3: Get new port
    new_port = get_free_port()
    
    # Step 4: Create fresh container
    try:
        print(f"   Creating new container on port {new_port}...")
        container = client.containers.run(
            PWNBOX_IMAGE,
            name=container_name,
            detach=True,
            ports={'22/tcp': new_port},
            environment={
                "PWN_USER": safe_user,
                "PWN_PASS": pwn_pass
            },
            mem_limit="512m",
            cpu_period=100000,
            cpu_quota=80000
        )
        
        # CRITICAL: Wait for SSH to be ready
        if not wait_for_ssh("127.0.0.1", new_port, timeout=15):
            print(f"   ❌ SSH failed to start, destroying container...")
            container.stop()
            container.remove()
            raise Exception("SSH service failed to start in restarted container")
        
        print(f"✅ PwnBox restarted successfully for {username}")
        print(f"   Container ID: {container.id[:12]}")
        print(f"   SSH Port: {new_port}")
        
        return {
            "ip": "127.0.0.1",
            "port": new_port,
            "user": safe_user,
            "password": pwn_pass,
            "container_id": container.id,
            "status": "ready"
        }
    except Exception as e:
        print(f"❌ Failed to create new container: {e}")
        raise e

def reconcile_pwnboxes():
    """Ensures PwnBox containers for all users are running"""
    if not client: return
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT user_id FROM users WHERE role = 'user'")
        users = cursor.fetchall()
        conn.close()
        
        print(f"🔄 Reconciling PwnBoxes for {len(users)} users...")
        for (u_id,) in users:
            try:
                spawn_pwnbox(u_id)
            except Exception as e:
                print(f"Error reconciling PwnBox for user {u_id}: {e}")
    except Exception as e:
        print(f"Reconciliation error: {e}")
