#!/bin/bash
# Startup script for service-discovery-lab

# 1. Create a dummy service on port 9091 using netcat
# This service will simulate a vulnerable banner
mkdir -p /opt/services
echo "FLAG{SERVICE_ENUMERATION_SUCCESS}" > /opt/services/flag.txt
echo "Welcome to the Internal Recon Service v1.0. Flag is located at /opt/services/flag.txt" > /opt/services/banner.txt

# Run a netcat listener on 9091 that serves the banner
while true; do echo -e "HTTP/1.1 200 OK\n\n$(cat /opt/services/banner.txt)" | nc -l -p 9091 -q 1; done &

echo "Service Enumeration Lab Started on Port 9091"
