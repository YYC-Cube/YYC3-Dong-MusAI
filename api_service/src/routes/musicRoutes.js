const express = require('express');
const router = express.Router();
const Release = require('../models/Release');
const Artist = require('../models/Artist');

/**
 * @swagger
 * /api/music/releases:
 *   get:
 *     summary: 获取音乐作品列表
 *     tags: [Music]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 返回结果数量限制
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *     responses:
 *       200:
 *         description: 成功获取作品列表
 */
router.get('/releases', async (req, res) => {
  try {
    const { limit = 10, page = 1, type } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { artistId: 'M98' };
    if (type) {
      query.type = type;
    }

    const releases = await Release.find(query)
      .sort({ releaseDate: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('artist');

    const total = await Release.countDocuments(query);

    // 如果没有数据，创建一些示例数据
    if (releases.length === 0) {
      let artist = await Artist.findOne({ artistId: 'M98' });
      if (!artist) {
        artist = await Artist.create({
          artistId: 'M98',
          name: '董小姐',
          bio: '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。',
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
      }
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
            lyrics: '夜色如水，古韵悠长\n电子节拍，东方之光...'
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
            lyrics: '数字世界，禅意空间\n科技与心灵的对话...'
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
            lyrics: '丝路延伸，向着未来\n传统与现代的交融...'
          }],
          stats: { plays: 89540, downloads: 7230, shares: 1680 }
        }
      ];

      for (const releaseData of sampleReleases) {
        const release = new Release(releaseData);
        await release.save();
      }

      // 重新查询数据
      const newReleases = await Release.find(query)
        .sort({ releaseDate: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .populate('artist');

      return res.json({
        success: true,
        data: {
          releases: newReleases,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(sampleReleases.length / limit),
            totalItems: sampleReleases.length,
            hasMore: skip + newReleases.length < sampleReleases.length
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        releases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasMore: skip + releases.length < total
        }
      }
    });
  } catch (error) {
    console.error('获取音乐作品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取音乐作品失败'
    });
  }
});

/**
 * @swagger
 * /api/music/featured:
 *   get:
 *     summary: 获取精选作品
 *     tags: [Music]
 */
router.get('/featured', async (req, res) => {
  try {
    // 获取播放量最高的作品
    const featured = await Release.find({ artistId: 'M98' })
      .sort({ 'stats.plays': -1 })
      .limit(3)
      .populate('artist');

    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    console.error('获取精选作品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取精选作品失败'
    });
  }
});

/**
 * @swagger
 * /api/music/latest:
 *   get:
 *     summary: 获取最新作品
 *     tags: [Music]
 */
router.get('/latest', async (req, res) => {
  try {
    const latest = await Release.findOne({ artistId: 'M98' })
      .sort({ releaseDate: -1 })
      .populate('artist');

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: '暂无作品'
      });
    }

    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    console.error('获取最新作品失败:', error);
    res.status(500).json({
      success: false,
      message: '获取最新作品失败'
    });
  }
});

/**
 * @swagger
 * /api/music/{id}/play:
 *   post:
 *     summary: 记录播放次数
 *     tags: [Music]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 作品ID
 */
router.post('/:id/play', async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) {
      return res.status(404).json({
        success: false,
        message: '作品不存在'
      });
    }

    // 增加播放次数
    release.stats.plays += 1;
    await release.save();

    res.json({
      success: true,
      message: '播放记录成功',
      data: { plays: release.stats.plays }
    });
  } catch (error) {
    console.error('记录播放失败:', error);
    res.status(500).json({
      success: false,
      message: '记录播放失败'
    });
  }
});

module.exports = router;
