const request = require('supertest');
const express = require('express');
const createAdminRouter = require('../src/routes/adminRoutes');
const { signToken } = require('../src/middleware/auth');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const fakeDb = {
  get(sql, params, callback) {
    if (sql.includes('FROM artists')) {
      return callback(null, {
        stats: JSON.stringify({ followers: 64200, totalPlays: 2400000 }),
      });
    }
    if (sql.includes('COUNT(*)')) {
      return callback(null, { total: 4 });
    }
    return callback(new Error(`unexpected get: ${sql}`));
  },
  all(sql, params, callback) {
    if (sql.includes('FROM releases')) {
      return callback(null, [
        {
          id: 1,
          title: '东方夜曲',
          releaseDate: '2024-12-15',
          stats: JSON.stringify({ plays: 45233 }),
        },
        {
          id: 2,
          title: '数字禅境',
          releaseDate: '2024-11-28',
          stats: JSON.stringify({ plays: 67890 }),
        },
      ]);
    }
    if (sql.includes('FROM fan_messages')) {
      return callback(null, [
        {
          id: 1,
          username: '夜听者',
          message: '《东方夜曲》真的太棒了',
          type: 'text',
          likes: 42,
          createdAt: '2024-12-20 10:00:00',
        },
      ]);
    }
    return callback(new Error(`unexpected all: ${sql}`));
  },
};

const app = express();
app.use('/api/admin', createAdminRouter(fakeDb));

const token = signToken({ sub: 'admin', name: 'admin', role: 'admin' });

describe('管理后台仪表盘', () => {
  test('无 token 应返回 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.statusCode).toBe(401);
  });

  test('合法 token 应返回聚合数据', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.kpis).toHaveLength(4);
    expect(res.body.data.playTrend.length).toBeLessThanOrEqual(7);
    expect(res.body.data.activities.length).toBeGreaterThan(0);
    expect(res.body.data.updatedAt).toBeTruthy();
  });
});
