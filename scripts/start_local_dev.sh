#!/bin/bash

# M98本地开发环境启动脚本
echo "🎵 启动M98本地开发环境..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3未安装，请先安装Python3"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")/M98_DongXiaoJie"

echo "📦 安装前端依赖..."
cd web_app
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "📦 安装后端依赖..."
cd ../api_service
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "📦 安装AI服务依赖..."
cd ../ai_services/lyrics_generator
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "🚀 启动服务..."

# 启动AI服务 (后台)
echo "启动AI歌词生成服务..."
python m98_style_lyrics.py &
AI_PID=$!

# 启动API服务 (后台)
echo "启动API服务..."
cd ../../api_service
# 设置环境变量
export MONGODB_URI="mongodb://localhost:27017/m98_database"
export PORT=4000
npm run dev &
API_PID=$!

# 启动前端服务
echo "启动前端服务..."
cd ../web_app
npm start &
WEB_PID=$!

echo ""
echo "🎉 M98开发环境启动成功！"
echo ""
echo "📱 服务地址："
echo "  - 粉丝网站: http://localhost:3000"
echo "  - API服务: http://localhost:4000"
echo "  - AI歌词生成: http://localhost:5000"
echo ""
echo "⚠️  注意："
echo "  - 需要本地MongoDB服务运行在端口27017"
echo "  - 按Ctrl+C停止所有服务"
echo ""

# 等待信号停止服务
trap "echo '停止所有服务...'; kill $AI_PID $API_PID $WEB_PID 2>/dev/null; exit" INT

# 保持脚本运行
wait
