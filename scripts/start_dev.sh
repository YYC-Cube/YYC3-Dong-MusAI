#!/bin/bash

# M98 董小姐音乐应用 - 一键启动脚本

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

# 进入API服务目录
cd api_service

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖包..."
    npm install
fi

# 启动API服务
echo "🚀 正在启动API服务..."
echo "📍 服务地址: http://localhost:4000"
echo "📖 API文档: http://localhost:4000/docs"
echo "💾 数据库: SQLite"
echo ""
echo "按 Ctrl+C 停止服务"
echo "========================================"

node src/server-sqlite.js
