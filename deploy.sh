#!/usr/bin/env bash
# ==============================================================================
# 🚀 WordPulse (单词消消乐与情境故事记忆) 一键自动部署脚本
# 支持系统: Ubuntu / Debian / CentOS / macOS / 任何安装了 Node.js 18+ 的 Linux 服务器
# ==============================================================================

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}🌟 正在启动 WordPulse 全栈应用部署流程...${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. 检测 Node.js 和 npm
echo -e "\n${YELLOW}[1/5] 检查运行环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未检测到 Node.js，请先安装 Node.js 18+ (推荐 Node.js 20/22 LTS)${NC}"
    echo "💡 Ubuntu/Debian 快速安装: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 版本: ${NODE_VERSION}${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未检测到 npm${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 2. 配置环境变量
echo -e "\n${YELLOW}[2/5] 检查环境变量配置文件 .env ...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}未检测到 .env 文件，正在从模板生成...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        cat << 'EOF' > .env
PORT=3000
NODE_ENV=production
# 如果需要开启 AI 智能造句和单词联想，请填入 Gemini API Key：
GEMINI_API_KEY=
EOF
    fi
    echo -e "${GREEN}✓ 已创建 .env 文件（端口默认 3000）${NC}"
else
    echo -e "${GREEN}✓ .env 文件已存在${NC}"
fi

# 3. 安装依赖
echo -e "\n${YELLOW}[3/5] 正在安装项目依赖 (npm install)...${NC}"
npm install --production=false
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 4. 生产环境构建
echo -e "\n${YELLOW}[4/5] 正在编译前端 SPA 与后端服务端 (npm run build)...${NC}"
npm run build
echo -e "${GREEN}✓ 生产环境编译打包完成 (产物位于 dist/)${NC}"

# 5. 启动或重启服务
echo -e "\n${YELLOW}[5/5] 配置服务启动方案...${NC}"

# 检测是否安装了 PM2
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}检测到已安装 PM2 进程守护工具，正在通过 PM2 管理运行...${NC}"
    if pm2 describe wordpulse &> /dev/null; then
        echo -e "${YELLOW}重启正在运行的 wordpulse 服务...${NC}"
        pm2 reload ecosystem.config.cjs --env production || pm2 restart wordpulse
    else
        echo -e "${GREEN}创建并启动 wordpulse 守护进程...${NC}"
        pm2 start ecosystem.config.cjs --env production
    fi
    pm2 save
    echo -e "${GREEN}✓ PM2 托管成功！${NC}"
else
    echo -e "${YELLOW}未安装 PM2，尝试使用 npm 全局安装 PM2 以提供后台自愈守护...${NC}"
    if npm install -g pm2 &> /dev/null; then
        pm2 start ecosystem.config.cjs --env production
        pm2 save
        echo -e "${GREEN}✓ PM2 已安装并成功托管服务！${NC}"
    else
        echo -e "${YELLOW}使用后台 nohup 模式直接启动...${NC}"
        pkill -f "node dist/server.cjs" || true
        NODE_ENV=production nohup node dist/server.cjs > server.log 2>&1 &
        echo -e "${GREEN}✓ 已在后台启动服务 (PID: $!)，日志请查看 server.log${NC}"
    fi
fi

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}🎉 恭喜！WordPulse 部署成功！${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "🌐 本地访问地址: ${GREEN}http://localhost:3000${NC}"
echo -e "🌐 服务器外网访问: ${GREEN}http://你的服务器IP:3000${NC}"
echo -e "📜 查看运行日志: ${YELLOW}pm2 logs wordpulse${NC} 或 ${YELLOW}tail -f server.log${NC}"
echo -e "🛑 停止服务: ${YELLOW}pm2 stop wordpulse${NC}"
echo -e "${BLUE}======================================================${NC}"
