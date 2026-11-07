const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
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
      title: 'M98 API',
      version: '1.0.0',
      description: '董小姐(M98)官方API服务',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发环境',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
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
    database: 'Mock Mode - No MongoDB Required'
  });
});

// 模拟数据路由 (无需数据库)
app.use('/api/artist', require('./routes/artistRoutes-mock'));
app.use('/api/music', require('./routes/musicRoutes-mock'));
app.use('/api/fans', require('./routes/fanRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));

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
  console.log(`💡 运行模式: Mock Mode (无需数据库)`);
});

module.exports = app;
