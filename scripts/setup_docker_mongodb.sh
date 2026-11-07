#!/bin/bash

# M98项目 - Docker MongoDB配置脚本（无需sudo权限）

echo "🎵 M98项目Docker MongoDB数据库配置"
echo "================================"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker Desktop"
    echo "💡 启动Docker Desktop后再次运行此脚本"
    exit 1
fi

echo "🐳 Docker运行正常"

# 停止并删除现有的MongoDB容器（如果存在）
echo "🧹 清理现有容器..."
docker stop m98-mongodb 2>/dev/null || true
docker rm m98-mongodb 2>/dev/null || true

# 创建数据卷（持久化数据）
echo "💾 创建数据卷..."
docker volume create m98-mongodb-data

# 启动MongoDB容器
echo "🚀 启动MongoDB容器..."
docker run -d \
  --name m98-mongodb \
  -p 27017:27017 \
  -v m98-mongodb-data:/data/db \
  -e MONGO_INITDB_DATABASE=m98_database \
  mongo:7.0

# 等待MongoDB启动
echo "⏳ 等待MongoDB启动..."
sleep 10

# 测试连接
echo "🧪 测试数据库连接..."
if docker exec m98-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB连接测试成功！"
else
    echo "⚠️  MongoDB可能还在启动中..."
fi

# 初始化数据库
echo "📊 初始化M98数据库..."
docker exec m98-mongodb mongosh m98_database --eval "
db.artists.insertOne({
    artistId: 'M98',
    name: '董小姐',
    bio: '电子音乐制作人，融合东方传统音乐元素与现代电子音乐',
    createdAt: new Date()
});
console.log('✅ 初始数据创建成功');
"

echo ""
echo "🎉 Docker MongoDB配置完成！"
echo ""
echo "📱 连接信息："
echo "- 连接URL: mongodb://localhost:27017"
echo "- 数据库名: m98_database"
echo "- 容器名: m98-mongodb"
echo ""
echo "🔧 管理命令："
echo "- 查看状态: docker ps | grep m98-mongodb"
echo "- 查看日志: docker logs m98-mongodb"
echo "- 停止服务: docker stop m98-mongodb"
echo "- 启动服务: docker start m98-mongodb"
echo "- 进入Shell: docker exec -it m98-mongodb mongosh"
echo ""
echo "💡 数据会持久化保存在Docker卷中，重启后数据不会丢失"
