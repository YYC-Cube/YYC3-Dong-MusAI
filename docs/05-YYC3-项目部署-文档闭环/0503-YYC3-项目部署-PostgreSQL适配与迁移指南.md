---
file: 0503-YYC3-项目部署-PostgreSQL适配与迁移指南.md
title: M98 董小姐音乐宇宙 — PostgreSQL 适配与迁移指南
description: PostgreSQL 适配层 — m98 schema、迁移脚本、数据导入、校验与回滚
author: YYC³ Team <admin@0379.email>
version: v1.1.2
created: 2026-11-07
updated: 2026-11-07
status: stable
tags: [deployment, postgresql, migration, database]
category: technical
language: zh-CN
audience: developers,operations,dba
complexity: advanced
project: m98-dongxiaojie
phase: production
---

# M98 董小姐音乐宇宙 — PostgreSQL 适配与迁移指南

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 一、背景与决策

目标数据库：**PostgreSQL 15**，本地 `yanyu@localhost:5433/yyc3_music`，NAS Docker `yyc3-music`。

现场勘察发现，`public` schema 已被一套更完整的音乐平台占用：

| 表 | 行数 | 说明 |
| -- | :--: | ---- |
| `public.musics` | 165 | 曲目主表（uuid 主键） |
| `public.albums` | 14 | 专辑 |
| `public.users` / `play_history` / `comments` / `likes` 等 | — | 用户、播放、互动体系 |

**决策**：M98 API 适配层使用独立 **`m98` schema**，不修改、不覆盖 `public` 既有表。这样既保证迁移可回滚，也为后续“API 实体 → public 平台表”的深度映射保留空间。

---

## 二、文件清单

| 文件 | 作用 |
| ---- | ---- |
| `database/migrations/postgres/001_init.sql` | 建 schema、7 张表、索引与 `updated_at` 触发器 |
| `api_service/scripts/pg-migrate.js` | 迁移执行器：按文件名顺序执行，记录 `m98.schema_migrations` |
| `api_service/scripts/pg-import-sqlite.js` | SQLite → PG 幂等导入（artists / releases / fan_messages） |
| `api_service/scripts/pg-verify.js` | 对比 SQLite 与 PG 的行数与总播放量 |

npm 脚本：

```bash
cd api_service
npm run pg:migrate
npm run pg:import
npm run pg:verify
```

---

## 三、Schema 设计

```text
m98
├── schema_migrations   迁移版本记录
├── artists             艺人档案
├── releases            作品 / 单曲
├── fan_messages        粉丝留言
├── exclusive_content   独家内容
├── blog_posts          博客文章
└── events              活动
```

| 表 | 关键字段 | 说明 |
| -- | -------- | ---- |
| `artists` | `artist_id` 唯一、`genres/stats/social_links` JSONB | 迁移自 SQLite |
| `releases` | `legacy_id` 唯一、`artist_id` 外键、`tracks/stats` JSONB | 迁移自 SQLite |
| `fan_messages` | `legacy_id` 唯一、`likes` 非负 | 迁移自 SQLite |
| `exclusive_content` | `type` 枚举、`is_locked`、`unlock_condition` | 对应静态内容接口 |
| `blog_posts` | `tags` JSONB、`read_time` | 对应博客接口 |
| `events` | `status` 枚举、`event_date` | 对应活动接口 |

**索引**：`releases(artist_id, release_date desc)`、`releases(type)`、`releases((stats->>'plays') desc)`、`fan_messages(created_at desc)` 等。

**触发器**：所有业务表在 `UPDATE` 时自动刷新 `updated_at`。

---

## 四、SQLite → PostgreSQL 映射

| SQLite | PostgreSQL | 转换 |
| ------ | ---------- | ---- |
| `artists.artistId` | `artists.artist_id` | 直接 |
| `artists.genres`（TEXT JSON） | `artists.genres`（JSONB） | `JSON.parse` → `$n::jsonb` |
| `artists.stats` | `artists.stats` | 同上 |
| `artists.socialLinks` | `artists.social_links` | 同上 |
| `releases.id` | `releases.legacy_id` | 保留原主键用于追溯 |
| `releases.artistId` | `releases.artist_id` | 外键 |
| `releases.tracks/stats` | JSONB | 同上 |
| `releases.isExclusive`（0/1） | `is_exclusive`（boolean） | `Boolean()` |
| `fan_messages.id` | `fan_messages.legacy_id` | 保留 |
| `fan_messages.likes` | `likes` | 数值化，非负约束 |

**幂等策略**：`artists` 按 `artist_id`、`releases` / `fan_messages` 按 `legacy_id` 做 `ON CONFLICT DO UPDATE`，可重复执行。

---

## 五、执行步骤

### 5.1 前置检查

```bash
pg_isready -h localhost -p 5433 -U yanyu
psql -h localhost -p 5433 -U yanyu -d yyc3_music -c "select current_database();"
```

### 5.2 配置

在 `api_service/.env` 中配置：

```bash
PGHOST=localhost
PGPORT=5433
PGDATABASE=yyc3_music
PGUSER=yanyu
PGPASSWORD=
PGSCHEMA=m98
PGSSL=false
DB_PATH=../../database/m98_database.sqlite
```

### 5.3 迁移

```bash
cd api_service
npm run pg:migrate
```

预期：

```text
[pg:migrate] 连接 localhost:5433/yyc3_music as yanyu
[pg:migrate] 应用: 001_init.sql
[pg:migrate] 完成：应用 1 个迁移，跳过 0 个
```

### 5.4 导入

```bash
npm run pg:import
```

预期：

