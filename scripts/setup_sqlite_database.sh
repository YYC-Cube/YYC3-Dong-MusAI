#!/bin/bash

# M98项目 - SQLite数据库配置脚本（无需权限）

echo "🎵 M98项目SQLite数据库配置"
echo "================================"

# 检查sqlite3是否可用
if ! command -v sqlite3 &> /dev/null; then
    echo "❌ SQLite3未找到"
    echo "💡 SQLite通常已预装在macOS上"
    exit 1
fi

echo "✅ SQLite3可用"

# 创建数据库目录
DB_DIR="/Users/yanyu/D-98/M98_DongXiaoJie/database"
mkdir -p "$DB_DIR"

DB_FILE="$DB_DIR/m98_database.sqlite"

echo "📊 创建M98数据库: $DB_FILE"

# 创建数据表
sqlite3 "$DB_FILE" << 'EOF'
-- 艺术家表
CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artistId TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    genres TEXT, -- JSON array as text
    stats TEXT,  -- JSON object as text
    socialLinks TEXT, -- JSON object as text
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 音乐作品表
CREATE TABLE IF NOT EXISTS releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artistId TEXT NOT NULL,
    releaseDate DATE,
    type TEXT DEFAULT 'single',
    coverArt TEXT,
    tracks TEXT, -- JSON array as text
    stats TEXT,  -- JSON object as text
    isExclusive BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artistId) REFERENCES artists(artistId)
);

-- 粉丝互动表
CREATE TABLE IF NOT EXISTS fan_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    avatar TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    likes INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始数据
INSERT OR REPLACE INTO artists (artistId, name, bio, genres, stats, socialLinks) VALUES (
    'M98',
    '董小姐',
    '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。',
    '["电子", "融合", "东方韵律", "未来音乐"]',
    '{"monthlyListeners": 128000, "totalPlays": 2400000, "followers": 64200}',
    '{"weibo": "https://weibo.com/m98dongxiaojie", "douyin": "@m98dongxiaojie", "bilibili": "https://space.bilibili.com/m98"}'
);

-- 插入音乐作品
INSERT OR REPLACE INTO releases (id, title, artistId, releaseDate, type, coverArt, tracks, stats) VALUES 
(1, '东方夜曲', 'M98', '2024-12-15', 'single', '/assets/covers/dongfang-yequ.jpg',
 '[{"title": "东方夜曲", "duration": 245, "streamUrl": "/music/dongfang-yequ.mp3"}]',
 '{"plays": 45230, "downloads": 3420, "shares": 890}'),
(2, '数字禅境', 'M98', '2024-11-28', 'single', '/assets/covers/shuzi-chanjing.jpg',
 '[{"title": "数字禅境", "duration": 198, "streamUrl": "/music/shuzi-chanjing.mp3"}]',
 '{"plays": 67890, "downloads": 5120, "shares": 1240}'),
(3, '未来丝路', 'M98', '2024-10-20', 'single', '/assets/covers/weilai-silu.jpg',
 '[{"title": "未来丝路", "duration": 287, "streamUrl": "/music/weilai-silu.mp3"}]',
 '{"plays": 89540, "downloads": 7230, "shares": 1680}');

-- 插入粉丝消息
INSERT INTO fan_messages (username, avatar, message, likes) VALUES
('夜听者', '/assets/avatars/fan1.jpg', '《东方夜曲》真的太棒了！古筝与电子的结合太有创意了 🎵', 42),
('电音小仙女', '/assets/avatars/fan2.jpg', '期待下一首作品！董小姐的音乐总是能带给我力量 💪', 67),
('深夜听歌人', '/assets/avatars/fan3.jpg', '每次听董小姐的音乐都有种穿越时空的感觉 ✨', 89);

EOF

if [ $? -eq 0 ]; then
    echo "✅ SQLite数据库创建成功！"
else
    echo "❌ 数据库创建失败"
    exit 1
fi

# 验证数据
echo "🧪 验证数据..."
ARTIST_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM artists;")
RELEASE_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM releases;")
MESSAGE_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM fan_messages;")

echo "📊 数据统计："
echo "- 艺术家: $ARTIST_COUNT"
echo "- 音乐作品: $RELEASE_COUNT"  
echo "- 粉丝消息: $MESSAGE_COUNT"

echo ""
echo "🎉 SQLite数据库配置完成！"
echo ""
echo "📱 数据库信息："
echo "- 数据库文件: $DB_FILE"
echo "- 类型: SQLite"
echo "- 大小: $(ls -lh "$DB_FILE" | awk '{print $5}')"
echo ""
echo "🔧 管理命令："
echo "- 查看数据: sqlite3 \"$DB_FILE\" \".tables\""
echo "- 查询艺术家: sqlite3 \"$DB_FILE\" \"SELECT * FROM artists;\""
echo "- 查询音乐: sqlite3 \"$DB_FILE\" \"SELECT title, artistId FROM releases;\""
echo ""
echo "💡 接下来需要修改API服务使用SQLite数据库"
