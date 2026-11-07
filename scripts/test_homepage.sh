#!/bin/bash

# M98 主页和API集成测试脚本

echo "🧪 M98 董小姐音乐应用 - 主页集成测试"
echo "=========================================="

# 1. 检查API服务状态
echo "1. 检查API服务状态..."
API_HEALTH=$(curl -s "http://localhost:4000/health" | python -c "import sys, json; print(json.load(sys.stdin)['status'])" 2>/dev/null)

if [ "$API_HEALTH" = "OK" ]; then
    echo "✅ API服务正常运行 (端口4000)"
else
    echo "❌ API服务未启动，请先启动API服务"
    exit 1
fi

# 2. 检查前端服务状态
echo "2. 检查前端服务状态..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" 2>/dev/null)

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ 前端服务正常运行 (端口3000)"
else
    echo "❌ 前端服务未启动，请先启动前端服务"
    exit 1
fi

# 3. 测试API数据
echo "3. 测试API数据..."

echo "   - 艺术家资料..."
ARTIST_DATA=$(curl -s "http://localhost:4000/api/artist/profile" | python -c "import sys, json; data=json.load(sys.stdin); print(data['data']['name'])" 2>/dev/null)
echo "     艺术家: $ARTIST_DATA"

echo "   - 音乐作品..."
RELEASES_COUNT=$(curl -s "http://localhost:4000/api/music/releases" | python -c "import sys, json; data=json.load(sys.stdin); print(len(data['data']['releases']))" 2>/dev/null)
echo "     作品数量: $RELEASES_COUNT 首"

echo "   - 粉丝墙..."
FANS_COUNT=$(curl -s "http://localhost:4000/api/fans/wall" | python -c "import sys, json; data=json.load(sys.stdin); print(len(data['data']))" 2>/dev/null)
echo "     粉丝留言: $FANS_COUNT 条"

# 4. 服务地址信息
echo ""
echo "=========================================="
echo "🌐 服务地址信息:"
echo "🎵 前端主页: http://localhost:3000"
echo "🔗 API服务: http://localhost:4000"
echo "📖 API文档: http://localhost:4000/docs"
echo "🏥 健康检查: http://localhost:4000/health"

echo ""
echo "📊 数据统计:"
echo "🎤 艺术家: $ARTIST_DATA"
echo "🎶 音乐作品: $RELEASES_COUNT 首"
echo "💬 粉丝留言: $FANS_COUNT 条"

echo ""
echo "🚀 测试完成！前后端服务已正常连接。"
echo "👀 请在浏览器中查看: http://localhost:3000"
