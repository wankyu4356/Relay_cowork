@echo off
title RELAY Cowork - Setup and Run
color 0A

echo ============================================
echo    RELAY Cowork - One-Click Setup
echo ============================================
echo.

:: Step 1 - Check Git
echo [1/5] Checking Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git is not installed.
    echo         Download from https://git-scm.com/downloads
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('git --version') do echo       %%v
echo.

:: Step 2 - Check Node.js
echo [2/5] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed.
    echo         Download LTS from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo       Node.js %%v
for /f "tokens=*" %%v in ('npm --version') do echo       npm %%v
echo.

:: Step 3 - Clone or Update
echo [3/5] Preparing repository...

set "REPO_URL=https://github.com/wankyu4356/Relay_cowork.git"
set "REPO_DIR=Relay_cowork"

:: Check if already inside the project folder
if exist "package.json" (
    findstr /c:"RELAY Figma Prototype" package.json >nul 2>&1
    if not errorlevel 1 goto ALREADY_INSIDE
)

:: Check if subfolder exists
if exist "%REPO_DIR%\.git" goto UPDATE_REPO

:: Clone fresh
echo       Cloning repository...
git clone %REPO_URL% %REPO_DIR%
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Clone failed. Check your network.
    pause
    exit /b 1
)
cd %REPO_DIR%
goto INSTALL

:ALREADY_INSIDE
echo       Already inside project folder.
echo       Pulling latest changes from GitHub...
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%b"
echo       Current branch: %CURRENT_BRANCH%
git pull origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    color 0E
    echo       [WARN] git pull failed. Running with local version.
    echo       Check your network or run "git pull origin %CURRENT_BRANCH%" manually.
)
goto INSTALL

:UPDATE_REPO
echo       Updating existing repository...
cd %REPO_DIR%
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set "CURRENT_BRANCH=%%b"
echo       Current branch: %CURRENT_BRANCH%
git pull origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    color 0E
    echo       [WARN] git pull failed. Running with local version.
    echo       Check your network or run "git pull origin %CURRENT_BRANCH%" manually.
)
goto INSTALL

:INSTALL
echo.

:: Step 4 - Install dependencies
echo [4/5] Installing packages...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo       Done!
echo.

:: Step 5 - Run dev server
echo [5/5] Starting dev server...
echo.
echo ============================================
echo    Open http://localhost:5173 in browser
echo    Press Ctrl+C to stop
echo ============================================
echo.

call npm run dev
pause
