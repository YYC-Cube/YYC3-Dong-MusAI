# 变更日志

本项目遵循 [Semantic Versioning](https://semver.org/) 与 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

---

## [Unreleased]

### 计划

- 移除 `server.js` 重复监听
- 修正 `docker-compose.yml` 中不存在的 AI 服务
- 数据源收敛为单一事实源
- 列表接口参数校验与限流
- `.env` 密钥治理与 `.env.example`

---

## [1.2.0] - 2026-11-07

### 新增

- 新建 `admin_panel/`：Vue 3 + Vite 7 + TypeScript 管理后台
- `Dashboard.vue` 迁移并修复：`StatCard`、`LineChart`、`ActivityFeed` 三个组件与暗色响应式主题
- 登录页、Pinia 鉴权 Store、路由守卫、Axios Token 拦截器与 401 自动登出
- 后端新增 `POST /api/auth/login`、`GET /api/auth/me`、`GET /api/admin/dashboard`（JWT 保护）
- 新增 7 个后端测试（鉴权 5 + 仪表盘 2），测试总数 14

### 变更

- 删除根目录 `Dashboard.vue.bak`，正式迁移至 `admin_panel/src/views/Dashboard.vue`
- 管理后台开发端口 3032，构建产物 173 KB JS / 14.4 KB CSS

### 安全

- 开发默认账号 `admin` / `m98-admin-dev`；生产必须注入 `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `JWT_SECRET`

---

## [1.1.2] - 2026-11-07

### 文档

- 确认本地 PostgreSQL 15 连接：`yanyu@localhost:5433`，本机 trust/peer 免密，数据库 `yyc3_music`
- 确认 NAS `musai` 栈（backend/frontend/mysql/redis）为另一套并行服务，本项目目标保持 `yyc3-music`（PG15）
- 记录管理后台原型 `Dashboard.vue.bak` 的缺陷：`this..push` 语法错误、缺少 3 个组件、无样式与接口

### 变更

- `.env.example` 的 `PGUSER` 更新为 `yanyu`，本机 `PGPASSWORD` 留空

---

## [1.1.1] - 2026-11-07

### 文档

- 16 篇设计规划文档统一命名，补齐 `audience` / `complexity` / `project` / `phase` 字段，编入 01/02/03 阶段目录
- 删除 17 篇冗余或与音乐项目无关的历史文档（MCP 指南、旧总结、旧测试页等），治理决策在 [docs/README.md](docs/README.md) 留痕
- 架构、环境、部署、测试、安全文档同步 PostgreSQL 15 数据源决策
- 统一修正 `Mucis` 拼写为 `Music`，标题与 H1 对齐

### 变更

- 数据源正式确定为 **PostgreSQL 15**：本地 `yyc3_music:5433`，NAS Docker `yyc3-music`，音乐 API 通道 `ssh yyc3-45`
- `.env.example` 增加 `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD`，MongoDB / SQLite 标记为遗留

### 基础设施

- 初始化 Git 仓库并建立基线提交 `116344b`
- `.gitignore` 增加依赖、构建产物、日志、Python 缓存与 macOS 文件

---

## [1.1.0] - 2026-11-07

### 新增

- `web_app/src/config/assets.js`：全局资产清单，统一 Logo、封面、海报、曲库与多端图标引用
- `web_app/public/manifest.json`：PWA 清单，接入真实应用图标
- 播放器接入 `<audio>`：真实播放/暂停、进度跳转、音量、自动续播
- `docs/` 十二阶段文档体系：15 篇标准文档与目录索引
- 开源治理文件：`LICENSE`、`CODE_OF_CONDUCT.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CHANGELOG.md`
- 根 `README.md`：顶图、徽章、资产体系、文档矩阵、路线图与仓库关键词

### 变更

- 前端所有 `/assets/**` 引用改为 `public/D-*` 真实资产
- `index.html` favicon / OG / Apple Touch Icon 指向真实资产
- 导航栏展示品牌 Logo
- `HomePage` 曲库与封面切换到本地资产，播放列表统一为 11 首

### 修复

- 修复媒体资源全量 404 问题
- 修复播放器“仅模拟进度、无真实音频”问题
- 修复粉丝墙、独家内容、社交与演出卡片的破图回退

### 文档

- 新增 [全维度调研报告](docs/04-YYC3-项目测试-审核阶段/0401-YYC3-项目测试-全维度调研报告.md)
- 新增 [测试方案与用例](docs/04-YYC3-项目测试-审核阶段/0402-YYC3-项目测试-测试方案与用例.md)
- 新增 [安全审计报告](docs/07-YYC3-项目合规-安全保障/0701-YYC3-项目合规-安全审计报告.md)
- 新增 [技术债与演进路线](docs/11-YYC3-智能演进-优化阶段/1101-YYC3-智能演进-技术债与演进路线.md)

---

## [1.0.0] - 2025-07-06

### 新增

- 艺术家主页、作品列表、粉丝墙、独家内容、虚拟演出、数据看板、社交聚合
- Express API：artist / music / fans / content 四组路由
- MongoDB 模型 `Artist`、`Release`
- SQLite 演示入口与数据库结构
- Swagger API 文档
- Docker / docker-compose 基础配置

### 已知问题

- `server.js` 重复监听
- compose 引用不存在的 AI 服务
- 前端媒体资源路径失效
- 密钥硬编码
- 仓库无版本控制

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