```text
[pg:import] 完成：artists=1 releases=3 fan_messages=3
```

内容种子：

```bash
npm run pg:seed:content
```

预期：

```text
[pg:seed:content] 完成：exclusive_content=4 blog_posts=2 events=3
```

### 5.5 校验

```bash
npm run pg:verify
```

预期：

```text
  table          sqlite      postgres    status
  artists        1           1           OK
  releases       3           3           OK
  fan_messages   3           3           OK
  total_plays    202663      202663      OK
```

---

## 六、实际执行结果（2026-11-07）

| 检查 | 结果 |
| ---- | ---- |
| `m98` schema 创建 | ✅ 7 张表 |
| `001_init.sql` 应用 | ✅ 1 个迁移 |
| 数据导入 | ✅ artists 1 / releases 3 / fan_messages 3 |
| 行数校验 | ✅ 全部一致 |
| 总播放量校验 | ✅ `202663 = 202663` |
| `public` 既有数据 | ✅ 未改动（musics 165 / albums 14） |
| PG API 启动 | ✅ `npm start` → `/health` 200，schema=m98 |
| PG 读接口 | ✅ 10 个端点全部 200 |
| PG 边界校验 | ✅ `limit=abc/0/101`、`page=0`、`type=bad` 全部 400 |
| PG 写接口 | ✅ 播放计数 `45233 → 45234`（测试后已复位） |
| PG 鉴权 / 仪表盘 | ✅ 无 Token 401；带 Token 200 |
| 内容种子 | ✅ exclusive_content 4 / blog_posts 2 / events 3 |
| 测试库 | ✅ `yyc3_music_test`，2 suites / 17 tests 通过 |

```text
m98.artists           1
m98.releases          3
m98.fan_messages      3
m98.exclusive_content 0
m98.blog_posts        0
m98.events            0
m98.schema_migrations 1
```

---

## 七、回滚

> 回滚会删除 `m98` schema 下的全部适配层数据，**不影响 `public`**。

```sql
-- 预览
SELECT version, applied_at FROM m98.schema_migrations ORDER BY version;

-- 回滚全部（谨慎）
DROP SCHEMA m98 CASCADE;
```

单次迁移回滚：

```sql
BEGIN;
DELETE FROM m98.schema_migrations WHERE version = '001_init.sql';
-- 手动执行对应的 DOWN SQL（当前版本未提供 DOWN 文件）
COMMIT;
```

建议：生产回滚前先 `pg_dump -n m98` 备份。

---

## 八、适配层接入现状

已完成 **结构 + 数据 + 查询层 + 入口切换**：

| 文件 | 职责 |
| ---- | ---- |
| `api_service/src/db/postgres.js` | 连接池、`search_path=m98,public`、健康检查 |
| `api_service/src/repositories/artistRepository.js` | 艺人资料、统计、最新动态 |
| `api_service/src/repositories/musicRepository.js` | 作品列表、精选、最新、播放计数 |
| `api_service/src/repositories/fanRepository.js` | 留言墙、留言数、粉丝画像 |
| `api_service/src/repositories/adminRepository.js` | 仪表盘 KPI、播放分布、最近活动 |
| `api_service/src/repositories/contentRepository.js` | 独家内容、博客、活动 |
| `api_service/src/routes/pg/*` | PG 路由层，保持原接口契约 |
| `api_service/src/server-postgres.js` | 默认入口 `npm start` |
| `api_service/tests/pgApi.test.js` | PG 集成测试（测试库 `yyc3_music_test`） |

**入口切换**

| 命令 | 入口 | 数据库 |
| ---- | ---- | ------ |
| `npm start` / `npm run start:postgres` | `server-postgres.js` | PostgreSQL 15 |
| 历史入口 | 已下线 | Mongo / SQLite / Mock 服务文件已删除 |

**后续待办**

1. 完成 NAS `yyc3-music` 联调与生产密钥注入。
2. 增加内容写入与管理端 CRUD 的 PG 集成测试。
3. 为 `npm audit` 高危依赖建立升级窗口。
4. 评估前端大文件拆分与组件去重。

**接口契约保持不变**，前端与管理后台无需改动。

---

## 九、注意事项

| 事项 | 说明 |
| ---- | ---- |
| schema 隔离 | 所有 API 表均在 `m98`，不与 `public` 冲突 |
| 幂等 | 迁移与导入均可重复执行 |
| 事务 | 每个迁移文件在独立事务中执行，失败自动回滚 |
| 密码 | 本机 `yanyu` 免密；NAS/远程必须注入 `PGPASSWORD` 并启用 `PGSSL` |
| 内容表 | 已通过 `pg:seed:content` 写入 4 / 2 / 3 条，脚本可重复执行 |
| 序列 | 导入后已通过 `setval` 对齐 `BIGSERIAL`，可继续自增 |
| 回滚备份 | 生产回滚前执行 `pg_dump -n m98` |
| 入口切换 | `npm start` 已指向 PG；Mongo / SQLite / Mock 服务入口已删除 |
| 前端接入 | `ExclusiveContent` 与 `ContentFeed` 已改为 `/api/content/*` |

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.1.2 | 2026-11-07 | 记录入口下线与前端内容接入 | YYC³ Team |
| v1.1.1 | 2026-11-07 | 内容查询与 PG 测试库落地 | YYC³ Team |
| v1.1.0 | 2026-11-07 | 查询层接入与入口切换完成 | YYC³ Team |
| v1.0.0 | 2026-11-07 | 建立 PostgreSQL 适配与迁移指南：m98 schema、迁移/导入/校验脚本、实测结果与回滚方案 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
