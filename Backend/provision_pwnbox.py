
import paramiko
import os
from dotenv import load_dotenv
import time

load_dotenv()

def provision_via_ssh():
    print("🚀 Provisioning Linux Challenges via SSH...")
    
    host = os.getenv("SSH_HOST", "pwnbox")
    user = os.getenv("SSH_USER", "chakra")
    password = os.getenv("SSH_PASSWORD", "user")
    port = int(os.getenv("SSH_PORT", 22))

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, port=port, username=user, password=password, timeout=10)
        print("✅ Connected to PwnBox")

        commands = [
            # Cleanup previous run (optional, to avoid duplicates)
            "rm -rf /home/chakra/inhere",
            "mkdir -p /home/chakra/inhere",

            # Level 0: Readme
            "echo 'flag{linux_readme_done}' > /home/chakra/readme",

            # Level 1: Dashed Filename
            "echo 'flag{dash_filename_redirection}' > /home/chakra/-",

            # Level 2: Spaces in filename
            "echo 'flag{spaces_are_tricky}' > '/home/chakra/spaces in this filename'",

            # Level 3: Hidden file in directory
            "echo 'flag{hidden_dot_files}' > /home/chakra/inhere/.hidden",

            # Level 4: Human readable file
            # Create noise files
            "for i in {0..9}; do head -c 100 /dev/urandom > /home/chakra/inhere/-file$i; done",
            "echo 'flag{file_type_human_readable}' > /home/chakra/inhere/-file07",
            
            # Level 5: File size 1033 bytes
            # Create a file exactly 1033 bytes long. 
            # We generate 1033 'A's. 
            "python3 -c 'print(\"A\"*1033, end=\"\")' > /home/chakra/inhere/size_check",
            # Overwrite with flag but ensure size stays 1033? 
            # Wait, the challenge is finding the file *by size*. 
            # Let's just put the flag in a file and pad it to 1033 bytes.
            "python3 -c 'flag=\"flag{find_size_1033}\"; print(flag + \" \" * (1033 - len(flag)), end=\"\")' > /home/chakra/inhere/exact_1033_bytes",

            # Level 6: User/Group
            "echo 'user' | sudo -S groupadd bandit6",
            "echo 'user' | sudo -S useradd -m -g bandit6 bandit7",
            "echo 'flag{find_user_group_size}' > /var/tmp/bandit7_file",
            "echo 'user' | sudo -S chown bandit7:bandit6 /var/tmp/bandit7_file",
            "echo 'user' | sudo -S chmod 640 /var/tmp/bandit7_file",

            # Level 7: Grep Master (data.txt)
            # Create a large file with 'millionth' somewhere
            "python3 -c 'import random; lines = [\"garbage data \" + str(i) for i in range(1000)]; lines.insert(500, \"millionth flag{grep_is_powerful_tool}\"); print(\"\\n\".join(lines))' > /home/chakra/data.txt",

            # Level 8: Base64
            "echo 'flag{base64_multistep_decode}' | base64 > /home/chakra/data.txt.b64"
        ]

        for cmd in commands:
            print(f"Exec: {cmd[:50]}...")
            stdin, stdout, stderr = client.exec_command(cmd)
            err = stderr.read().decode()
            if err:
                print(f"Warning/Error: {err}")
            
            # Ensure commands finish
            time.sleep(0.1)

        print("🎉 Provisioning Complete!")
        client.close()

    except Exception as e:
        print(f"❌ Failure: {e}")

if __name__ == "__main__":
    provision_via_ssh()
