#!/usr/bin/env bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}   RELAY Cowork - One-Click Setup${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

REPO_URL="https://github.com/wankyu4356/Relay_cowork.git"
REPO_DIR="Relay_cowork"

# ── 1. Git 체크 ──
echo -e "${GREEN}[1/5]${NC} Git 확인 중..."
if ! command -v git &>/dev/null; then
    echo -e "${RED}[ERROR] Git이 설치되어 있지 않습니다.${NC}"
    echo "  macOS: brew install git"
    echo "  Ubuntu: sudo apt install git"
    exit 1
fi
echo "      $(git --version)"
echo ""

# ── 2. Node.js 체크 ──
echo -e "${GREEN}[2/5]${NC} Node.js 확인 중..."
if ! command -v node &>/dev/null; then
    echo -e "${RED}[ERROR] Node.js가 설치되어 있지 않습니다.${NC}"
    echo "  https://nodejs.org 에서 LTS 버전을 설치해주세요."
    echo "  또는: brew install node / nvm install --lts"
    exit 1
fi

NODE_VER=$(node --version)
NPM_VER=$(npm --version)
echo "      Node.js $NODE_VER"
echo "      npm $NPM_VER"

NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${YELLOW}[WARN] Node.js 18 이상을 권장합니다. 현재: $NODE_VER${NC}"
fi
echo ""

# ── 3. 클론 또는 업데이트 ──
echo -e "${GREEN}[3/5]${NC} 저장소 준비 중..."

# 이미 프로젝트 폴더 안에서 실행 중인지 확인
if [ -f "package.json" ] && grep -q "RELAY Figma Prototype" package.json 2>/dev/null; then
    echo "      이미 프로젝트 폴더 안에 있습니다. 최신 코드를 가져옵니다..."
    git pull origin main 2>/dev/null || echo "      [INFO] pull 실패 - 오프라인이거나 권한 문제일 수 있습니다."
elif [ -d "$REPO_DIR/.git" ]; then
    echo "      기존 저장소를 업데이트합니다..."
    cd "$REPO_DIR"
    git pull origin main 2>/dev/null || echo "      [INFO] pull 실패 - 오프라인이거나 권한 문제일 수 있습니다."
else
    echo "      저장소를 클론합니다..."
    git clone "$REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
fi
echo ""

# ── 4. 의존성 설치 ──
echo -e "${GREEN}[4/5]${NC} 패키지 설치 중..."
if [ -d "node_modules" ]; then
    echo "      node_modules가 이미 있습니다. 변경사항만 확인합니다..."
fi
npm install
echo "      설치 완료!"
echo ""

# ── 5. 개발 서버 실행 ──
echo -e "${GREEN}[5/5]${NC} 개발 서버를 시작합니다..."
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "   브라우저에서 ${GREEN}http://localhost:5173${NC} 을 열어주세요"
echo -e "   종료하려면 ${YELLOW}Ctrl+C${NC} 를 누르세요"
echo -e "${CYAN}============================================${NC}"
echo ""

npm run dev
