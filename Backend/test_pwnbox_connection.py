
import paramiko
import os
from dotenv import load_dotenv

load_dotenv()

def test_pwnbox():
    host = os.getenv("SSH_HOST", "pwnbox")
    user = os.getenv("SSH_USER", "chakra")
    password = os.getenv("SSH_PASSWORD", "user")
    port = int(os.getenv("SSH_PORT", 22))

    print(f"Testing SSH connection to {user}@{host}:{port}...")
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, port=port, username=user, password=password, timeout=10)
        print("✅ SUCCESS: Connected to PwnBox!")
        stdin, stdout, stderr = client.exec_command('hostname')
        print(f"Hostname: {stdout.read().decode().strip()}")
        client.close()
    except Exception as e:
        print(f"❌ FAILURE: {e}")

if __name__ == "__main__":
    test_pwnbox()
