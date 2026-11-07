# M98 董小姐专属音乐人应用 - 开发指南

## 项目概述

这是为电子音乐人董小姐（艺名M98）打造的专属音乐人生态系统，集成了个人作品展示、粉丝互动、AI创作助手和数据分析等功能。

## 技术架构

### 前端 (React)

- **位置**: `web_app/`
- **技术栈**: React 18, React Router, Framer Motion, Styled Components
- **端口**: 3000
- **特性**: 响应式设计，动画效果，实时数据展示

### 后端 API (Node.js)

- **位置**: `api_service/`
- **技术栈**: Express, MongoDB, Redis, Swagger
- **端口**: 4000
- **特性**: RESTful API，Swagger文档，数据缓存

### AI服务 (Python)

- **位置**: `ai_services/lyrics_generator/`
- **技术栈**: Flask, Python 3.11
- **端口**: 5000
- **特性**: 东方风格歌词生成

### 数据库

- **MongoDB**: 主数据库 (端口: 27017)
- **Redis**: 缓存服务 (端口: 6379)

## 快速开始

### 1. 环境要求

- Docker & Docker Compose
- Node.js 18+ (可选，用于本地开发)
- Python 3.11+ (可选，用于本地开发)

### 2. 启动应用

```bash
# 方式1: 使用启动脚本
./start_m98_app.sh

# 方式2: 手动启动
cd M98_DongXiaoJie
docker-compose up --build
```

### 3. 访问服务

- **粉丝网站**: <http://localhost:3000>
- **API服务**: <http://localhost:4000>
- **API文档**: <http://localhost:4000/docs>
- **AI歌词生成**: <http://localhost:5000>

## 核心功能模块

### 🎵 音乐播放器

- 实时播放统计
- 播放列表管理
- 音频控制界面
- 播放历史记录

### 👥 粉丝互动

- 粉丝留言墙
- 实时统计数据
- 社交媒体集成
- 粉丝等级系统

### 🤖 AI创作助手

- 东方风格歌词生成
- 音乐制作建议
- 创意灵感提供

### 📊 数据分析

- 听众分析
- 播放趋势
- 收入报告
- 粉丝增长

## 开发指南

### API端点

GET  /api/artist/profile     - 获取艺术家信息
GET  /api/music/releases     - 获取音乐作品
POST /api/music/:id/play     - 记录播放
GET  /api/fans/wall          - 获取粉丝互动
POST /ai/generate-lyrics     - AI歌词生成

### 环境变量

复制 `api_service/.env` 文件并根据需要修改配置。

### 数据库模型

- **Artist**: 艺术家信息
- **Release**: 音乐作品
- **Fan**: 粉丝数据
- **Content**: 内容管理

## 部署说明

### 开发环境

bash
docker-compose up

### 生产环境

bash
docker-compose -f docker-compose.prod.yml up -d

## 文件结构

M98_DongXiaoJie/
├── web_app/                 # React前端应用
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── pages/          # 页面组件
│   │   └── styles/         # 样式文件
│   └── public/             # 静态资源
├── api_service/            # Node.js后端
│   └── src/
│       ├── models/         # 数据模型
│       ├── routes/         # API路由
│       └── middleware/     # 中间件
├── ai_services/            # AI服务
│   └── lyrics_generator/   # 歌词生成器
├── admin_panel/            # Vue.js管理后台
├── mobile_app/             # React Native移动应用
└── docker-compose.yml      # Docker配置

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目为M98董小姐专属应用，版权所有。

## 联系方式

- 项目维护: [开发团队]
- 艺术家: 董小姐 (M98)
- 官方网站: [待定]
