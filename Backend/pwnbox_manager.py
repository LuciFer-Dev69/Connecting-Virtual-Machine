import docker
import random
import socket
import time

# Initialize Docker client (uses local socket / pipe)
try:
    client = docker.from_env()
except Exception as e:
    print(f"Warning: Docker client failed to initialize: {e}")
    client = None

PWNBOX_IMAGE = "chakra_pwnbox_img"

def build_image():
    """Builds the PwnBox image if it doesn't exist"""
    if not client: return False
    try:
        print("Building PwnBox image... this may take a while.")
        client.images.build(path=".", dockerfile="Dockerfile.pwnbox", tag=PWNBOX_IMAGE)
        print("PwnBox image built successfully.")
        return True
    except Exception as e:
        print(f"Failed to build image: {e}")
        return False

def get_free_port():
    """Finds a free port on the host"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def spawn_pwnbox(user_id):
    """Starts a pwnbox container for the user"""
    if not client: raise Exception("Docker not available")

    container_name = f"chakra_pwnbox_{user_id}"
    
    # Check if already running
    try:
        existing = client.containers.get(container_name)
        if existing.status == "running":
            # Return existing info
            ports = existing.attrs['NetworkSettings']['Ports']
            host_port = ports['22/tcp'][0]['HostPort']
            return {"ip": "localhost", "port": host_port, "user": "chakra", "password": "user"}
        else:
            existing.remove()
    except docker.errors.NotFound:
        pass

    # Start new
    port = get_free_port()
    try:
        container = client.containers.run(
            PWNBOX_IMAGE,
            name=container_name,
            detach=True,
            ports={'22/tcp': port},
            mem_limit="256m",  # Limit resources
            cpu_period=100000,
            cpu_quota=50000    # 0.5 CPU
        )
        
        return {
            "ip": "localhost",
            "port": port,
            "user": "chakra",
            "password": "user",
            "container_id": container.id
        }
    except Exception as e:
        print(f"Spawn error: {e}")
        raise e

def stop_pwnbox(user_id):
    """Stops the user's pwnbox"""
    if not client: return
    container_name = f"chakra_pwnbox_{user_id}"
    try:
        container = client.containers.get(container_name)
        container.stop()
        container.remove()
        return True
    except:
        return False
