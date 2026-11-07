-- ============================================================
-- YYC³（YanYuCloudCube™ · 注册商标）· 言启象限 | 语枢未来
-- 万象归元于云枢 | 深栈智启新纪元
-- ============================================================
-- @Project : M98 董小姐音乐宇宙
-- @File    : 001_init.sql
-- @Author  : YYC³ Team
-- @Date    : 2026-11-07
-- @Email   : admin@0379.email
-- @License : MIT（仅代码）
-- @Desc    : PostgreSQL 15 适配层初始化 —— m98 schema、核心表、索引与触发器
-- ============================================================

CREATE SCHEMA IF NOT EXISTS m98;
SET search_path TO m98, public;

COMMENT ON SCHEMA m98 IS 'M98 API 适配层：与 public 既有音乐平台 schema 隔离，避免命名冲突';

-- ------------------------------------------------------------
-- 迁移记录
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_migrations (
    version    TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 艺人
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artists (
    id           BIGSERIAL PRIMARY KEY,
    artist_id    TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    bio          TEXT,
    genres       JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats        JSONB NOT NULL DEFAULT '{}'::jsonb,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.artists IS '艺人档案（迁移自 SQLite artists）';
COMMENT ON COLUMN m98.artists.stats IS 'monthlyListeners / totalPlays / followers';

-- ------------------------------------------------------------
-- 作品
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS releases (
    id           BIGSERIAL PRIMARY KEY,
    legacy_id    INTEGER UNIQUE,
    title        TEXT NOT NULL,
    artist_id    TEXT NOT NULL REFERENCES artists (artist_id) ON DELETE CASCADE,
    release_date DATE,
    type         TEXT NOT NULL DEFAULT 'single'
                 CHECK (type IN ('single', 'ep', 'album', 'remix')),
    cover_art    TEXT,
    tracks       JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats        JSONB NOT NULL DEFAULT '{"plays":0,"downloads":0,"shares":0}'::jsonb,
    is_exclusive BOOLEAN NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.releases IS '作品/单曲（迁移自 SQLite releases）';
COMMENT ON COLUMN m98.releases.legacy_id IS 'SQLite 原主键，用于幂等导入与追溯';
COMMENT ON COLUMN m98.releases.tracks IS '曲目数组：title/duration/streamUrl/lyrics/credits';

-- ------------------------------------------------------------
-- 粉丝留言
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fan_messages (
    id         BIGSERIAL PRIMARY KEY,
    legacy_id  INTEGER UNIQUE,
    username   TEXT NOT NULL,
    avatar     TEXT,
    message    TEXT NOT NULL,
    type       TEXT NOT NULL DEFAULT 'text',
    likes      INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.fan_messages IS '粉丝互动墙留言（迁移自 SQLite fan_messages）';

-- ------------------------------------------------------------
-- 独家内容
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exclusive_content (
    id               BIGSERIAL PRIMARY KEY,
    title            TEXT NOT NULL,
    type             TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'audio')),
    thumbnail        TEXT,
    description      TEXT,
    duration         TEXT,
    release_date     DATE,
    is_locked        BOOLEAN NOT NULL DEFAULT false,
    unlock_condition TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.exclusive_content IS '独家内容（对应 /api/content/exclusive）';

-- ------------------------------------------------------------
-- 博客文章
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
    id           BIGSERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    excerpt      TEXT,
    content      TEXT,
    publish_date DATE,
    read_time    INTEGER CHECK (read_time IS NULL OR read_time >= 0),
    tags         JSONB NOT NULL DEFAULT '[]'::jsonb,
    cover_image  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.blog_posts IS '博客文章（对应 /api/content/blog）';

-- ------------------------------------------------------------
-- 活动
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id           BIGSERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    description  TEXT,
    event_date   DATE,
    location     TEXT,
    ticket_price TEXT,
    status       TEXT NOT NULL DEFAULT 'upcoming'
                 CHECK (status IN ('upcoming', 'ongoing', 'ended', 'cancelled')),
    image        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE m98.events IS '线下/线上活动（对应 /api/content/events）';

-- ------------------------------------------------------------
-- updated_at 触发器
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_artists_updated_at ON artists;
CREATE TRIGGER trg_artists_updated_at
    BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_releases_updated_at ON releases;
CREATE TRIGGER trg_releases_updated_at
    BEFORE UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_fan_messages_updated_at ON fan_messages;
CREATE TRIGGER trg_fan_messages_updated_at
    BEFORE UPDATE ON fan_messages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_exclusive_content_updated_at ON exclusive_content;
CREATE TRIGGER trg_exclusive_content_updated_at
    BEFORE UPDATE ON exclusive_content
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 索引
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_releases_artist_date
    ON releases (artist_id, release_date DESC);

CREATE INDEX IF NOT EXISTS idx_releases_type
    ON releases (type);

CREATE INDEX IF NOT EXISTS idx_releases_plays
    ON releases (((stats ->> 'plays')::int) DESC);

CREATE INDEX IF NOT EXISTS idx_fan_messages_created
    ON fan_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exclusive_content_date
    ON exclusive_content (release_date DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_publish
    ON blog_posts (publish_date DESC);

CREATE INDEX IF NOT EXISTS idx_events_date
    ON events (event_date DESC);

-- --- YYC³ End of File ---
