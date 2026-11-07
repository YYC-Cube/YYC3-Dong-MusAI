const express = require('express');
const router = express.Router();

// 模拟音乐数据
const mockReleases = [
  {
    _id: '1',
    title: '东方夜曲',
    artistId: 'M98',
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
    _id: '2',
    title: '数字禅境',
    artistId: 'M98',
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
    _id: '3',
    title: '未来丝路',
    artistId: 'M98',
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

/**
 * @swagger
 * /api/music/releases:
 *   get:
 *     summary: 获取音乐作品列表
 *     tags: [Music]
 */
router.get('/releases', (req, res) => {
  const { limit = 10, page = 1, type } = req.query;
  
  let filteredReleases = mockReleases;
  if (type) {
    filteredReleases = mockReleases.filter(release => release.type === type);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedReleases = filteredReleases.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      releases: paginatedReleases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredReleases.length / limit),
        totalItems: filteredReleases.length,
        hasMore: endIndex < filteredReleases.length
      }
    }
  });
});

/**
 * @swagger
 * /api/music/featured:
 *   get:
 *     summary: 获取精选作品
 *     tags: [Music]
 */
router.get('/featured', (req, res) => {
  const featured = mockReleases
    .sort((a, b) => b.stats.plays - a.stats.plays)
    .slice(0, 3);

  res.json({
    success: true,
    data: featured
  });
});

/**
 * @swagger
 * /api/music/latest:
 *   get:
 *     summary: 获取最新作品
 *     tags: [Music]
 */
router.get('/latest', (req, res) => {
  const latest = mockReleases
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0];

  res.json({
    success: true,
    data: latest
  });
});

/**
 * @swagger
 * /api/music/{id}/play:
 *   post:
 *     summary: 记录播放次数
 *     tags: [Music]
 */
router.post('/:id/play', (req, res) => {
  const release = mockReleases.find(r => r._id === req.params.id);
  if (!release) {
    return res.status(404).json({
      success: false,
      message: '作品不存在'
    });
  }

  // 模拟增加播放次数
  release.stats.plays += 1;

  res.json({
    success: true,
    message: '播放记录成功',
    data: { plays: release.stats.plays }
  });
});

module.exports = router;
