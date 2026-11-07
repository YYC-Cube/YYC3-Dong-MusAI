const express = require('express');
const router = express.Router();

// 模拟艺术家数据
const mockArtistData = {
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
};

/**
 * @swagger
 * /api/artist/profile:
 *   get:
 *     summary: 获取艺术家信息
 *     tags: [Artist]
 *     responses:
 *       200:
 *         description: 成功获取艺术家信息
 */
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: mockArtistData
  });
});

/**
 * @swagger
 * /api/artist/stats:
 *   get:
 *     summary: 获取艺术家统计数据
 *     tags: [Artist]
 */
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      ...mockArtistData.stats,
      totalReleases: 12,
      latestRelease: {
        title: '东方夜曲',
        releaseDate: new Date('2024-12-15')
      }
    }
  });
});

/**
 * @swagger
 * /api/artist/latest-activity:
 *   get:
 *     summary: 获取最新动态
 *     tags: [Artist]
 */
router.get('/latest-activity', (req, res) => {
  const socialActivity = [
    {
      platform: 'weibo',
      content: '新作品《东方夜曲》正在制作中，融合了更多传统乐器元素 🎵',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 1247,
      comments: 89
    },
    {
      platform: 'douyin',
      content: '工作室花絮：古筝与合成器的完美结合',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 5632,
      comments: 234
    }
  ];

  res.json({
    success: true,
    data: {
      latestReleases: [],
      socialActivity
    }
  });
});

module.exports = router;
