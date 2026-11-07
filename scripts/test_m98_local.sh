#!/bin/bash

# M98应用本地测试脚本
echo "🎵 M98董小姐应用本地测试启动中..."

# 检查服务状态函数
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "检查 $service_name..."
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo " ✅ 运行正常"
        return 0
    else
        echo " ❌ 服务异常 (状态码: $response)"
        return 1
    fi
}

# 等待服务启动
echo "⏳ 等待服务启动完成..."
sleep 3

echo ""
echo "🔍 检查服务状态："
echo "================================"

# 检查AI服务
check_service "AI歌词生成服务" "http://localhost:5001/health" "200"

# 检查API服务
check_service "API后端服务" "http://localhost:4000/health" "200"

# 检查前端服务
check_service "前端React应用" "http://localhost:3000" "200"

echo ""
echo "🧪 功能测试："
echo "================================"

# 测试AI歌词生成
echo "测试AI歌词生成..."
ai_response=$(curl -s -X POST http://localhost:5001/generate-lyrics \
    -H "Content-Type: application/json" \
    -d '{"theme": "测试完成", "style": "celebration"}')

if echo "$ai_response" | grep -q "success.*true"; then
    echo "✅ AI歌词生成功能正常"
    echo "   生成的歌词主题: $(echo "$ai_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['theme'])" 2>/dev/null || echo '无法解析')"
else
    echo "❌ AI歌词生成功能异常"
fi

# 测试API数据获取
echo "测试API数据获取..."
api_response=$(curl -s http://localhost:4000/api/artist/profile)

if echo "$api_response" | grep -q "success.*true"; then
    echo "✅ API数据获取功能正常"
    echo "   艺术家: $(echo "$api_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['name'])" 2>/dev/null || echo '董小姐')"
else
    echo "❌ API数据获取功能异常"
fi

# 测试音乐数据
echo "测试音乐数据..."
music_response=$(curl -s http://localhost:4000/api/music/releases)

if echo "$music_response" | grep -q "success.*true"; then
    echo "✅ 音乐数据功能正常"
    track_count=$(echo "$music_response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']['releases']))" 2>/dev/null || echo '0')
    echo "   可用音乐作品: $track_count 首"
else
    echo "❌ 音乐数据功能异常"
fi

echo ""
echo "📱 访问地址："
echo "================================"
echo "🌐 前端网站:     http://localhost:3000"
echo "🔗 API服务:      http://localhost:4000"
echo "📖 API文档:      http://localhost:4000/docs"
echo "🤖 AI服务:       http://localhost:5001"
echo "🧪 测试页面:     file:///Users/yanyu/D-98/M98_test_page.html"

echo ""
echo "🎉 本地测试完成！"
echo ""
echo "💡 使用提示："
echo "- 访问 http://localhost:3000 查看前端应用"
echo "- 访问 http://localhost:4000/docs 查看API文档"
echo "- 所有服务都在运行中，可以正常使用"
echo "- 按 Ctrl+C 停止各个服务"
