# ============================================================
# YYC³（YanYuCloudCube™ · 注册商标）
# 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
# 万象归元于云枢 | 深栈智启新纪元
# All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
# ============================================================
# Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
# ============================================================
FROM node:22-alpine

WORKDIR /app

# sqlite3 在无预编译包时需要构建工具
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health >/dev/null || exit 1

CMD ["npm", "start"]
