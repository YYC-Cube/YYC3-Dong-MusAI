#!/bin/bash

# M98项目 - SQLite配置脚本

echo "🎵 M98项目SQLite数据库配置"
echo "================================"

echo "📦 配置SQLite数据库..."

# 创建数据库目录
mkdir -p /Users/yanyu/D-98/M98_DongXiaoJie/database

# 创建数据库文件
sqlite3 /Users/yanyu/D-98/M98_DongXiaoJie/database/m98.db << EOF
-- 创建艺术家表
CREATE TABLE artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    genres TEXT, -- JSON格式
    stats TEXT,  -- JSON格式
    social_links TEXT, -- JSON格式
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建音乐作品表
CREATE TABLE releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    release_date DATE,
    type TEXT DEFAULT 'single',
    cover_art TEXT,
    tracks TEXT, -- JSON格式
    stats TEXT,  -- JSON格式
    is_exclusive BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- 创建粉丝表
CREATE TABLE fans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    avatar TEXT,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建粉丝互动表
CREATE TABLE fan_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fan_id INTEGER,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fan_id) REFERENCES fans(id)
);

-- 插入初始数据
INSERT INTO artists (artist_id, name, bio, genres, stats, social_links) VALUES (
    'M98',
    '董小姐',
    '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。',
    '["电子", "融合", "东方韵律", "未来音乐"]',
    '{"monthlyListeners": 128000, "totalPlays": 2400000, "followers": 64200}',
    '{"weibo": "https://weibo.com/m98dongxiaojie", "douyin": "@m98dongxiaojie", "bilibili": "https://space.bilibili.com/m98"}'
);

SELECT 'SQLite数据库创建完成！' as message;
.quit
EOF

echo "✅ SQLite数据库配置完成！"
echo ""
echo "📱 数据库信息："
echo "- 文件位置: /Users/yanyu/D-98/M98_DongXiaoJie/database/m98.db"
echo "- 类型: SQLite"
echo "- 大小: $(du -h /Users/yanyu/D-98/M98_DongXiaoJie/database/m98.db | cut -f1)"
echo ""
echo "🔧 管理命令："
echo "- 连接: sqlite3 /Users/yanyu/D-98/M98_DongXiaoJie/database/m98.db"
echo "- 查看表: .tables"
echo "- 查看数据: SELECT * FROM artists;"
