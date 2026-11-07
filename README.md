<p align="center">
  <img src="./public/D-MusAI.png" alt="M98 董小姐 · 音乐宇宙" width="100%">
</p>

<p align="center">
  <img src="./public/D-Music-icons/logo.svg" alt="YYC³ · M98 品牌标识" width="88" height="88">
</p>

<h1 align="center">M98 董小姐音乐宇宙</h1>

<p align="center">
  <b>电子 × 东方 × 未来</b><br>
  <i>Electronic × Oriental × Future</i>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-8A2BE2?style=flat-square" alt="License"></a>
  <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/version-v1.1.0-FF6B6B?style=flat-square" alt="Version"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/express-4.18-000000?style=flat-square&logo=express&logoColor=white" alt="Express"></a>
  <a href="./docs/README.md"><img src="https://img.shields.io/badge/docs-YYC%C2%B3%20standard-00A1D6?style=flat-square" alt="Docs"></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"></a>
  <a href="./SECURITY.md"><img src="https://img.shields.io/badge/security-policy-critical?style=flat-square" alt="Security"></a>
</p>

<p align="center">
  <a href="#-项目画像">项目画像</a> ·
  <a href="#-核心能力">核心能力</a> ·
  <a href="#-快速开始">快速开始</a> ·
  <a href="#-资产体系">资产体系</a> ·
  <a href="#-文档矩阵">文档矩阵</a> ·
  <a href="#-贡献与治理">贡献与治理</a>
</p>

---

## 一句话画像

> 一个以「东方电子音乐」为灵魂、以数字空间为载体的音乐人生态：**可看、可听、可互动、可度量、可演进**。

| 属性 | 内容 |
| ---- | ---- |
| 项目名 | M98 董小姐音乐宇宙（M98_DongXiaoJie） |
| 艺人 | 董小姐（艺名 M98） |
| 定位 | 音乐人官网 + 粉丝社区 + 数据洞察 + AI 创作展示 |
| 技术栈 | React 18 · Express 4 · MongoDB / SQLite · Docker |
| 当前阶段 | 演示级可用，工程化推进中 |
| 品牌主色 | `#8A2BE2` 紫罗兰 × `#FF6B6B` 珊瑚红 × `#0D1117` 深空黑 |

**核心标签**：`东方电子` `音乐人生态` `粉丝互动` `React SPA` `Express API` `YYC³`

---

## ✨ 核心能力

| 模块 | 能力 | 状态 |
| ---- | ---- | :--: |
| 艺术家主页 | 资料、哲学语录、统计、社交入口 | ✅ |
| 音乐作品 | 11 首曲库、作品卡片、本地封面 | ✅ |
| 播放器 | 真实音频、播放/暂停、切歌、进度、音量 | ✅ |
| 粉丝互动 | 留言墙、点赞 | 🟡 |
| 独家内容 | 幕后、试听、锁定权益 | 🟡 |
| 虚拟演出 | VR / 直播 / 音乐节 | 🟡 |
| 数据看板 | 听众、播放、收入示意 | 🟡 |
| 社交聚合 | 微博 / 抖音 / B站 / 小红书 | 🟡 |
| 管理后台 | 内容发布与运营 | ⬜ 规划中 |
| 移动端 | iOS / Android | ⬜ 规划中 |
| AI 创作 | 歌词 / 旋律生成 | 🟡 展示层 |
| 天气 MCP | Python FastMCP 助手 | ✅ 独立 |

---

## 🏗 架构总览

```text
┌──────────────────────────────────────────────────────────────┐
│                        浏览器 / 移动端                        │
│   React 18 SPA · framer-motion · styled-components            │
│   HomePage → components/advanced/* → services/apiService      │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP / JSON
┌───────────────────────────▼──────────────────────────────────┐
│                    Express API（:4000）                       │
│   /api/artist  /api/music  /api/fans  /api/content            │
│   helmet · cors · rate-limit · swagger                        │
├──────────────────────────────────────────────────────────────┤
│   数据访问：Mongoose → MongoDB ｜ sqlite3 → SQLite ｜ Mock     │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│   public/D-*  品牌 · 封面 · 海报 · 音乐 · 多端图标            │
└──────────────────────────────────────────────────────────────┘
```

### 目录结构

```text
M-DongXiaoJie/
├── web_app/          React 18 粉丝网站
├── api_service/      Express API（Mongo / SQLite / Mock）
├── content_db/       开发数据库与种子数据
├── database/         运行期 SQLite
├── admin_panel/      管理后台（规划中）
├── mobile_app/       移动端（规划中）
├── marketing_tools/  营销自动化（规划中）
├── weather/          Python MCP 天气助手
├── scripts/          启动 / 测试 / 数据库脚本
├── public/           品牌、封面、海报、音乐、多端图标
├── brand_assets/     品牌指南
└── docs/             十二阶段文档体系
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18（推荐 20 / 22 LTS）
- npm ≥ 9
- MongoDB ≥ 6 或 SQLite 3（二选一）

### 启动

```bash
# 1. 后端（本地推荐 SQLite）
cd api_service
npm install
node src/server-sqlite.js

