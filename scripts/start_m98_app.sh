#!/bin/bash

# M98项目启动脚本
echo "🎵 启动M98董小姐音乐人应用..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")/M98_DongXiaoJie"

echo "🔧 构建并启动服务..."

# 停止现有容器（如果有）
docker-compose down

# 构建并启动所有服务
docker-compose up --build -d

echo "⏳ 等待服务启动..."
sleep 15

# 检查服务状态
echo "📊 检查服务状态..."
docker-compose ps

# 显示访问地址
echo ""
echo "🎉 M98应用启动成功！"
echo ""
echo "📱 服务地址："
echo "  - 粉丝网站: http://localhost:3000"
echo "  - API服务: http://localhost:4000"
echo "  - API文档: http://localhost:4000/docs"
echo "  - 数据库: mongodb://localhost:27017"
echo ""
echo "🔧 管理命令："
echo "  - 查看日志: docker-compose logs -f [service_name]"
echo "  - 停止服务: docker-compose down"
echo "  - 重启服务: docker-compose restart [service_name]"
echo ""
echo "💡 开发提示："
echo "  - 前端代码修改会自动热重载"
echo "  - 后端代码修改需要重启API服务"
echo "  - 数据库数据会持久化保存"
