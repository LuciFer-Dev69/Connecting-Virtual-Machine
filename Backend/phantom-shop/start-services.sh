#!/bin/bash

# Phantom Shop Services Startup Script
echo "🔥 Starting Phantom Shop services..."

# Start SQL Injection Login (port 3000)
cd /opt/phantom-shop/sqli-login
python3 app.py &
echo "✅ SQL Injection Login running on http://localhost:3000"

# Start XSS Blog (port 5050)
cd /opt/phantom-shop/xss-blog
npm install --silent
node server.js &
echo "✅ XSS Blog running on http://localhost:5050"

# Start Auth API (port 3002)
cd /opt/phantom-shop/auth-api
python3 app.py &
echo "✅ Auth API running on http://localhost:3002"

# Start File Upload Lab (port 6060)
cd /opt/phantom-shop/file-upload
python3 app.py &
echo "✅ File Upload Lab running on http://localhost:6060"

# Start SQLi Bypass Lab (port 7071)
cd /opt/phantom-shop/sqli-bypass
python3 app.py &
echo "✅ SQLi Bypass Lab running on http://localhost:7071"

# Start Business Logic Lab (port 9090)
cd /opt/phantom-shop/price-tamper
python3 app.py &
echo "✅ Business Logic Lab running on http://localhost:9090"

echo ""
echo "⚡ PHANTOM SHOP - All services online"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SQL Injection Login: http://localhost:3000"
echo "XSS Blog:            http://localhost:5050"
echo "Auth API:            http://localhost:3002"
echo "File Upload:         http://localhost:6060"
echo "SQLi Bypass:         http://localhost:7071"
echo "Business Logic:      http://localhost:9090"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
