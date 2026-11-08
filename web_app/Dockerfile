# ============================================================
# YYC³（YanYuCloudCube™ · 注册商标）
# 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
# 万象归元于云枢 | 深栈智启新纪元
# All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
# ============================================================
# Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
# ============================================================
# Web 前端多阶段构建：Vite 8 → Nginx
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:4000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY web_app/package*.json ./
RUN npm ci

COPY web_app/ ./
# 根 public/ 为资产唯一事实源，供 sync-assets.js 同步
COPY public/ /public/
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
