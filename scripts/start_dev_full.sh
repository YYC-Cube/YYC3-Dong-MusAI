#!/bin/bash

# M98 董小姐音乐应用 - 完整开发环境启动脚本

echo "🚀 M98 董小姐音乐应用 - 开发环境启动"
echo "========================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查数据库是否存在
if [ ! -f "./database/m98_database.sqlite" ]; then
    echo "📦 数据库文件不存在，正在初始化..."
    cd /Users/yanyu/D-98
    if [ -f "./setup_sqlite_database.sh" ]; then
        ./setup_sqlite_database.sh
    else
        echo "❌ 找不到数据库初始化脚本"
        exit 1
    fi
    cd M98_DongXiaoJie
fi

# 检查并安装API服务依赖
echo "📦 检查API服务依赖..."
cd api_service
if [ ! -d "node_modules" ]; then
    echo "正在安装API服务依赖..."
    npm install
fi

# 启动API服务 (后台运行)
echo "🚀 启动API服务..."
node src/server-sqlite.js &
API_PID=$!
echo "API服务已启动 (PID: $API_PID)"

# 等待API服务启动
sleep 3

# 检查并安装前端依赖
echo "📦 检查前端服务依赖..."
cd ../web_app
if [ ! -d "node_modules" ]; then
    echo "正在安装前端依赖..."
    npm install
fi

# 启动前端服务
echo "🚀 启动前端服务..."
echo ""
echo "========================================"
echo "🌐 服务地址:"
echo "🎵 前端主页: http://localhost:3000"
echo "🔗 API服务: http://localhost:4000"
echo "📖 API文档: http://localhost:4000/docs"
echo "💾 数据库: SQLite"
echo ""
echo "🛑 停止服务: 按 Ctrl+C 或运行 ./stop_dev.sh"
echo "🧪 测试服务: ./test_homepage.sh"
echo "========================================"

# 启动前端服务 (前台运行，这样可以看到日志)
npm start
