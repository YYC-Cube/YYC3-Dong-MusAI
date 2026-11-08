---
file: 0504-YYC3-项目部署-GitHubPages与CI-CD指南.md
title: M98 董小姐音乐宇宙 — GitHub Pages 与 CI/CD 指南
description: GitHub Pages 自定义域名部署、Actions CI 门禁、CodeQL 安全扫描与回滚验收的完整操作手册
author: YYC³ Team <admin@0379.email>
version: v1.1.0
created: 2026-11-09
updated: 2026-11-09
status: stable
tags: [deployment, github-pages, ci-cd, actions, codeql]
category: technical
language: zh-CN
audience: developers,operations
complexity: intermediate
project: m98-dongxiaojie
phase: production
---

# M98 董小姐音乐宇宙 — GitHub Pages 与 CI/CD 指南

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、目标与范围

本文覆盖前端站点的 **GitHub Pages 部署**、**GitHub Actions CI 门禁** 与 **安全扫描**，确保从提交到线上验收的全链路可重复、可回滚、可审计。

| 范围 | 说明 |
| ---- | ---- |
| 纳入 | `web_app` 静态站点、`public` 资产、CNAME、CI、CodeQL、Dependabot |
| 不纳入 | `api_service` 与 PostgreSQL 的托管部署（见 [0501-部署运维指南](./0501-YYC3-项目部署-部署运维指南.md)） |
| 线上入口 | [https://musai.yyc3.vip](https://musai.yyc3.vip) |
| 仓库 | [https://github.com/YYC-Cube/YYC3-Dong-MusAI](https://github.com/YYC-Cube/YYC3-Dong-MusAI) |

> Pages 只承载静态前端。生产环境需通过 `VITE_API_BASE_URL` 指向独立部署的 API。

---

## 二、域名与仓库拓扑

```text
开发者
  │  git push origin main
  ▼
GitHub · YYC-Cube/YYC3-Dong-MusAI
  │
  ├── Actions · ci.yml ──────────► 静态校验 / Web 构建 / API 测试 / Admin 构建
  ├── Actions · codeql.yml ─────► JavaScript · TypeScript 安全扫描
  └── Actions · deploy-pages.yml
          │  npm run build（含 sync-assets → CNAME）
          │  upload-pages-artifact
          ▼
      GitHub Pages（OIDC）
          │  CNAME: musai.yyc3.vip
          ▼
      https://musai.yyc3.vip
```

### 2.1 Pages 当前配置基线

| 配置项 | 值 | 说明 |
| ---- | ---- | ---- |
| 仓库 | `YYC-Cube/YYC3-Dong-MusAI` | Public |
| Pages 构建类型 | `workflow` | 由 Actions 发布，不使用 `gh-pages` 分支 |
| 自定义域名 | `musai.yyc3.vip` | DNS 已验证 |
| CNAME 文件 | `public/CNAME` | 唯一事实源 |
| HTTPS | 已启用并强制跳转 | 证书由 GitHub 托管 |
| 部署权限 | `pages: write` + `id-token: write` | OIDC，无长期密钥 |
| 部署触发 | `main` 分支 `web_app/**`、`public/**` 或工作流变更 | PR 不部署生产 |

---

## 三、构建链路

### 3.1 资产与 CNAME 同步

CRA → Vite 迁移后，Vite 服务 `web_app/public`，根 `public/` 仍为唯一事实源。`web_app/package.json` 在 `prestart` / `prebuild` 阶段执行 `scripts/sync-assets.js`，白名单包含：

```text
D-Music  D-Music-icons  D-cover  D-poster
D-MusAI.png  D-music.png  music.png  CNAME
```

因此 `npm run build` 产物 `web_app/build/` 会自动包含：

- `CNAME` → `musai.yyc3.vip`
- `404.html` → 未知路径回退首页
- `D-*` 品牌与媒体资产

> `.gitignore` 已排除生成的 `web_app/public/CNAME`，避免与根 `public/CNAME` 产生双事实源。

### 3.2 API 不可达时的静态回退

Pages 静态站点可能无法访问 `api_service`。前端按以下策略保证可用性：

| 场景 | 行为 |
| ---- | ---- |
| 生产构建未设置 `VITE_API_BASE_URL` | 直接使用 `web_app/src/config/fallbackData.js` 本地静态数据 |
| 已设置 API 地址但请求失败 | 捕获异常后回退本地静态数据，页面不进入错误屏 |
| 测试环境（`NODE_ENV=test`） | 默认使用本地静态数据，避免真实网络请求 |
| 开发环境 | 优先请求 `http://localhost:4000`，失败时回退 |

### 3.3 部署工作流

[`deploy-pages.yml`](../../.github/workflows/deploy-pages.yml) 关键步骤：

1. `actions/checkout@v4`
2. `actions/setup-node@v4`（Node 22 + npm 缓存）
3. `actions/configure-pages@v5`
4. `npm ci` → `npm run build`（`CI=true`）
5. 校验 `web_app/build/CNAME` 等于 `musai.yyc3.vip`
6. `actions/upload-pages-artifact@v3` 上传 `web_app/build`
7. `actions/deploy-pages@v4` 发布，`environment: github-pages`

并发策略：`group: pages`，`cancel-in-progress: false`，避免生产发布被中途取消。

---

## 四、CI 门禁

[`ci.yml`](../../.github/workflows/ci.yml) 包含四个 Job：

| Job | 内容 | 关键命令 |
| ---- | ---- | ---- |
| `static` | JSON、API 语法、CNAME 校验 | `node -e JSON.parse` / `node --check` / `test CNAME` |
| `web` | Vite 构建与 Vitest 单元测试 | `npm ci` → `npm run build` → `npm test` |
| `api` | PostgreSQL 15 服务容器 + 集成测试 | `npm run pg:migrate` → `npm test` |
| `admin` | Vue 3.5 类型检查与构建 | `npm ci` → `npm run build` |

API Job 使用隔离测试库：

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_DB: yyc3_music
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

测试库 `yyc3_music_test` 由 `tests/helpers/pgTestDb.js` 自动创建、重建 `m98` schema 并写入固定夹具，不接触生产数据。

### 4.1 安全扫描

| 工作流 | 频率 | 说明 |
| ---- | ---- | ---- |
| `codeql.yml` | push / PR / 每周一 02:00 | `javascript-typescript` 静态分析，结果写入 Security → Code scanning |
| `dependabot.yml` | 每周一 | npm 三端 + GitHub Actions 依赖 PR |

---

## 五、本地复现

```bash
# 1. 安装依赖
cd web_app
npm ci

# 2. 生产构建（自动同步资产与 CNAME）
CI=true npm run build

# 3. 校验产物
test -f build/CNAME && cat build/CNAME
test -f build/404.html && echo "SPA fallback ok"

# 4. 本地预览
npx serve -s build -l 4173
```

预期：

```text
musai.yyc3.vip
SPA fallback ok
```

---

## 六、首次发布流程

1. 确认 `.github/workflows/deploy-pages.yml`、`ci.yml` 已合入 `main`。
2. 确认仓库 Settings → Pages → Source 为 **GitHub Actions**。
3. 确认 Custom domain 为 `musai.yyc3.vip`，DNS 验证通过。
4. 推送 `main`，观察 Actions：
   - `CI` 四个 Job 全绿；
   - `Deploy Pages` 的 `build` 与 `deploy` 成功。
5. 打开 `https://musai.yyc3.vip` 验收：
   - HTTPS 锁标识正常；
   - 首页、封面、音频、图标加载无 404；
   - 刷新任意未知路径回退首页；
   - 移动端视口正常。

---

## 七、回滚策略

| 场景 | 操作 |
| ---- | ---- |
| 前端版本回滚 | 在 Actions 中重新运行上一个成功提交的 `Deploy Pages`，或 `git revert` 后推送 |
| 自定义域名异常 | 检查 `public/CNAME` 与 Pages Settings 是否一致，重新触发部署 |
| 构建失败 | 本地执行 `npm ci && npm run build` 复现，修复后推送 |
| 证书异常 | 等待 GitHub 重新签发，或在 Pages Settings 中移除后重新添加域名 |
| CI 误报 | 保留失败日志，修复根因；禁止直接跳过必需检查 |

> 生产回滚不使用强制推送；通过 `git revert` 保留审计轨迹。

---

## 八、故障排查

| 现象 | 可能原因 | 处理 |
| ---- | ---- | ---- |
| 访问 404 | Pages Source 未设为 Actions / 部署未完成 | 查看 `Deploy Pages` 运行记录与 `github-pages` environment |
| 显示旧版本 | 浏览器/CDN 缓存 | 强制刷新；确认最新部署时间 |
| CNAME 丢失 | 构建产物未包含 `public/CNAME` | 检查 `sync-assets.js` 白名单与 `build/CNAME` 校验步骤 |
| HTTPS 未生效 | 证书签发中 / DNS 未验证 | 等待签发；核对 DNS `CNAME → yyc-cube.github.io` |
| 资源 404 | 资产未同步 / 路径大小写不一致 | 本地构建检查 `build/D-*`；核对 `assets.js` |
| API 请求失败 | 未设置 `VITE_API_BASE_URL` / CORS | 配置仓库变量并重新构建；核对 `FRONTEND_URL` |
| Actions 权限错误 | `permissions` 缺失 | 确认 `pages: write`、`id-token: write` |

---

## 九、安全与权限

| 项 | 要求 |
| ---- | ---- |
| 工作流权限 | 默认 `contents: read`；仅 Pages 增加 `pages: write`、`id-token: write` |
| 密钥 | 不在前端注入私密变量；仅使用公开 `REACT_APP_*` |
| 分支保护 | `main` 要求 CI 通过、至少 1 名评审、禁止强推 |
| 依赖 | Dependabot 每周更新；CodeQL 每周扫描 |
| 域名 | CNAME 变更需评审并同步 Pages Settings |
| 产物 | 部署前校验 CNAME，防止域名漂移 |

---

## 十、验收清单

- [ ] `public/CNAME` = `musai.yyc3.vip`
- [ ] `Deploy Pages` 最近一次运行成功
- [ ] `web_app/build/CNAME` 与根 CNAME 一致
- [ ] `CI` 四个 Job 全绿
- [ ] CodeQL 无高危告警
- [ ] `https://musai.yyc3.vip` HTTPS 正常
- [ ] 首页资源零 404
- [ ] 未知路径回退首页
- [ ] 移动端与桌面端布局正常

---

## 十一、相关文档

- [0501-部署运维指南](./0501-YYC3-项目部署-部署运维指南.md)
- [0502-环境变量手册](./0502-YYC3-项目部署-环境变量手册.md)
- [0503-PostgreSQL 适配与迁移指南](./0503-YYC3-项目部署-PostgreSQL适配与迁移指南.md)
- [0801-资源引用规范](../08-YYC3-项目整合-实施阶段/0801-YYC3-项目整合-资源引用规范.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [SECURITY.md](../../SECURITY.md)

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.1.0 | 2026-11-09 | 适配 Vite 8 + React 19：更新构建链路、Node 22、`VITE_API_BASE_URL` 与 Vitest 命令 | YYC³ Team |
| v1.0.0 | 2026-11-09 | 建立 GitHub Pages、CI、CodeQL、回滚与验收手册 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
