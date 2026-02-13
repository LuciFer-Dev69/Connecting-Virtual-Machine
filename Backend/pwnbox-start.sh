#!/bin/bash
# Startup script for Chakra PwnBox Services

# Handle dynamic user creation if environment variables are provided
if [ ! -z "$PWN_USER" ] && [ ! -z "$PWN_PASS" ]; then
    echo "👤 Creating custom user: $PWN_USER"
    # Create the user if it doesn't exist
    if ! id -u "$PWN_USER" >/dev/null 2>&1; then
        useradd -m -s /bin/bash "$PWN_USER"
        echo "$PWN_USER:$PWN_PASS" | chpasswd
        usermod -aG sudo "$PWN_USER"
        echo "$PWN_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
        (groupadd wireshark || true)
        usermod -aG wireshark "$PWN_USER"
        
        # Setup home directory with challenges and README
        cp -r /home/chakra/* /home/"$PWN_USER"/ 2>/dev/null
        chown -R "$PWN_USER":"$PWN_USER" /home/"$PWN_USER"
        
        # Add helpful aliases to the new user's bashrc
        echo "alias ipconfig='echo [!] Use ip addr or ifconfig on Linux'" >> /home/"$PWN_USER"/.bashrc
        echo "alias cls='clear'" >> /home/"$PWN_USER"/.bashrc
        echo "alias help='echo [!] This is Linux. Use man <command> for help.'" >> /home/"$PWN_USER"/.bashrc
        echo "alias dir='ls -F'" >> /home/"$PWN_USER"/.bashrc
    fi
fi

# Start Phantom Shop services
/opt/phantom-shop/start-services.sh &

# Start AI Simulator
python3 /opt/ai_simulator.py &

# Start legacy Service Discovery Lab
/opt/service-discovery-lab/start.sh &

# Start NEW Easy Red Team Labs (Ports 5101-5105)
/opt/easy-labs/start_labs.sh &

# Start SSH server in foreground
echo "🚀 All Chakra services starting..."
exec /usr/sbin/sshd -D
