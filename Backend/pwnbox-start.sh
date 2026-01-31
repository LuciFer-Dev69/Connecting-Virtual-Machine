#!/bin/bash
# Startup script for Chakra PwnBox Services

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
