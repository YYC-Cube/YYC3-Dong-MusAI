#!/bin/bash

# M98项目快速数据库配置

echo "🎵 M98项目数据库配置向导"
echo "================================"
echo ""

# 显示当前状态
echo "📊 当前状态检查:"
echo "- API服务: $(curl -s http://localhost:4000/health > /dev/null && echo '✅ 运行中' || echo '❌ 未运行')"
echo "- MongoDB: $(brew services list | grep mongodb-community | grep started > /dev/null && echo '✅ 已安装并运行' || echo '❌ 未安装或未运行')"
echo ""

echo "💡 推荐配置方案:"
echo ""
echo "🥇 方案1: MongoDB (推荐)"
echo "   优势: 最适合音乐应用，JSON原生支持"
echo "   适用: 生产环境，复杂数据结构"
echo ""
echo "🥈 方案2: 继续Mock模式"  
echo "   优势: 零配置，快速开发"
echo "   适用: 演示，原型开发"
echo ""

read -p "是否安装MongoDB？(y/n): " install_mongo

if [[ $install_mongo =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 开始安装MongoDB..."
    
    # 检查Homebrew
    if ! command -v brew &> /dev/null; then
        echo "❌ 需要先安装Homebrew"
        echo "请运行: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # 安装MongoDB
    echo "📦 正在安装MongoDB..."
    brew tap mongodb/brew 2>/dev/null
    brew install mongodb-community
    
    # 启动服务
    echo "🚀 启动MongoDB服务..."
    brew services start mongodb/brew/mongodb-community
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    sleep 5
    
    # 切换到真实数据库模式
    echo "🔄 配置API服务使用MongoDB..."
    cd /Users/yanyu/D-98/M98_DongXiaoJie/api_service
    
    # 备份当前server.js
    if [ -f "src/server.js" ]; then
        cp src/server.js src/server-backup.js
        echo "💾 已备份原server.js为server-backup.js"
    fi
    
    # 使用MongoDB版本
    cp src/server-with-db.js src/server.js
    
    # 更新package.json添加dev脚本
    if ! grep -q "\"dev\":" package.json; then
        sed -i '' 's/"start": "node src\/server.js"/"start": "node src\/server.js",\
    "dev": "nodemon src\/server.js"/' package.json
    fi
    
    # 安装nodemon（如果还没有）
    if ! npm list nodemon &>/dev/null; then
        echo "📦 安装开发依赖..."
        npm install --save-dev nodemon
    fi
    
    echo ""
    echo "✅ MongoDB配置完成！"
    echo ""
    echo "📋 下一步操作："
    echo "1. 重启API服务"
    echo "2. 数据将自动创建在MongoDB中"
    echo "3. 访问 http://localhost:4000/health 查看状态"
    echo ""
    
    read -p "是否现在重启API服务？(y/n): " restart_api
    
    if [[ $restart_api =~ ^[Yy]$ ]]; then
        echo "🔄 重启API服务..."
        
        # 查找并终止现有的Node.js进程
        pkill -f "node.*server" 2>/dev/null || true
        pkill -f "nodemon.*server" 2>/dev/null || true
        
        sleep 2
        
        # 启动新的API服务
        echo "🚀 启动MongoDB版本的API服务..."
        npm start &
        
        # 等待启动
        sleep 5
        
        # 测试连接
        echo "🧪 测试API服务..."
        if curl -s http://localhost:4000/health | grep -q "OK"; then
            echo "✅ API服务启动成功！"
            echo ""
            echo "🎉 MongoDB配置完成！"
            echo ""
            echo "📱 服务地址："
            echo "- 前端: http://localhost:3000"
            echo "- API: http://localhost:4000"
            echo "- API文档: http://localhost:4000/docs"
            echo "- 数据库: MongoDB (localhost:27017)"
        else
            echo "❌ API服务启动失败"
            echo "💡 请检查日志: npm run dev"
        fi
    fi
    
else
    echo ""
    echo "✅ 保持当前Mock模式"
    echo "💡 当前配置已经可以正常使用，无需修改"
fi

echo ""
echo "🎵 配置完成！"
