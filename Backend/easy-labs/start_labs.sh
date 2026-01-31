#!/bin/bash
# Start all 5 Easy Red Team labs
echo "🚀 Starting Easy Red Team Labs..."

cd /opt/easy-labs

python3 lab1_service_enum.py &
python3 lab2_version_detection.py &
python3 lab3_robots_leak.py &
python3 lab4_hidden_dir.py &
python3 lab5_default_creds.py &

echo "✅ All 5 labs are running on ports 5101-5105!"
