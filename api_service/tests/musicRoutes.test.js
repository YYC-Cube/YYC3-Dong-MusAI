const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const musicRouter = require('../src/routes/musicRoutes');

// 创建测试用 Express app
const app = express();
app.use(express.json());
app.use('/api/music', musicRouter);

// 增加超时时间
jest.setTimeout(20000);

describe('Music API 路由', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/m98_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  test('GET /api/music/releases 应返回作品列表', async () => {
    const res = await request(app).get('/api/music/releases');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('releases');
    expect(res.body.data).toHaveProperty('pagination');
  });

  test('GET /api/music/featured 应返回精选作品', async () => {
    const res = await request(app).get('/api/music/featured');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/music/latest 应返回最新作品或 404', async () => {
    const res = await request(app).get('/api/music/latest');
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title');
    } else {
      expect(res.body.success).toBe(false);
    }
  });

  test('POST /api/music/:id/play 应能记录播放次数', async () => {
    // 先获取一个 release id
    const listRes = await request(app).get('/api/music/releases');
    expect(listRes.statusCode).toBe(200);
    const releases = listRes.body.data.releases;
    if (releases.length > 0) {
      const id = releases[0]._id || releases[0].id;
      const playRes = await request(app).post(`/api/music/${id}/play`);
      expect([200, 404]).toContain(playRes.statusCode);
      if (playRes.statusCode === 200) {
        expect(playRes.body.success).toBe(true);
        expect(playRes.body.data).toHaveProperty('plays');
      }
    }
  });
});
