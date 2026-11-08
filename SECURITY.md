# 安全政策

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

**仓库**：[YYC-Cube/YYC3-Dong-MusAI](https://github.com/YYC-Cube/YYC3-Dong-MusAI)
**线上站点**：[https://musai.yyc3.vip](https://musai.yyc3.vip)

---

## 支持的版本

| 版本 | 支持状态 |
| ---- | -------- |
| 1.7.x | ✅ 安全修复与常规维护 |
| 1.6.x | ⚠️ 仅安全修复 |
| < 1.6 | ❌ 不再支持 |

---

## 报告漏洞

**请勿通过公开 Issue、PR 或 Discussions 报告安全漏洞。**

优先使用 GitHub 私密漏洞报告：

- [创建私密安全公告](https://github.com/YYC-Cube/YYC3-Dong-MusAI/security/advisories/new)

也可发送邮件至 **admin@0379.email**，主题格式：

```text
[SECURITY] M98 董小姐音乐宇宙 — {漏洞简述}
```

邮件中请尽量包含：

1. 漏洞类型与影响范围
2. 复现步骤或 PoC
3. 受影响版本 / 提交
4. 可能的修复建议
5. 你的联系方式（可选）

### 响应时限

| 阶段 | 目标 |
| ---- | ---- |
| 确认收到 | 24 小时内 |
| 初步评估 | 72 小时内 |
| 修复计划 | 7 个工作日内 |
| 修复发布 | 依严重程度协商 |

我们会在修复发布后致谢报告者（如你同意）。

---

## 安全范围

**纳入**

- 源代码与配置
- API 鉴权、输入校验、限流
- 敏感信息泄露
- 依赖漏洞与供应链风险
- XSS / 注入 / SSRF / CSRF 等常见 Web 风险
- GitHub Actions 工作流权限与密钥使用
- Pages 部署链路、CNAME 与自定义域名配置

**不纳入**

- 社会工程学攻击
- 物理访问
- 第三方平台（微博/抖音/B站/小红书）自身漏洞
- GitHub 平台自身漏洞（请向 GitHub 报告）
- 已公开且无实际影响的低危问题
- 纯理论、无复现路径的推测

---

## 安全基线

| 项 | 要求 |
| -- | ---- |
| 密钥 | 不落库，来自环境变量/密钥管理；`.env` 已被 `.gitignore` 排除 |
| 鉴权 | 管理端写接口必须 JWT 鉴权或严格限流 |
| 输入 | 全量校验（类型、范围、长度）；非法参数统一 400 |
| 依赖 | Dependabot 每周更新；发布前执行 `npm audit --omit=dev` |
| 日志 | 不记录密码、Token、身份证号 |
| 错误 | 生产不回传堆栈，仅返回通用错误信息 |
| 传输 | 全站 HTTPS；Pages 已强制 HTTPS |
| 备份 | 加密 + 访问控制 + 定期演练 |
| 媒体 | 版权授权书面化，禁止未授权分发 |
| CI | 工作流最小权限；Pages 使用 OIDC，不保存长期部署密钥 |

---

## CI/CD 安全控制

| 控制 | 实现 |
| ---- | ---- |
| 静态安全扫描 | [CodeQL](https://github.com/YYC-Cube/YYC3-Dong-MusAI/actions/workflows/codeql.yml)（JavaScript / TypeScript） |
| 依赖更新 | [Dependabot](./.github/dependabot.yml)，npm 三端 + Actions |
| 最小权限 | `ci.yml` 仅 `contents: read`；`deploy-pages.yml` 仅 `pages: write` + `id-token: write` |
| 部署隔离 | PR 不触发生产部署；仅 `main` 可发布 Pages |
| 产物校验 | 部署前校验 `web_app/build/CNAME` 与 `public/CNAME` 一致 |
| 密钥治理 | Actions 不注入生产密钥；前端仅使用公开的 `REACT_APP_*` 变量 |

> 静态站点无法像服务端一样自定义全部响应头。若需 CSP / HSTS / X-Frame-Options 等细粒度策略，应在 CDN 或反向代理层配置。

---

## 已知风险与整改（截至 v1.7.0）

| ID | 风险 | 等级 | 状态 |
| -- | ---- | :--: | ---- |
| SEC-01 | `.env` 明文密钥入库 | 高 | ✅ 已整改（`.env` 已忽略，`.env.example` 仅占位） |
| SEC-02 | `POST /api/music/:id/play` 无鉴权 | 高 | 🟡 跟踪中（依赖限流与业务评估） |
| SEC-03 | 列表参数缺少边界校验 | 高 | ✅ 已整改（非法 `limit/page/type` 返回 400） |
| SEC-04 | `bcryptjs` / `jsonwebtoken` 已装未用 | 中 | ✅ 已整改（移除未用依赖，JWT 已用于管理端） |
| SEC-05 | 生产环境回传错误详情 | 中 | ✅ 已整改（仅开发环境返回 `error.message`） |
| SEC-06 | CORS 仅支持单域名 | 中 | ✅ 已整改（`FRONTEND_URL` 支持逗号分隔多域名） |
| SEC-08 | 安全响应头未细化（CSP/HSTS） | 中 | 🟡 部分整改（helmet 默认策略已启用，CSP/HSTS 待细化） |
| SEC-10 | 播放计数存在并发丢失更新 | 中 | ✅ 已整改（数据库原子自增，测试覆盖） |
| SEC-11 | 管理端默认开发账号 | 中 | 🟡 跟踪中（生产必须覆盖 `ADMIN_*` / `JWT_SECRET`） |
| SEC-12 | Pages 静态站无服务端安全头 | 低 | 🟡 跟踪中（由 CDN / 代理层补齐） |

详见 [安全审计报告](./docs/07-YYC3-项目合规-安全保障/0701-YYC3-项目合规-安全审计报告.md)。

---

## 披露政策

- 我们支持**协调披露**：在修复发布前，请勿公开漏洞细节。
- 修复发布后，经报告者同意，我们会在安全公告中致谢。
- 我们不会对善意安全研究采取法律行动，前提是：
  1. 不访问、修改或删除他人数据；
  2. 不破坏服务可用性；
  3. 仅在本地或自有测试环境验证；
  4. 及时报告并给予合理修复窗口。

---

## 媒体资产特别提示

`public/D-Music/`、`public/D-cover/`、`public/D-poster/`、`public/D-Music-icons/` 等音乐、图像与图标**不在 MIT 许可证范围内**，版权归董小姐及品牌方所有。未经书面授权，不得复制、再分发或商用。详见 [LICENSE](./LICENSE)。

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.2.0 | 2026-11-09 | 增加 GitHub 私密报告、CI/CD 安全控制、风险状态复核与披露政策 | YYC³ Team |
| v1.1.0 | 2026-11-07 | 初版安全政策与已知风险清单 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
