const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const Release = require('../models/Release');

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
router.get('/profile', async (req, res) => {
  try {
    let artist = await Artist.findOne({ artistId: 'M98' })
      .populate('discography'); // .populate('exclusiveContent') 暂时移除，避免 MissingSchemaError
    
    if (!artist) {
      // 如果没有艺术家数据，创建默认数据
      artist = new Artist({
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
    }
    
    res.json({
      success: true,
      data: artist
    });
  } catch (error) {
    console.error('获取艺术家信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取艺术家信息失败'
    });
  }
});

/**
 * @swagger
 * /api/artist/stats:
 *   get:
 *     summary: 获取艺术家统计数据
 *     tags: [Artist]
 */
router.get('/stats', async (req, res) => {
  try {
    const artist = await Artist.findOne({ artistId: 'M98' });
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: '艺术家信息不存在'
      });
    }

    // 获取最新的统计数据
    const totalReleases = await Release.countDocuments({ artistId: 'M98' });
    const latestRelease = await Release.findOne({ artistId: 'M98' })
      .sort({ releaseDate: -1 });

    res.json({
      success: true,
      data: {
        ...artist.stats,
        totalReleases,
        latestRelease: latestRelease ? {
          title: latestRelease.title,
          releaseDate: latestRelease.releaseDate
        } : null
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
});

/**
 * @swagger
 * /api/artist/latest-activity:
 *   get:
 *     summary: 获取最新动态
 *     tags: [Artist]
 */
router.get('/latest-activity', async (req, res) => {
  try {
    // 获取最新发布的音乐作品
    const latestReleases = await Release.find({ artistId: 'M98' })
      .sort({ releaseDate: -1 })
      .limit(5);

    // 模拟社交媒体动态（后续可以接入真实API）
    const socialActivity = [
      {
        platform: 'weibo',
        content: '新作品《东方夜曲》正在制作中，融合了更多传统乐器元素 🎵',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        likes: 1247,
        comments: 89
      },
      {
        platform: 'douyin',
        content: '工作室花絮：古筝与合成器的完美结合',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
        likes: 5632,
        comments: 234
      }
    ];

    res.json({
      success: true,
      data: {
        latestReleases,
        socialActivity
      }
    });
  } catch (error) {
    console.error('获取最新动态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取最新动态失败'
    });
  }
});

module.exports = router;
