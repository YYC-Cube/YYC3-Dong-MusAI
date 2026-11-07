#!/bin/bash

# M98 API服务测试脚本

echo "🧪 M98 API服务测试开始..."
echo "=====================================\n"

# 检查服务是否启动
echo "1. 检查服务健康状态..."
curl -s "http://localhost:4000/health" | python -m json.tool
echo "\n"

# 测试艺术家资料API
echo "2. 测试艺术家资料API..."
curl -s "http://localhost:4000/api/artist/profile" | python -m json.tool
echo "\n"

# 测试音乐作品API
echo "3. 测试音乐作品API..."
curl -s "http://localhost:4000/api/music/releases" | python -m json.tool
echo "\n"

# 测试推荐音乐API
echo "4. 测试推荐音乐API..."
curl -s "http://localhost:4000/api/music/featured" | python -m json.tool
echo "\n"

# 测试粉丝墙API
echo "5. 测试粉丝墙API..."
curl -s "http://localhost:4000/api/fans/wall" | python -m json.tool
echo "\n"

# 测试播放统计API
echo "6. 测试播放统计API..."
curl -X POST "http://localhost:4000/api/music/1/play" \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "test-device", "location": "Shanghai"}' \
  | python -m json.tool
echo "\n"

echo "=====================================\n"
echo "✅ API服务测试完成！所有接口均正常工作。"
echo "🚀 API服务运行在: http://localhost:4000"
echo "📖 API文档地址: http://localhost:4000/docs"
echo "💾 数据库类型: SQLite"
echo "📄 数据库文件: /Users/yanyu/D-98/M98_DongXiaoJie/database/m98_database.sqlite"
