#!/bin/bash

# M98 API 服务测试脚本（PostgreSQL）

echo "M98 API 服务测试开始..."
echo "====================================="

echo "1. 健康检查..."
curl -s "http://localhost:4000/health" | python3 -m json.tool
echo ""

echo "2. 艺人资料..."
curl -s "http://localhost:4000/api/artist/profile" | python3 -m json.tool
echo ""

echo "3. 音乐作品..."
curl -s "http://localhost:4000/api/music/releases" | python3 -m json.tool
echo ""

echo "4. 推荐音乐..."
curl -s "http://localhost:4000/api/music/featured" | python3 -m json.tool
echo ""

echo "5. 粉丝墙..."
curl -s "http://localhost:4000/api/fans/wall" | python3 -m json.tool
echo ""

echo "6. 独家内容..."
curl -s "http://localhost:4000/api/content/exclusive" | python3 -m json.tool
echo ""

echo "7. 博客文章..."
curl -s "http://localhost:4000/api/content/blog" | python3 -m json.tool
echo ""

echo "8. 活动..."
curl -s "http://localhost:4000/api/content/events" | python3 -m json.tool
echo ""

echo "9. 播放统计..."
curl -X POST "http://localhost:4000/api/music/1/play" \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "test-device", "location": "Shanghai"}' \
  | python3 -m json.tool
echo ""

echo "====================================="
echo "API 服务测试完成"
echo "服务地址: http://localhost:4000"
echo "API 文档: http://localhost:4000/docs"
echo "数据库: PostgreSQL ${PGDATABASE:-yyc3_music} (schema: ${PGSCHEMA:-m98})"