# 2. 前端（另开终端）
cd web_app
npm install
npm start

# 3. 访问
# Web       http://localhost:3000
# API       http://localhost:4000
# API Docs  http://localhost:4000/docs
# Health    http://localhost:4000/health
```

### 一键脚本

```bash
./scripts/start_dev.sh
./scripts/stop_dev.sh
./scripts/test_api.sh
```

> 完整环境说明见 [开发环境指南](./docs/03-YYC3-项目开发-实施阶段/0302-YYC3-项目开发-开发环境指南.md)。

---

## 🎨 资产体系

所有品牌、视觉与音频资产统一存放在 `public/`，代码侧通过 [`web_app/src/config/assets.js`](./web_app/src/config/assets.js) 引用。

| 资产 | 预览 | 路径 |
| ---- | ---- | ---- |
| 品牌主图 | <img src="./public/D-MusAI.png" width="220"> | `public/D-MusAI.png` |
| Logo | <img src="./public/D-Music-icons/logo.svg" width="64"> | `public/D-Music-icons/logo.svg` |
| 封面（8） | <img src="./public/D-cover/D-cover-01.jpg" width="72"> | `public/D-cover/` |
| 海报（6） | <img src="./public/D-poster/D-poster-01.jpg" width="72"> | `public/D-poster/` |
| 音乐（11） | 🎵 | `public/D-Music/` |
| 多端图标 | <img src="./public/D-Music-icons/android/playstore-icon.png" width="48"> | `public/D-Music-icons/` |

**曲库**

| # | 曲目 | 艺人 |
| :-: | ---- | ---- |
| 01 | 奉陪 | 董小姐 & 沫言 |
| 02 | 时光 | 董小姐 & 沫言 |
| 03 | 浮生如渡 | 董小姐 & 沫言 |
| 04 | 渡心时序 | 董小姐 & 沫言 |
| 05 | 岁月如歌 | 董小姐 & 沫言 |
| 06 | 岁月如歌 | 董小姐 |
| 07 | 我是渡船也是过客 | 董小姐 |
| 08 | 我的宝贝 | 董小姐 |
| 09 | 秋风不问梧桐意 | 董小姐 |
| 10 | 过客 | 董小姐 |
| 11 | 除了你 | 董小姐 |

> 引用规范见 [资源引用规范](./docs/08-YYC3-项目整合-实施阶段/0801-YYC3-项目整合-资源引用规范.md)，资产登记见 [媒体资产清单](./docs/09-YYC3-项目资产-知识管理/0901-YYC3-项目资产-媒体资产清单.md)。

> **资产同步**：CRA 仅服务 `web_app/public`，`npm start` / `npm run build` 会通过 `prestart` / `prebuild` 自动执行 `scripts/sync-assets.js`，把根 `public/` 的白名单资产同步过去；也可手动执行 `npm run sync:assets`。

---

## 📚 文档矩阵

| 阶段 | 文档 | 说明 |
| ---- | ---- | ---- |
| 00 总览 | [项目总览手册](./docs/00-YYC3-项目总览-目录索引/001-YYC3-项目总览-项目总览手册.md) | 画像与导航 |
| 01 规划 | [项目章程与愿景](./docs/01-YYC3-项目规划-启动阶段/0101-YYC3-项目规划-项目章程与愿景.md) | 目标与治理 |
| 02 设计 | [系统架构设计](./docs/02-YYC3-项目规划-设计阶段/0201-YYC3-项目规划-系统架构设计.md) | 分层与契约 |
| 03 开发 | [功能实现清单](./docs/03-YYC3-项目开发-实施阶段/0301-YYC3-项目开发-功能实现清单.md) · [开发环境指南](./docs/03-YYC3-项目开发-实施阶段/0302-YYC3-项目开发-开发环境指南.md) | 实现与环境 |
| 04 测试 | [全维度调研报告](./docs/04-YYC3-项目测试-审核阶段/0401-YYC3-项目测试-全维度调研报告.md) · [测试方案与用例](./docs/04-YYC3-项目测试-审核阶段/0402-YYC3-项目测试-测试方案与用例.md) | 诊断与用例 |
| 05 部署 | [部署运维指南](./docs/05-YYC3-项目部署-文档闭环/0501-YYC3-项目部署-部署运维指南.md) | 发布与回滚 |
| 06 运营 | [协作对接指引](./docs/06-YYC3-项目运营-维护阶段/0601-YYC3-项目运营-协作对接指引.md) | RACI 与流程 |
| 07 合规 | [安全审计报告](./docs/07-YYC3-项目合规-安全保障/0701-YYC3-项目合规-安全审计报告.md) | 风险与整改 |
| 08 整合 | [资源引用规范](./docs/08-YYC3-项目整合-实施阶段/0801-YYC3-项目整合-资源引用规范.md) | 资产唯一入口 |
| 09 资产 | [媒体资产清单](./docs/09-YYC3-项目资产-知识管理/0901-YYC3-项目资产-媒体资产清单.md) | 全量登记 |
| 10 模版 | [文档模版与落地规范](./docs/10-YYC3-项目模版-标准规范/1001-YYC3-项目模版-文档模版与落地规范.md) | 标规落地 |
| 11 演进 | [技术债与演进路线](./docs/11-YYC3-智能演进-优化阶段/1101-YYC3-智能演进-技术债与演进路线.md) | 债务与路线 |
| 12 指南 | [用户操作手册](./docs/12-YYC3-用户指南-操作手册/1201-YYC3-用户指南-用户操作手册.md) | 使用说明 |

完整索引：[docs/README.md](./docs/README.md)

---

## 🧪 质量与测试

| 检查 | 状态 |
| ---- | :--: |
| JS / Python / JSON 语法 | ✅ |
| 资源引用一致性（零 404） | ✅ |
| 后端单元/接口测试（2 suites / 7 tests） | ✅ |
| SQLite API 冒烟（5/6 通过） | 🟡 |
| 边界参数校验 | ❌ |
| 依赖漏洞扫描（43 项，3 critical） | ❌ |
| 前端组件测试 | ⏸ 待接入 |
| E2E / 性能 / 兼容性 | ⏸ 待接入 |

```bash
# 静态检查
find api_service/src web_app/src \( -name "*.js" -o -name "*.jsx" \) -exec node --check {} \;
grep -rn "/assets/" web_app/src || echo "资源引用通过"
```

测试方案与通过标准：[测试方案与用例](./docs/04-YYC3-项目测试-审核阶段/0402-YYC3-项目测试-测试方案与用例.md)

---

## 🗺 路线图

| 阶段 | 目标 | 状态 |
| ---- | ---- | :--: |
| M0 | 基线冻结（Git / 文档） | 🔄 |
| M1 | 止血（P0 修复 / 资源接线 / 密钥治理） | 🔄 |
| M2 | 工程化（Vite + TS / CI / 测试 / Docker） | ⬜ |
| M3 | 体验完善（响应式 / 空态 / 无障碍） | ⬜ |
| M4 | 生态扩展（后台 / 移动端 / AI 服务） | ⬜ |

详见 [技术债与演进路线](./docs/11-YYC3-智能演进-优化阶段/1101-YYC3-智能演进-技术债与演进路线.md)。

---

## 🤝 贡献与治理

| 文件 | 内容 |
| ---- | ---- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 贡献流程、分支规范、提交规范、PR 清单 |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | 社区行为准则 |
| [SECURITY.md](./SECURITY.md) | 漏洞报告与安全基线 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本变更记录 |
| [LICENSE](./LICENSE) | MIT（仅代码） |

### 提交规范

```text
<type>(<scope>): <subject>
类型：feat | fix | docs | style | refactor | test | chore
示例：feat(player): 接入本地曲库真实音频播放
```

### 分支模型

```text
main        生产
develop     开发
feature/*   功能
hotfix/*    热修
release/*   发布
```

---

## 🏷 仓库标签 / 关键词

```text
yyc3  m98  dongxiaojie  music-app  react  express  sqlite  mongodb
fan-platform  ai-music  eastern-electronic  open-source
言启象限  语枢未来  万象归元于云枢  深栈智启新纪元
```

> 建议在 GitHub 仓库 About 中设置 Topics，提升可发现性与生态关联。

---

## ⚖️ 版权与许可

- **源代码**：MIT License，© 2026 YanYuCloudCube™（YYC³）。
- **媒体资产**：`public/D-Music/`、`public/D-cover/`、`public/D-poster/`、`public/D-Music-icons/` 等音乐、图像与图标版权归**董小姐及品牌方**所有，**不适用 MIT**，未经书面授权不得复制、再分发或商用。
- 详见 [LICENSE](./LICENSE) 与 [SECURITY.md](./SECURITY.md)。

---

## 📮 联系

| 渠道 | 地址 |
| ---- | ---- |
| 团队邮箱 | [admin@0379.email](mailto:admin@0379.email) |
| 安全问题 | 见 [SECURITY.md](./SECURITY.md) |
| 文档入口 | [docs/README.md](./docs/README.md) |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
