#!/bin/bash

# M98项目 - MongoDB本地安装配置脚本

echo "🎵 M98项目MongoDB数据库配置"
echo "================================"

# 检查操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "检测到macOS系统"
    
    # 检查Homebrew
    if ! command -v brew &> /dev/null; then
        echo "❌ 需要先安装Homebrew"
        echo "请访问: https://brew.sh"
        exit 1
    fi
    
    echo "📦 安装MongoDB..."
    
    # 添加MongoDB tap
    brew tap mongodb/brew
    
    # 安装MongoDB Community Edition
    brew install mongodb-community
    
    echo "🚀 启动MongoDB服务..."
    
    # 启动MongoDB服务
    brew services start mongodb/brew/mongodb-community
    
    echo "✅ MongoDB安装完成！"
    echo ""
    echo "📱 连接信息："
    echo "- 连接URL: mongodb://localhost:27017"
    echo "- 数据目录: /opt/homebrew/var/mongodb"
    echo "- 日志目录: /opt/homebrew/var/log/mongodb"
    echo ""
    echo "🔧 管理命令："
    echo "- 启动: brew services start mongodb/brew/mongodb-community"
    echo "- 停止: brew services stop mongodb/brew/mongodb-community"
    echo "- 重启: brew services restart mongodb/brew/mongodb-community"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "检测到Linux系统"
    
    # Ubuntu/Debian安装
    if command -v apt &> /dev/null; then
        echo "📦 在Ubuntu/Debian上安装MongoDB..."
        
        # 导入公钥
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        
        # 添加MongoDB源
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        
        # 更新包列表
        sudo apt-get update
        
        # 安装MongoDB
        sudo apt-get install -y mongodb-org
        
        # 启动服务
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
        echo "✅ MongoDB安装完成！"
        
    # CentOS/RHEL安装
    elif command -v yum &> /dev/null; then
        echo "📦 在CentOS/RHEL上安装MongoDB..."
        
        # 创建yum源文件
        cat > /etc/yum.repos.d/mongodb-org-7.0.repo << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
        
        # 安装MongoDB
        sudo yum install -y mongodb-org
        
        # 启动服务
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
        echo "✅ MongoDB安装完成！"
    fi
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    exit 1
fi

# 测试连接
echo ""
echo "🧪 测试数据库连接..."
sleep 3

if command -v mongosh &> /dev/null; then
    echo "use m98_database" | mongosh --quiet
    echo "✅ 数据库连接测试成功！"
elif command -v mongo &> /dev/null; then
    echo "use m98_database" | mongo --quiet
    echo "✅ 数据库连接测试成功！"
else
    echo "⚠️  MongoDB Shell未找到，但服务应该已安装"
fi

echo ""
echo "🎉 MongoDB配置完成！"
echo ""
echo "下一步："
echo "1. 修改API服务配置使用真实数据库"
echo "2. 运行数据初始化脚本"
echo "3. 重启API服务"
