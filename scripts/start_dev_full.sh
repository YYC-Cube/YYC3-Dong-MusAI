#!/bin/bash
set -e

# M98 董小姐音乐应用 - 完整开发环境启动（API + Web）

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "M98 董小姐音乐应用 - 完整开发环境启动"
echo "========================================"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 未安装，请先安装 Node.js"
  exit 1
fi

PGHOST_VALUE="${PGHOST:-localhost}"
PGPORT_VALUE="${PGPORT:-5433}"
PGUSER_VALUE="${PGUSER:-yanyu}"

if ! pg_isready -h "$PGHOST_VALUE" -p "$PGPORT_VALUE" -U "$PGUSER_VALUE" >/dev/null 2>&1; then
  echo "PostgreSQL 未就绪: ${PGUSER_VALUE}@${PGHOST_VALUE}:${PGPORT_VALUE}"
  exit 1
fi

cd api_service
if [ ! -d "node_modules" ]; then
  echo "安装 API 依赖..."
  npm install
fi

npm run pg:migrate
if [ -f "$ROOT/database/m98_database.sqlite" ]; then
  ARTIST_COUNT=$(psql -h "$PGHOST_VALUE" -p "$PGPORT_VALUE" -U "$PGUSER_VALUE" \
    -d "${PGDATABASE:-yyc3_music}" -tAc "SELECT count(*) FROM m98.artists" 2>/dev/null || echo 0)
  if [ "$ARTIST_COUNT" = "0" ]; then
    npm run pg:import
  fi
fi
npm run pg:seed:content

echo "启动 API 服务..."
npm start &
API_PID=$!
trap 'kill "$API_PID" 2>/dev/null || true' EXIT

sleep 2

cd "$ROOT/web_app"
if [ ! -d "node_modules" ]; then
  echo "安装 Web 依赖..."
  npm install
fi

echo ""
echo "========================================"
echo "前端主页: http://localhost:3000"
echo "API 服务: http://localhost:4000"
echo "API 文档: http://localhost:4000/docs"
echo "数据库: PostgreSQL ${PGDATABASE:-yyc3_music} (schema: ${PGSCHEMA:-m98})"
echo "停止服务: Ctrl+C"
echo "========================================"

npm start
