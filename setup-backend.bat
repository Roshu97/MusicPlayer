@echo off
REM Music Player - Backend Setup Script
REM This script helps set up the Node.js backend for Spotify integration

echo.
echo ====================================
echo   Music Player - Backend Setup
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version
echo.

REM Check if .env file exists
if exist .env (
    echo [OK] .env file found
    echo.
    echo Do you want to keep existing .env? (Y/N)
    set /p keepenv="Enter choice: "
    if /i "%keepenv%"=="N" (
        echo Creating new .env template...
        del .env
        goto create_env
    )
) else (
    echo [INFO] .env file not found. Creating template...
    :create_env
    echo # Spotify API Credentials > .env
    echo SPOTIFY_CLIENT_ID=your_client_id_here >> .env
    echo SPOTIFY_CLIENT_SECRET=your_client_secret_here >> .env
    echo.  >> .env
    echo # Server Configuration >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo.  >> .env
    echo # CORS Settings >> .env
    echo FRONTEND_URL=http://localhost:5500 >> .env
    
    echo [OK] .env template created!
    echo.
    echo IMPORTANT: Edit .env and add your Spotify credentials:
    echo   1. Go to https://developer.spotify.com/dashboard
    echo   2. Copy your Client ID and Client Secret
    echo   3. Replace 'your_client_id_here' and 'your_client_secret_here' in .env
    echo   4. DO NOT commit .env to Git!
    echo.
    pause
)

REM Check if node_modules exists
if exist node_modules (
    echo [OK] node_modules directory found
) else (
    echo [INFO] Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Check if server.js exists
if exist server.js (
    echo [OK] server.js found
) else (
    if exist server.js.example (
        echo [INFO] Copying server.js.example to server.js...
        copy server.js.example server.js
        echo [OK] server.js created from template
    ) else (
        echo [ERROR] server.js.example not found!
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo Next steps:
echo.
echo 1. Edit .env with your Spotify credentials:
echo    - Open .env in your editor
echo    - Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
echo    - Save the file
echo.
echo 2. Start the backend server:
echo    npm start
echo.
echo 3. Test the API:
echo    Open http://localhost:3000/api/health in your browser
echo.
echo 4. Frontend should call:
echo    http://localhost:3000/api/search/:query
echo.
echo Security Reminder:
echo   - NEVER commit .env to Git
echo   - NEVER share your Client Secret
echo   - Rotate credentials every 90 days
echo   - Check .gitignore includes .env
echo.
echo Documentation:
echo   - Read BACKEND_SETUP.md for detailed guide
echo   - Read SPOTIFY_INTEGRATION.md for architecture
echo.
pause
