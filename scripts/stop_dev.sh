#!/bin/bash

# M98 董小姐音乐应用 - 停止服务脚本

echo "🛑 正在停止M98 API服务..."

# 查找并停止占用端口4000的进程
PID=$(lsof -ti :4000)

if [ -z "$PID" ]; then
    echo "ℹ️  没有发现运行在端口4000的服务"
else
    echo "🔍 发现进程 PID: $PID"
    kill -9 $PID
    echo "✅ API服务已停止"
fi

echo "🏁 所有服务已停止"
