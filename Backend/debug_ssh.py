import paramiko
import sys

def test_ssh(host, username, password):
    print(f"Testing SSH connection to {username}@{host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(
            host, 
            username=username, 
            password=password, 
            timeout=10,
            look_for_keys=False,
            allow_agent=False
        )
        print("SUCCESS: Connection established!")
        
        stdin, stdout, stderr = client.exec_command('whoami')
        print(f"Output of 'whoami': {stdout.read().decode().strip()}")
        
        client.close()
    except paramiko.AuthenticationException:
        print("FAILURE: Authentication Failed: Check username/password.")
    except paramiko.SSHException as e:
        print(f"FAILURE: SSH Error: {e}")
    except Exception as e:
        print(f"FAILURE: Connection Error: {e}")

if __name__ == "__main__":
    test_ssh("192.168.81.134", "ubuntu", "kali")
