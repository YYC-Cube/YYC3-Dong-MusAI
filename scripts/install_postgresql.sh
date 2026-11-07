#!/bin/bash

# M98项目 - PostgreSQL本地安装配置脚本

echo "🎵 M98项目PostgreSQL数据库配置"
echo "================================"

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📦 在macOS上安装PostgreSQL..."
    
    # 安装PostgreSQL
    brew install postgresql@15
    
    # 启动服务
    brew services start postgresql@15
    
    # 创建数据库和用户
    createdb m98_database
    psql m98_database -c "CREATE USER m98_user WITH PASSWORD 'M98_secure_2024';"
    psql m98_database -c "GRANT ALL PRIVILEGES ON DATABASE m98_database TO m98_user;"
    
    echo "✅ PostgreSQL安装完成！"
    echo ""
    echo "📱 连接信息："
    echo "- 主机: localhost"
    echo "- 端口: 5432"
    echo "- 数据库: m98_database"
    echo "- 用户: m98_user"
    echo "- 密码: M98_secure_2024"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 在Linux上安装PostgreSQL..."
    
    # Ubuntu/Debian
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
        
        # 启动服务
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
        
        # 配置数据库
        sudo -u postgres psql -c "CREATE DATABASE m98_database;"
        sudo -u postgres psql -c "CREATE USER m98_user WITH PASSWORD 'M98_secure_2024';"
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE m98_database TO m98_user;"
    fi
fi

echo ""
echo "🎉 PostgreSQL配置完成！"
