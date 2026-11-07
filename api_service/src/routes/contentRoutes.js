const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/content/exclusive:
 *   get:
 *     summary: 获取独家内容
 *     tags: [Content]
 */
router.get('/exclusive', async (req, res) => {
  try {
    const exclusiveContent = [
      {
        id: 1,
        title: '制作花絮：《东方夜曲》背后的故事',
        type: 'video',
        thumbnail: '/assets/exclusive/behind-scenes-1.jpg',
        description: '深入了解《东方夜曲》的创作过程，从灵感到成品的完整记录',
        duration: '8:32',
        releaseDate: new Date('2024-12-20'),
        isLocked: false
      },
      {
        id: 2,
        title: '古筝与合成器的对话',
        type: 'audio',
        thumbnail: '/assets/exclusive/dialogue-preview.jpg',
        description: '试听版本：传统乐器与现代电子的即兴创作片段',
        duration: '3:45',
        releaseDate: new Date('2024-12-18'),
        isLocked: false
      },
      {
        id: 3,
        title: '工作室直播录像：新作品预览',
        type: 'video',
        thumbnail: '/assets/exclusive/studio-live.jpg',
        description: '12月15日工作室直播完整录像，包含新作品片段',
        duration: '45:12',
        releaseDate: new Date('2024-12-15'),
        isLocked: true,
        unlockCondition: '关注满30天'
      },
      {
        id: 4,
        title: '东方电子音乐制作教程',
        type: 'video',
        thumbnail: '/assets/exclusive/tutorial-preview.jpg',
        description: '董小姐亲自讲解如何将传统东方元素融入现代电子音乐',
        duration: '25:18',
        releaseDate: new Date('2024-12-10'),
        isLocked: true,
        unlockCondition: '铁杆粉丝等级'
      }
    ];

    res.json({
      success: true,
      data: exclusiveContent
    });
  } catch (error) {
    console.error('获取独家内容失败:', error);
    res.status(500).json({
      success: false,
      message: '获取独家内容失败'
    });
  }
});

/**
 * @swagger
 * /api/content/blog:
 *   get:
 *     summary: 获取博客文章
 *     tags: [Content]
 */
router.get('/blog', async (req, res) => {
  try {
    const blogPosts = [
      {
        id: 1,
        title: '我的音乐创作理念：东方与未来的对话',
        excerpt: '在这个快速变化的时代，我一直在思考如何将我们深厚的东方文化底蕴与现代电子音乐完美融合...',
        content: '完整文章内容...',
        publishDate: new Date('2024-12-22'),
        readTime: 8,
        tags: ['创作理念', '东方音乐', '电子音乐'],
        coverImage: '/assets/blog/philosophy-cover.jpg'
      },
      {
        id: 2,
        title: '制作《东方夜曲》的技术细节分享',
        excerpt: '很多朋友问我《东方夜曲》是如何制作的，今天就来详细分享一下技术层面的内容...',
        content: '完整文章内容...',
        publishDate: new Date('2024-12-20'),
        readTime: 12,
        tags: ['制作技巧', 'DAW', '混音'],
        coverImage: '/assets/blog/production-cover.jpg'
      }
    ];

    res.json({
      success: true,
      data: blogPosts
    });
  } catch (error) {
    console.error('获取博客文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取博客文章失败'
    });
  }
});

/**
 * @swagger
 * /api/content/events:
 *   get:
 *     summary: 获取活动信息
 *     tags: [Content]
 */
router.get('/events', async (req, res) => {
  try {
    const events = [
      {
        id: 1,
        title: '新年电子音乐会：东方未来之夜',
        description: '2025年新年特别演出，现场演绎经典作品并首发新曲',
        date: new Date('2025-01-01'),
        location: '上海 M50创意园区',
        ticketPrice: '¥180-580',
        status: 'upcoming',
        image: '/assets/events/new-year-concert.jpg'
      },
      {
        id: 2,
        title: '粉丝见面会 & 新专辑发布',
        description: '与粉丝近距离互动，分享创作故事，首次公开新专辑完整曲目',
        date: new Date('2025-02-14'),
        location: '北京 798艺术区',
        ticketPrice: '¥120-380',
        status: 'upcoming',
        image: '/assets/events/fan-meetup.jpg'
      },
      {
        id: 3,
        title: '电子音乐制作工作坊',
        description: '小班制教学，董小姐亲自指导，学习东方电子音乐制作技巧',
        date: new Date('2025-03-15'),
        location: '深圳 华侨城创意园',
        ticketPrice: '¥480',
        status: 'upcoming',
        image: '/assets/events/workshop.jpg'
      }
    ];

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('获取活动信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动信息失败'
    });
  }
});

module.exports = router;
