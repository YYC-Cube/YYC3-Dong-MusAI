# 贡献指南

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

感谢你愿意为 **M98 董小姐音乐宇宙** 贡献力量。本文说明环境准备、分支规范、提交规范、代码与文档标准、CI 门禁以及 PR 检查清单。

- 仓库：[https://github.com/YYC-Cube/YYC3-Dong-MusAI](https://github.com/YYC-Cube/YYC3-Dong-MusAI)
- 线上站点：[https://musai.yyc3.vip](https://musai.yyc3.vip)
- 文档索引：[docs/README.md](./docs/README.md)

---

## 一、开始之前

1. 阅读 [README.md](./README.md) 与 [项目总览手册](./docs/00-YYC3-项目总览-目录索引/001-YYC3-项目总览-项目总览手册.md)。
2. 阅读 [全维度调研报告](./docs/04-YYC3-项目测试-审核阶段/0401-YYC3-项目测试-全维度调研报告.md)，了解已知问题与优先级。
3. 阅读 [行为准则](./CODE_OF_CONDUCT.md)。
4. 安全相关问题请**不要**公开提 Issue，按 [SECURITY.md](./SECURITY.md) 私下报告。

---

## 二、环境准备

### 基础环境

| 依赖 | 版本 | 说明 |
| ---- | ---- | ---- |
| Node.js | ≥ 18（推荐 20 / 22 LTS） | 三端统一 |
| npm | ≥ 9 | 仓库使用 `package-lock.json`，CI 使用 `npm ci` |
| PostgreSQL | 15 | 主库 `yyc3_music`，默认端口 `5433` |
| Git | ≥ 2.30 | 支持 Conventional Commits |

### 克隆与安装

```bash
git clone https://github.com/YYC-Cube/YYC3-Dong-MusAI.git
cd YYC3-Dong-MusAI

# 1. 后端
cd api_service
npm install
cp .env.example .env      # 按本机环境填写，禁止提交真实密钥
npm run pg:migrate
npm run pg:import
npm start

# 2. 前端（另开终端）
cd web_app
npm install
npm start

# 3. 管理后台（另开终端）
cd admin_panel
npm install
npm run dev
```

> 详细说明见 [开发环境指南](./docs/03-YYC3-项目开发-实施阶段/0302-YYC3-项目开发-开发环境指南.md) 与 [环境变量手册](./docs/05-YYC3-项目部署-文档闭环/0502-YYC3-项目部署-环境变量手册.md)。

### 常用命令

| 目录 | 命令 | 用途 |
| ---- | ---- | ---- |
| `web_app` | `npm start` | CRA 开发服务器（:3000） |
| `web_app` | `npm run build` | 生产构建（含资产与 CNAME 同步） |
| `web_app` | `npm test -- --watchAll=false` | 单元测试 |
| `api_service` | `npm start` | Express API（:4000） |
| `api_service` | `npm run pg:migrate` | 建立 `m98` schema |
| `api_service` | `npm test` | API 集成测试（PG 测试库） |
| `admin_panel` | `npm run dev` | Vite 管理后台（:3032） |
| `admin_panel` | `npm run build` | 类型检查 + 生产构建 |

---

## 三、分支规范

```text
main        生产分支，受保护，仅接受通过 CI 与评审的合并
develop     开发分支
feature/{scope}-{short-desc}   功能
fix/{scope}-{short-desc}       缺陷
docs/{short-desc}              文档
refactor/{scope}               重构
hotfix/{version}               热修
release/{version}              发布
```

示例：`feature/player-local-audio`、`docs/pages-cicd`、`fix/api-limit-validation`。

---

## 四、提交规范（Conventional Commits）

```text
<type>(<scope>): <subject>

<body 可选>

<footer 可选>
```

| type | 用途 |
| ---- | ---- |
| feat | 新功能 |
| fix | 缺陷修复 |
| docs | 文档 |
| style | 格式（不影响逻辑） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试 |
| build | 构建系统或依赖 |
| ci | CI / 工作流 |
| chore | 工具或其他杂项 |

示例：

```bash
git commit -m "feat(player): 接入本地曲库真实音频播放"
git commit -m "fix(api): 移除 server.js 重复 app.listen"
git commit -m "ci(pages): 增加 CNAME 产物校验"
git commit -m "docs(docs): 新增 GitHub Pages 与 CI/CD 指南"
```

> 破坏性变更必须在 footer 中标注 `BREAKING CHANGE: <说明>`。

---

## 五、代码标准

1. **标头**：所有新增 `.js/.jsx/.ts/.tsx/.css/.md` 文件必须包含 YYC³ 标头（见 [文档模版与落地规范](./docs/10-YYC3-项目模版-标准规范/1001-YYC3-项目模版-文档模版与落地规范.md)）。
2. **命名**：组件 PascalCase，Hook `useXxx`，工具 camelCase，样式文件 kebab-case。
3. **资产**：只能通过 `web_app/src/config/assets.js` 引用，禁止硬编码 `/assets/**`。
4. **接口契约**：统一 `{ success, data, message }`；新增字段须同步 Swagger 与文档。
5. **安全**：禁止提交密钥、Token、真实用户数据；写接口必须校验输入；生产错误不回传堆栈。
6. **注释**：只在逻辑不直观处添加，避免无意义注释。
7. **依赖**：新增依赖需说明用途、体积与维护状态；优先使用仓库已选型。

---

## 六、文档标准

- 新增文档放入 `docs/` 对应阶段目录，命名 `{四位序号}-YYC3-{阶段}-{描述}.md`。
- 使用标准 YAML 标头、品牌引用块、变更历史与居中页脚（见 [YYC3-团队通用-标头标尾](./docs/YYC3-团队通用-标规文档/YYC3-团队通用-标头标尾.md)）。
- 新增文档须在 [docs/README.md](./docs/README.md) 索引登记。
- 文档中引用资产必须使用真实相对路径。
- 正文品牌统一写作 `YYC³`；路径、包名、文件名使用 ASCII `YYC3`。

---

## 七、测试要求

```bash
# 1. 静态校验
find api_service/src -type f -name "*.js" -exec node --check {} \;
node -e "JSON.parse(require('fs').readFileSync('web_app/package.json','utf8'))"
grep -rn "/assets/" web_app/src || echo "资源引用通过"

# 2. 前端构建与测试
cd web_app
CI=true npm run build
CI=true npm test -- --watchAll=false

# 3. 后端测试（需 PostgreSQL 15）
cd api_service
npm test

# 4. 管理后台
cd admin_panel
npm run build
```

提交 PR 前请确保：

- [ ] 静态校验通过
- [ ] 相关测试通过
- [ ] 无新增 `console.log`（调试除外，合入前移除）
- [ ] 无硬编码密钥
- [ ] 资源引用可访问
- [ ] `public/CNAME` 未被修改（除域名迁移外）

---

## 八、CI 门禁

| 工作流 | 触发 | 必过项 |
| ---- | ---- | ---- |
| [`ci.yml`](./.github/workflows/ci.yml) | push / PR（main、develop） | 静态校验、Web 构建与测试、API 集成测试、Admin 构建 |
| [`codeql.yml`](./.github/workflows/codeql.yml) | push / PR / 每周 | JavaScript / TypeScript 安全扫描 |
| [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml) | push main | Pages 构建与发布（非 PR 门禁） |

CI 使用 GitHub Actions 托管运行器；API 测试使用 `postgres:15` 服务容器与固定测试库 `yyc3_music_test`，不会接触生产数据。

---

## 九、Pages 部署约定

- `main` 分支的 `web_app/**`、`public/**` 变更会自动触发 Pages 部署。
- 部署对象仅为前端静态产物 `web_app/build`；后端 API 需独立部署。
- `public/CNAME` 是自定义域名唯一事实源，构建时由 `scripts/sync-assets.js` 同步到 `web_app/public`。
- PR 不触发生产部署；如需预览，请在本地运行 `npm run build` 并使用静态服务器验证。
- 详细流程见 [0504-GitHub Pages 与 CI/CD 指南](./docs/05-YYC3-项目部署-文档闭环/0504-YYC3-项目部署-GitHubPages与CI-CD指南.md)。

---

## 十、PR 检查清单

- [ ] 标题符合 Conventional Commits
- [ ] 描述包含：动机、变更点、影响范围、验证方式
- [ ] 关联 Issue（如有）
- [ ] 截图/录屏（UI 变更）
- [ ] 文档已同步（接口/架构/资产/部署变更）
- [ ] 无破坏性变更；若有，已标注 `BREAKING CHANGE`
- [ ] CI 全部通过
- [ ] 至少 1 名评审人通过

PR 模板见 [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)。

---

## 十一、评审关注点

| 维度 | 关注 |
| ---- | ---- |
| 正确性 | 边界、异常、并发 |
| 可读性 | 命名、拆分、复杂度 |
| 一致性 | 契约、样式、资产引用 |
| 安全性 | 输入校验、权限、密钥、依赖 |
| 性能 | N+1、全表扫描、大文件、包体积 |
| 可观测性 | 日志、健康检查、错误码 |
| 文档 | 是否同步、链接是否有效 |

---

## 十二、发布流程

1. `develop` 功能冻结。
2. 创建 `release/x.y.z`。
3. 更新 `CHANGELOG.md` 与版本号。
4. 回归测试（本地 + CI）。
5. 合并 `main` 并打 tag。
6. Pages 自动部署；后端按 [0501-部署运维指南](./docs/05-YYC3-项目部署-文档闭环/0501-YYC3-项目部署-部署运维指南.md) 发布。
7. 线上验收并通报。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.2.0 | 2026-11-09 | 接入真实仓库地址、PostgreSQL 测试流程、CI 门禁与 Pages 部署约定 | YYC³ Team |
| v1.1.0 | 2026-11-07 | 初版贡献指南 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
