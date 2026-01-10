import subprocess
import socket
import json

CHALLENGES = {
    "xss": {
        "image": "chakra_xss_challenge",
        "port": 80
    },
    "sqli": {
        "image": "chakra_sqli_challenge",
        "port": 80
    },
    "auth": {
        "image": "chakra_auth_challenge",
        "port": 80
    }
}

def run_docker_command(cmd):
    """Run a docker command using subprocess"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def get_free_port():
    """Finds a free port on the host"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def spawn_challenge(challenge_type, user_id):
    """Starts a container for the specific challenge type"""
    config = CHALLENGES.get(challenge_type)
    if not config:
        raise ValueError("Invalid challenge type")

    container_name = f"chakra_{challenge_type}_{user_id}"
    
    # Check if already running and stop it
    success, stdout, stderr = run_docker_command(f"docker ps -q -f name={container_name}")
    if success and stdout.strip():
        run_docker_command(f"docker stop {container_name}")
        run_docker_command(f"docker rm {container_name}")

    port = get_free_port()
    
    # Run the container
    cmd = f"docker run -d --name {container_name} -p {port}:{config['port']} --memory=128m --cpus=0.25 {config['image']}"
    success, stdout, stderr = run_docker_command(cmd)
    
    if not success:
        raise Exception(f"Failed to spawn container: {stderr}")
    
    container_id = stdout.strip()
    host_ip = "localhost"
    
    return {
        "container_id": container_id,
        "port": port,
        "url": f"http://{host_ip}:{port}"
    }

def stop_challenge(container_id):
    """Stops a challenge container"""
    success1, _, _ = run_docker_command(f"docker stop {container_id}")
    success2, _, _ = run_docker_command(f"docker rm {container_id}")
    return success1 and success2

if __name__ == "__main__":
    # Test Docker availability
    success, stdout, stderr = run_docker_command("docker ps")
    if success:
        print("✅ Docker is available via CLI")
    else:
        print(f"❌ Docker CLI not available: {stderr}")
