import paramiko
import os
from dotenv import load_dotenv
import time

load_dotenv()

def provision_easy_labs():
    print("🚀 Provisioning Easy Red Team Labs in PwnBox...")
    
    host = os.getenv("SSH_HOST", "pwnbox")
    user = os.getenv("SSH_USER", "chakra")
    password = os.getenv("SSH_PASSWORD", "user")
    port = 22 # Internal SSH port

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(hostname=host, port=port, username=user, password=password, timeout=10)
        print("✅ Connected to PwnBox")

        base_dir = "/home/chakra/challenges"
        
        # Challenge 1: Service Enumeration
        ch1_dir = f"{base_dir}/service-enumeration"
        readme1 = """Challenge: Service Enumeration
Difficulty: Easy

Description:
A target system is running multiple services, some on non-standard ports.

Objective:
Identify all open ports and running services.

Allowed Tools:
- nmap
- ss
- netstat

Target:
http://localhost:5101

Flag Format:
FLAG{...}
"""
        # Challenge 2: Version Detection
        ch2_dir = f"{base_dir}/version-detection"
        readme2 = """Challenge: Version Detection
Difficulty: Easy

Description:
Discover service versions to identify outdated software.

Objective:
Identify the version of the running web server.

Allowed Tools:
- nmap -sV
- curl
- whatweb

Target:
http://localhost:5102

Flag Format:
FLAG{...}
"""
        # Challenge 3: Robots.txt Leak
        ch3_dir = f"{base_dir}/robots-leak"
        readme3 = """Challenge: Robots.txt Information Leak
Difficulty: Easy

Description:
Find sensitive paths exposed via robots.txt.

Objective:
Find the hidden directory and the flag.

Allowed Tools:
- curl
- browser

Target:
http://localhost:5103

Flag Format:
FLAG{...}
"""
        # Challenge 4: Hidden Directory
        ch4_dir = f"{base_dir}/hidden-directory"
        readme4 = """Challenge: Hidden Directory Discovery
Difficulty: Easy

Description:
Enumerate hidden directories like /admin, /backup.

Objective:
Find the hidden file containing the flag.

Allowed Tools:
- gobuster
- ffuf
- dirsearch

Target:
http://localhost:5104

Flag Format:
FLAG{...}
"""
        # Challenge 5: Default Credentials
        ch5_dir = f"{base_dir}/default-credentials"
        readme5 = """Challenge: Default Credentials Abuse
Difficulty: Easy

Description:
Gain access using weak/common login credentials.

Objective:
Bypass the login and find the flag.

Allowed Tools:
- browser
- curl

Target:
http://localhost:5105

Flag Format:
FLAG{...}
"""

        commands = [
            f"mkdir -p {ch1_dir} {ch2_dir} {ch3_dir} {ch4_dir} {ch5_dir}",
            f"echo '{readme1}' > {ch1_dir}/README.txt",
            f"echo 'FLAG{{SYSTEM_EN_101_DISCOVERED}}' > {ch1_dir}/flag.txt",
            f"echo '{readme2}' > {ch2_dir}/README.txt",
            f"echo 'FLAG{{VERSION_42_DETECTED_0x41}}' > {ch2_dir}/flag.txt",
            f"echo '{readme3}' > {ch3_dir}/README.txt",
            f"echo 'FLAG{{ROBOTS_TXT_LEAK_CONFIRMED}}' > {ch3_dir}/flag.txt",
            f"echo '{readme4}' > {ch4_dir}/README.txt",
            f"echo 'FLAG{{G0BUSTER_DIR_HUNT_SUCCESS}}' > {ch4_dir}/flag.txt",
            f"echo '{readme5}' > {ch5_dir}/README.txt",
            f"echo 'FLAG{{ADMIN_ADMIN_AUTH_BYPASS}}' > {ch5_dir}/flag.txt",
            # Set permissions
            f"chmod 600 {base_dir}/*/flag.txt",
            f"chown -R chakra:chakra {base_dir}"
        ]

        for cmd in commands:
            client.exec_command(cmd)
            time.sleep(0.1)

        print("🎉 Provisioning of Easy Labs Complete!")
        client.close()

    except Exception as e:
        print(f"❌ Failure during SSH provisioning: {e}")

if __name__ == "__main__":
    provision_easy_labs()
