@echo off
TITLE CHAKRA VIEW - FULL STACK ENGINE
CLS
echo  ------------------------------------------------------------------
echo  [#] CHAKRA VIEW: INTEGRATED DEVELOPMENT ENVIRONMENT
echo  ------------------------------------------------------------------
echo.

:: Check for Docker
echo [>] Verifying Docker Services...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b
)

:: Start Database in background
echo [>] Booting MySQL Database...
docker-compose up -d db

:: Start PwnBox Template (Optional but recommended)
echo [>] Preparing PwnBox Environment...
set /p rebuild="Rebuild PwnBox Image? (y/n, default: n): "
if "%rebuild%"=="y" (
    docker-compose up -d --build pwnbox
) else (
    docker-compose up -d pwnbox
)

echo [OK] Backend Core Infrastructure is Online.
echo.

:: Start Flask Backend
echo [>] Deploying Flask Backend (Port 5000)...
start "CHAKRA_BACKEND" cmd /k "cd Backend && python app.py"

:: Start React Frontend
echo [>] Launching React Interface (Port 3000)...
echo.
echo [!] Keep this window open for Frontend logs.
echo.
cd Frontend && npm start
