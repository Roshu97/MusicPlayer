#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Music Player Backend Setup Script
    
.DESCRIPTION
    Automated setup for Node.js backend with Spotify API integration
    
.EXAMPLE
    .\setup-backend.ps1
#>

param()

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Main script
Write-Header "Music Player - Backend Setup"

# Check Node.js
Write-Info "Checking Node.js..."
try {
    $nodeVersion = node --version
    Write-Success "Node.js is installed: $nodeVersion"
}
catch {
    Write-Error "Node.js is not installed!"
    Write-Host ""
    Write-Host "Please download Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check .env file
if (Test-Path .env) {
    Write-Success ".env file found"
    Write-Host ""
    
    $keepEnv = Read-Host "Keep existing .env? (Y/N)"
    if ($keepEnv -ne "Y" -and $keepEnv -ne "y") {
        Write-Info "Creating new .env template..."
        Remove-Item .env -Force
        
        @"
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings (frontend URL)
FRONTEND_URL=http://localhost:5500
"@ | Set-Content .env
        
        Write-Success ".env template created!"
    }
} else {
    Write-Info ".env file not found. Creating template..."
    Write-Host ""
    
    @"
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings (frontend URL)
FRONTEND_URL=http://localhost:5500
"@ | Set-Content .env
    
    Write-Success ".env template created!"
    Write-Host ""
    Write-Warning "IMPORTANT: Edit .env and add your Spotify credentials:"
    Write-Host "  1. Go to https://developer.spotify.com/dashboard"
    Write-Host "  2. Create new application"
    Write-Host "  3. Copy Client ID and Client Secret"
    Write-Host "  4. Update .env with your credentials"
    Write-Host "  5. DO NOT commit .env to Git!"
    Write-Host ""
    Read-Host "Press Enter to continue"
}

Write-Host ""

# Install dependencies
if (Test-Path node_modules) {
    Write-Success "node_modules directory found"
} else {
    Write-Info "Installing dependencies..."
    Write-Host ""
    
    & npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed!"
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Success "Dependencies installed successfully!"
}

Write-Host ""

# Setup server.js
if (Test-Path server.js) {
    Write-Success "server.js found"
} else {
    if (Test-Path server.js.example) {
        Write-Info "Copying server.js.example to server.js..."
        Copy-Item server.js.example server.js
        Write-Success "server.js created from template"
    } else {
        Write-Error "server.js.example not found!"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""

Write-Header "Setup Complete!"

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit .env with your Spotify credentials:"
Write-Host "   - Open .env in your editor"
Write-Host "   - Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET"
Write-Host "   - Save the file"
Write-Host ""
Write-Host "2. Start the backend server:"
Write-Host "   npm start"
Write-Host ""
Write-Host "3. Test the API:"
Write-Host "   Open http://localhost:3000/api/health in your browser"
Write-Host ""
Write-Host "4. Frontend should call:"
Write-Host "   http://localhost:3000/api/search/:query"
Write-Host ""
Write-Host "Security Reminder:" -ForegroundColor Yellow
Write-Host "   - NEVER commit .env to Git"
Write-Host "   - NEVER share your Client Secret"
Write-Host "   - Rotate credentials every 90 days"
Write-Host "   - Check .gitignore includes .env"
Write-Host ""
Write-Host "Documentation:"
Write-Host "   - Read BACKEND_SETUP.md for detailed guide"
Write-Host "   - Read SPOTIFY_INTEGRATION.md for architecture"
Write-Host ""
Read-Host "Press Enter to exit"
