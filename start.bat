@echo off
chcp 65001 >nul 2>&1
title RELAY Cowork - One-Click Setup & Run
color 0A

echo ============================================
echo    RELAY Cowork - One-Click Setup
echo ============================================
echo.

:: ── 1. Git 체크 ──
echo [1/5] Git 확인 중...
where git >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git이 설치되어 있지 않습니다.
    echo         https://git-scm.com/downloads 에서 설치해주세요.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('git --version') do echo       %%v
echo.

:: ── 2. Node.js 체크 ──
echo [2/5] Node.js 확인 중...
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo         https://nodejs.org 에서 LTS 버전을 설치해주세요.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo       Node.js %NODE_VER%
for /f "tokens=*" %%v in ('npm --version') do echo       npm %%v

:: Node 18+ 확인
for /f "tokens=2 delims=v." %%a in ("%NODE_VER%") do set NODE_MAJOR=%%a
if %NODE_MAJOR% lss 18 (
    color 0E
    echo [WARN] Node.js 18 이상을 권장합니다. 현재: %NODE_VER%
)
echo.

:: ── 3. 클론 또는 업데이트 ──
echo [3/5] 저장소 준비 중...
set REPO_URL=https://github.com/wankyu4356/Relay_cowork.git
set REPO_DIR=Relay_cowork

:: 이미 프로젝트 폴더 안에서 실행 중인지 확인
if exist "package.json" (
    findstr /c:"RELAY Figma Prototype" package.json >nul 2>&1
    if %errorlevel% equ 0 (
        echo       이미 프로젝트 폴더 안에 있습니다. 최신 코드를 가져옵니다...
        git pull origin main 2>nul || echo       [INFO] pull 실패 - 오프라인이거나 권한 문제일 수 있습니다.
        goto :INSTALL
    )
)

:: 폴더가 이미 있으면 pull, 없으면 clone
if exist "%REPO_DIR%\.git" (
    echo       기존 저장소를 업데이트합니다...
    cd %REPO_DIR%
    git pull origin main 2>nul || echo       [INFO] pull 실패 - 오프라인이거나 권한 문제일 수 있습니다.
) else (
    echo       저장소를 클론합니다...
    git clone %REPO_URL% %REPO_DIR%
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] 클론에 실패했습니다. URL 또는 네트워크를 확인해주세요.
        pause
        exit /b 1
    )
    cd %REPO_DIR%
)
echo.

:INSTALL
:: ── 4. 의존성 설치 ──
echo [4/5] 패키지 설치 중... (처음엔 시간이 걸릴 수 있습니다)
if exist "node_modules\.package-lock.json" (
    echo       node_modules가 이미 있습니다. 변경사항만 확인합니다...
)
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] npm install 실패. 로그를 확인해주세요.
    pause
    exit /b 1
)
echo       설치 완료!
echo.

:: ── 5. 개발 서버 실행 ──
echo [5/5] 개발 서버를 시작합니다...
echo.
echo ============================================
echo    브라우저에서 http://localhost:5173 을 열어주세요
echo    종료하려면 Ctrl+C 를 누르세요
echo ============================================
echo.

call npm run dev
pause
