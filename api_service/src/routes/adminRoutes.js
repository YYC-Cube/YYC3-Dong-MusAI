/**
 * file: adminRoutes.js
 * description: 管理后台数据路由 · 受保护的仪表盘聚合接口
 * author: YYC³ Team
 * version: v1.0.0
 * created: 2026-11-07
 * updated: 2026-11-07
 * status: active
 * tags: [service],[admin],[api]
 *
 * dependencies: express, sqlite3（通过注入的 db）
 * exports: createAdminRouter
 * notes: 过渡实现基于 SQLite；PostgreSQL 适配时替换查询层
 */

const express = require('express');
const { requireAuth } = require('../middleware/auth');

function safeJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatNumber(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

function toIso(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function createAdminRouter(db) {
  const router = express.Router();
  router.use(requireAuth);

  const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row)));
    });

  const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
    });

  router.get('/dashboard', async (req, res) => {
    try {
      const [artist, releases, fanMessages, fanCount] = await Promise.all([
        get('SELECT stats FROM artists WHERE artistId = ?', ['M98']),
        all('SELECT id, title, releaseDate, stats FROM releases ORDER BY releaseDate DESC'),
        all(
          'SELECT id, username, message, type, likes, createdAt FROM fan_messages ORDER BY createdAt DESC LIMIT 6',
        ),
        get('SELECT COUNT(*) AS total FROM fan_messages'),
      ]);

      const artistStats = safeJson(artist && artist.stats, {});
      const releaseStats = (releases || []).map((row) => ({
        id: row.id,
        title: row.title,
        releaseDate: row.releaseDate,
        stats: safeJson(row.stats, {}),
      }));

      const totalPlays =
        releaseStats.reduce((sum, row) => sum + (Number(row.stats.plays) || 0), 0) ||
        Number(artistStats.totalPlays) ||
        0;

      const top = [...releaseStats]
        .sort((a, b) => (Number(b.stats.plays) || 0) - (Number(a.stats.plays) || 0))
        .slice(0, 7)
        .reverse();

      const playTrend = top.map((row) => ({
        label: row.title.length > 6 ? `${row.title.slice(0, 6)}…` : row.title,
        value: Number(row.stats.plays) || 0,
      }));

      const activities = [
        ...(releases && releases[0]
          ? [
              {
                id: `release-${releases[0].id}`,
                platform: '作品发布',
                content: `《${releases[0].title}》已上线`,
                timestamp: toIso(releases[0].releaseDate),
                likes: 0,
                comments: 0,
                type: 'release',
              },
            ]
          : []),
        ...(fanMessages || []).map((row) => ({
          id: `fan-${row.id}`,
          platform: '粉丝墙',
          content: row.message,
          timestamp: toIso(row.createdAt),
          likes: Number(row.likes) || 0,
          comments: 0,
          type: row.type || 'text',
        })),
      ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 6);

      const kpis = [
        {
          id: 'plays',
          title: '总播放量',
          value: formatNumber(totalPlays),
          icon: 'play',
          hint: '全部作品累计',
        },
        {
          id: 'fans',
          title: '粉丝总量',
          value: formatNumber(Number(artistStats.followers) || 0),
          icon: 'users',
          trend: 'up',
          hint: '艺人档案',
        },
        {
          id: 'releases',
          title: '作品数量',
          value: String(releaseStats.length),
          icon: 'music',
          hint: '曲库',
        },
        {
          id: 'messages',
          title: '粉丝留言',
          value: String((fanCount && fanCount.total) || 0),
          icon: 'interaction',
          hint: '互动墙',
        },
      ];

      return res.json({
        success: true,
        data: {
          kpis,
          playTrend,
          activities,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('[admin] 仪表盘聚合失败:', error.message);
      return res.status(500).json({ success: false, message: '仪表盘数据加载失败' });
    }
  });

  return router;
}

module.exports = createAdminRouter;
