const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const artistRouter = require('../src/routes/artistRoutes');

// 创建测试用 Express app
const app = express();
app.use(express.json());
app.use('/api/artist', artistRouter);

// 增加超时时间
jest.setTimeout(20000);

describe('Artist API 路由', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/m98_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  test('GET /api/artist/profile 应返回艺术家信息', async () => {
    const res = await request(app).get('/api/artist/profile');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('bio');
  });

  test('GET /api/artist/stats 应返回统计数据', async () => {
    const res = await request(app).get('/api/artist/stats');
    // 200 或 404（首次无数据时）
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('monthlyListeners');
      expect(res.body.data).toHaveProperty('totalReleases');
    } else {
      expect(res.body.success).toBe(false);
    }
  });

  test('GET /api/artist/latest-activity 应返回最新动态', async () => {
    const res = await request(app).get('/api/artist/latest-activity');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('latestReleases');
    expect(res.body.data).toHaveProperty('socialActivity');
  });
});
