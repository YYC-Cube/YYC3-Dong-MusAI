const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// SQLite数据库配置
const DB_PATH = path.join(__dirname, '../../database/m98_database.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ SQLite连接失败:', err.message);
  } else {
    console.log('✅ SQLite数据库连接成功');
  }
});

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'M98 API (SQLite)',
      version: '1.0.0',
      description: '董小姐(M98)官方API服务 - SQLite版本',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发环境',
      },
    ],
  },
  apis: ['./src/server-sqlite.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'M98 API Service',
    version: '1.0.0',
    database: 'SQLite',
    dbPath: DB_PATH
  });
});

/**
 * @swagger
 * /api/artist/profile:
 *   get:
 *     summary: 获取艺术家信息
 *     tags: [Artist]
 */
app.get('/api/artist/profile', (req, res) => {
  const query = `
    SELECT artistId, name, bio, genres, stats, socialLinks, createdAt 
    FROM artists WHERE artistId = ?
  `;
  
  db.get(query, ['M98'], (err, row) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return res.status(500).json({ success: false, message: '查询失败' });
    }
    
    if (!row) {
      return res.status(404).json({ success: false, message: '艺术家不存在' });
    }
    
    // 解析JSON字段
    try {
      row.genres = JSON.parse(row.genres || '[]');
      row.stats = JSON.parse(row.stats || '{}');
      row.socialLinks = JSON.parse(row.socialLinks || '{}');
    } catch (parseErr) {
      console.error('JSON解析错误:', parseErr);
    }
    
    res.json({
      success: true,
      data: row
    });
  });
});

/**
 * @swagger
 * /api/music/releases:
 *   get:
 *     summary: 获取音乐作品列表
 *     tags: [Music]
 */
app.get('/api/music/releases', (req, res) => {
  const { limit = 10, page = 1, type } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, title, artistId, releaseDate, type, coverArt, tracks, stats
    FROM releases
  `;
  let params = [];
  
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  
  query += ' ORDER BY releaseDate DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return res.status(500).json({ success: false, message: '查询失败' });
    }
    
    // 解析JSON字段
    const releases = rows.map(row => {
      try {
        row.tracks = JSON.parse(row.tracks || '[]');
        row.stats = JSON.parse(row.stats || '{}');
      } catch (parseErr) {
        console.error('JSON解析错误:', parseErr);
      }
      return row;
    });
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM releases';
    let countParams = [];
    
    if (type) {
      countQuery += ' WHERE type = ?';
      countParams.push(type);
    }
    
    db.get(countQuery, countParams, (countErr, countRow) => {
      const total = countRow ? countRow.total : 0;
      
      res.json({
        success: true,
        data: {
          releases,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasMore: offset + releases.length < total
          }
        }
      });
    });
  });
});

/**
 * @swagger
 * /api/music/featured:
 *   get:
 *     summary: 获取精选作品
 *     tags: [Music]
 */
app.get('/api/music/featured', (req, res) => {
  const query = `
    SELECT id, title, artistId, releaseDate, type, coverArt, tracks, stats
    FROM releases
    ORDER BY json_extract(stats, '$.plays') DESC
    LIMIT 3
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return res.status(500).json({ success: false, message: '查询失败' });
    }
    
    const featured = rows.map(row => {
      try {
        row.tracks = JSON.parse(row.tracks || '[]');
        row.stats = JSON.parse(row.stats || '{}');
      } catch (parseErr) {
        console.error('JSON解析错误:', parseErr);
      }
      return row;
    });
    
    res.json({
      success: true,
      data: featured
    });
  });
});

/**
 * @swagger
 * /api/fans/wall:
 *   get:
 *     summary: 获取粉丝互动墙
 *     tags: [Fans]
 */
app.get('/api/fans/wall', (req, res) => {
  const query = `
    SELECT id, username, avatar, message, type, likes, createdAt
    FROM fan_messages
    ORDER BY createdAt DESC
    LIMIT 20
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return res.status(500).json({ success: false, message: '查询失败' });
    }
    
    // 转换时间戳为相对时间
    const messages = rows.map(row => ({
      ...row,
      timestamp: new Date(row.createdAt)
    }));
    
    res.json({
      success: true,
      data: messages
    });
  });
});

/**
 * @swagger
 * /api/music/{id}/play:
 *   post:
 *     summary: 记录播放次数
 *     tags: [Music]
 */
app.post('/api/music/:id/play', (req, res) => {
  const releaseId = req.params.id;
  
  // 获取当前统计数据
  db.get('SELECT stats FROM releases WHERE id = ?', [releaseId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ success: false, message: '作品不存在' });
    }
    
    try {
      const stats = JSON.parse(row.stats || '{}');
      stats.plays = (stats.plays || 0) + 1;
      
      // 更新播放次数
      db.run(
        'UPDATE releases SET stats = ? WHERE id = ?',
        [JSON.stringify(stats), releaseId],
        function(updateErr) {
          if (updateErr) {
            return res.status(500).json({ success: false, message: '更新失败' });
          }
          
          res.json({
            success: true,
            message: '播放记录成功',
            data: { plays: stats.plays }
          });
        }
      );
    } catch (parseErr) {
      res.status(500).json({ success: false, message: '数据解析错误' });
    }
  });
});

// 管理后台鉴权与数据
app.use('/api/auth', require('./routes/authRoutes')());
app.use('/api/admin', require('./routes/adminRoutes')(db));

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({ 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 M98 API服务启动成功，端口: ${PORT}`);
  console.log(`📖 API文档: http://localhost:${PORT}/docs`);
  console.log(`💾 数据库: SQLite (${DB_PATH})`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n⏸️  正在关闭服务...');
  db.close((err) => {
    if (err) {
      console.error('关闭数据库连接失败:', err.message);
    } else {
      console.log('✅ 数据库连接已关闭');
    }
    process.exit(0);
  });
});

module.exports = app;
