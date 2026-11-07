const express = require('express');
const mongoose = require('mongoose');
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

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/m98_database';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB连接成功');
    
    // 初始化数据
    await initializeData();
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error);
    console.log('💡 正在切换到Mock模式...');
    global.useMockData = true;
  }
};

// 初始化数据函数
const initializeData = async () => {
  const Artist = require('./models/Artist');
  const Release = require('./models/Release');
  
  // 检查是否已有艺术家数据
  const existingArtist = await Artist.findOne({ artistId: 'M98' });
  
  if (!existingArtist) {
    console.log('🎵 正在创建初始艺术家数据...');
    
    const artist = new Artist({
      artistId: 'M98',
      name: '董小姐',
      bio: '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。擅长将古典乐器如古筝、竹笛与合成器、鼓机完美结合，营造出既有现代感又富有东方韵味的音乐空间。',
      genres: ['电子', '融合', '东方韵律', '未来音乐'],
      stats: {
        monthlyListeners: 128000,
        totalPlays: 2400000,
        followers: 64200
      },
      socialLinks: {
        weibo: 'https://weibo.com/m98dongxiaojie',
        douyin: '@m98dongxiaojie',
        bilibili: 'https://space.bilibili.com/m98',
        xiaohongshu: '@董小姐M98'
      }
    });
    
    await artist.save();
    console.log('✅ 艺术家数据创建完成');
    
    // 创建示例音乐作品
    const sampleReleases = [
      {
        title: '东方夜曲',
        artistId: 'M98',
        artist: artist._id,
        releaseDate: new Date('2024-12-15'),
        type: 'single',
        coverArt: '/assets/covers/dongfang-yequ.jpg',
        tracks: [{
          title: '东方夜曲',
          duration: 245,
          streamUrl: '/music/dongfang-yequ.mp3',
          lyrics: '夜色如水，古韵悠长\n电子节拍，东方之光\n科技与传统的融合\n创造属于未来的乐章'
        }],
        stats: { plays: 45230, downloads: 3420, shares: 890 }
      },
      {
        title: '数字禅境',
        artistId: 'M98',
        artist: artist._id,
        releaseDate: new Date('2024-11-28'),
        type: 'single',
        coverArt: '/assets/covers/shuzi-chanjing.jpg',
        tracks: [{
          title: '数字禅境',
          duration: 198,
          streamUrl: '/music/shuzi-chanjing.mp3',
          lyrics: '数字世界，禅意空间\n科技与心灵的对话\n虚拟现实中寻找真实\n在代码里悟出人生'
        }],
        stats: { plays: 67890, downloads: 5120, shares: 1240 }
      },
      {
        title: '未来丝路',
        artistId: 'M98',
        artist: artist._id,
        releaseDate: new Date('2024-10-20'),
        type: 'single',
        coverArt: '/assets/covers/weilai-silu.jpg',
        tracks: [{
          title: '未来丝路',
          duration: 287,
          streamUrl: '/music/weilai-silu.mp3',
          lyrics: '丝路延伸，向着未来\n传统与现代的交融\n古老的智慧指引方向\n科技的力量推动前行'
        }],
        stats: { plays: 89540, downloads: 7230, shares: 1680 }
      }
    ];
    
    for (const releaseData of sampleReleases) {
      const release = new Release(releaseData);
      await release.save();
    }
    
    console.log('✅ 示例音乐作品创建完成');
  } else {
    console.log('💡 数据库已有数据，跳过初始化');
  }
};

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'M98 API',
      version: '1.0.0',
      description: '董小姐(M98)官方API服务 - MongoDB版本',
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
  const dbStatus = global.useMockData ? 'Mock Mode' : 'MongoDB Connected';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'M98 API Service',
    version: '1.0.0',
    database: dbStatus,
    mongooseState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 路由 - 支持MongoDB和Mock模式
app.use('/api/artist', require('./routes/artistRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
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
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    const dbMode = global.useMockData ? 'Mock模式' : 'MongoDB模式';
    console.log(`🚀 M98 API服务启动成功，端口: ${PORT}`);
    console.log(`📖 API文档: http://localhost:${PORT}/docs`);
    console.log(`💾 数据库模式: ${dbMode}`);
  });
};

startServer().catch(console.error);

module.exports = app;
