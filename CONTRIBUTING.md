# 贡献指南

感谢你愿意为 **M98 董小姐音乐宇宙** 贡献力量。本文说明环境准备、分支规范、提交规范、代码与文档标准，以及 PR 检查清单。

---

## 一、开始之前

1. 阅读 [README.md](./README.md) 与 [项目总览手册](./docs/00-YYC3-项目总览-目录索引/001-YYC3-项目总览-项目总览手册.md)。
2. 阅读 [全维度调研报告](./docs/04-YYC3-项目测试-审核阶段/0401-YYC3-项目测试-全维度调研报告.md)，了解已知问题与优先级。
3. 阅读 [行为准则](./CODE_OF_CONDUCT.md)。
4. 安全相关问题请**不要**公开提 Issue，按 [SECURITY.md](./SECURITY.md) 私下报告。

---

## 二、环境准备

```bash
# 1. 克隆
git clone <repository-url>
cd M-DongXiaoJie

# 2. 后端
cd api_service
npm install
cp .env.example .env      # 若不存在，请先按 0302 文档创建
node src/server-sqlite.js

# 3. 前端（另开终端）
cd web_app
npm install
npm start
```

> 详细说明见 [开发环境指南](./docs/03-YYC3-项目开发-实施阶段/0302-YYC3-项目开发-开发环境指南.md)。

---

## 三、分支规范

```text
main        生产分支，仅接受通过评审的合并
develop     开发分支
feature/{scope}-{short-desc}   功能
fix/{scope}-{short-desc}       缺陷
docs/{short-desc}              文档
refactor/{scope}               重构
hotfix/{version}               热修
```

示例：`feature/player-local-audio`、`docs/yyc3-doc-structure`。

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
| test | 测试 |
| chore | 构建/工具/依赖 |

示例：

```bash
git commit -m "feat(player): 接入本地曲库真实音频播放"
git commit -m "fix(api): 移除 server.js 重复 app.listen"
git commit -m "docs(docs): 建立 YYC³ 十二阶段文档索引"
```

---

## 五、代码标准

1. **标头**：所有 `.js/.jsx/.ts/.tsx/.css/.md` 新增文件必须包含 YYC³ 标头（见 [文档模版与落地规范](./docs/10-YYC3-项目模版-标准规范/1001-YYC3-项目模版-文档模版与落地规范.md)）。
2. **命名**：组件 PascalCase，Hook `useXxx`，工具 camelCase，文件 kebab-case（样式）。
3. **资产**：只能通过 `web_app/src/config/assets.js` 引用，禁止硬编码 `/assets/**`。
4. **接口契约**：统一 `{ success, data, message }`；新增字段须同步 Swagger 与文档。
5. **安全**：禁止提交密钥、Token、真实用户数据；写接口必须校验输入。
6. **注释**：只在逻辑不直观处添加，避免无意义注释。

---

## 六、文档标准

- 新增文档放入 `docs/` 对应阶段目录，命名 `{四位序号}-YYC3-{阶段}-{描述}.md`。
- 使用标准 YAML 标头、品牌引用块、变更历史与居中页脚。
- 新增文档须在 [docs/README.md](./docs/README.md) 索引登记。
- 文档中引用资产必须使用真实相对路径。

---

## 七、测试要求

```bash
# 静态检查
find api_service/src web_app/src \( -name "*.js" -o -name "*.jsx" \) -exec node --check {} \;
grep -rn "/assets/" web_app/src || echo "资源引用通过"

# 后端测试（需 MongoDB）
cd api_service && npm test

# 前端测试
cd web_app && npm test -- --watchAll=false
```

提交 PR 前请确保：

- [ ] 语法检查通过
- [ ] 相关测试通过（若环境可用）
- [ ] 无新增 `console.log`（调试除外，合入前移除）
- [ ] 无硬编码密钥
- [ ] 资源引用可访问

---

## 八、PR 检查清单

- [ ] 标题符合 Conventional Commits
- [ ] 描述包含：动机、变更点、影响范围、验证方式
- [ ] 关联 Issue（如有）
- [ ] 截图/录屏（UI 变更）
- [ ] 文档已同步（接口/架构/资产变更）
- [ ] 无破坏性变更；若有，已标注 `BREAKING CHANGE`
- [ ] 至少 1 名评审人通过

PR 模板建议：

```markdown
## 动机

## 变更点

## 影响范围

## 验证方式

## 截图

## 关联 Issue
```

---

## 九、评审关注点

| 维度 | 关注 |
| ---- | ---- |
| 正确性 | 边界、异常、并发 |
| 可读性 | 命名、拆分、复杂度 |
| 一致性 | 契约、样式、资产引用 |
| 安全性 | 输入校验、权限、密钥 |
| 性能 | N+1、全表扫描、大文件 |
| 文档 | 是否同步、链接是否有效 |

---

## 十、发布流程

1. `develop` 功能冻结。
2. 创建 `release/x.y.z`。
3. 更新 `CHANGELOG.md` 与版本号。
4. 回归测试。
5. 合并 `main` 并打 tag。
6. 部署并通报。

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
