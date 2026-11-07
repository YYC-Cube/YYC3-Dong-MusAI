const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/fans/wall:
 *   get:
 *     summary: 获取粉丝互动墙消息
 *     tags: [Fans]
 */
router.get('/wall', async (req, res) => {
  try {
    // 模拟粉丝互动数据
    const fanMessages = [
      {
        id: 1,
        username: '夜听者',
        avatar: '/assets/avatars/fan1.jpg',
        message: '《东方夜曲》真的太棒了！古筝与电子的结合太有创意了 🎵',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1小时前
        likes: 42,
        type: 'text'
      },
      {
        id: 2,
        username: '电音小仙女',
        avatar: '/assets/avatars/fan2.jpg',
        message: '期待下一首作品！董小姐的音乐总是能带给我力量 💪',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
        likes: 67,
        type: 'text'
      },
      {
        id: 3,
        username: '音乐制作爱好者',
        avatar: '/assets/avatars/fan3.jpg',
        message: '想知道《数字禅境》是用什么软件制作的？',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
        likes: 23,
        type: 'question'
      },
      {
        id: 4,
        username: '深夜听歌人',
        avatar: '/assets/avatars/fan4.jpg',
        message: '每次听董小姐的音乐都有种穿越时空的感觉 ✨',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8小时前
        likes: 89,
        type: 'text'
      }
    ];

    res.json({
      success: true,
      data: fanMessages
    });
  } catch (error) {
    console.error('获取粉丝互动失败:', error);
    res.status(500).json({
      success: false,
      message: '获取粉丝互动失败'
    });
  }
});

/**
 * @swagger
 * /api/fans/stats:
 *   get:
 *     summary: 获取粉丝统计数据
 *     tags: [Fans]
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalFans: 64200,
      activeToday: 2340,
      newThisWeek: 890,
      topCountries: [
        { country: '中国', percentage: 78 },
        { country: '美国', percentage: 8 },
        { country: '日本', percentage: 5 },
        { country: '韩国', percentage: 4 },
        { country: '其他', percentage: 5 }
      ],
      ageGroups: [
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 40 },
        { age: '35-44', percentage: 20 },
        { age: '45+', percentage: 5 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取粉丝统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取粉丝统计失败'
    });
  }
});

module.exports = router;
