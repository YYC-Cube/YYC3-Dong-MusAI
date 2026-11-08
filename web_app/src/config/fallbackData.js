/**
 * file: fallbackData.js
 * description: 静态回退数据 · API 不可达时保障 Pages 站点完整可用
 * author: YYC³ Team
 * version: v1.0.0
 * created: 2026-11-09
 * updated: 2026-11-09
 * status: active
 * tags: [config],[fallback],[github-pages]
 *
 * brief: 生产环境未配置 REACT_APP_API_BASE_URL 或 API 请求失败时使用
 *
 * details:
 * - 曲目与封面复用 assets.js，避免重复维护
 * - 仅提供展示所需字段，不参与写操作
 *
 * dependencies: ./assets
 * exports: FALLBACK_ARTIST, FALLBACK_RELEASES, FALLBACK_FANS_WALL
 */

import ASSETS from './assets';

export const FALLBACK_ARTIST = {
  artistId: 'M98',
  name: '董小姐',
  bio: '电子 × 东方 × 未来，以声音构建可听可见的音乐宇宙。',
  genres: ['东方电子', '未来国风', '氛围电子'],
  stats: {
    followers: 128000,
    monthlyListeners: 56000,
    totalPlays: 202663,
  },
  socialLinks: {
    weibo: '',
    douyin: '',
    bilibili: '',
  },
};

const releaseDates = [
  '2026-10-24',
  '2026-09-18',
  '2026-08-12',
  '2026-07-06',
  '2026-06-20',
  '2026-05-15',
];

export const FALLBACK_RELEASES = ASSETS.tracks.slice(0, 6).map((track, index) => ({
  id: `fallback-release-${index + 1}`,
  legacyId: index + 1,
  title: track.title,
  artistId: 'M98',
  releaseDate: releaseDates[index],
  type: 'single',
  coverArt: track.coverArt,
  stats: {
    plays: 20266 - index * 1800,
    downloads: 320 - index * 24,
    shares: 180 - index * 12,
  },
}));

export const FALLBACK_FANS_WALL = [
  {
    id: 'fallback-message-1',
    username: '夜听者',
    message: '《浮生如渡》循环了一整晚，像在星河里渡船。',
    likes: 42,
    createdAt: '2026-11-01',
  },
  {
    id: 'fallback-message-2',
    username: '云枢旅人',
    message: '东方旋律遇上电子音色，听见了未来的回声。',
    likes: 36,
    createdAt: '2026-10-28',
  },
  {
    id: 'fallback-message-3',
    username: '渡心',
    message: '《渡心时序》前奏一响，世界就安静了。',
    likes: 28,
    createdAt: '2026-10-21',
  },
  {
    id: 'fallback-message-4',
    username: '梧桐秋风',
    message: '从《过客》入坑，每一首都有画面。',
    likes: 19,
    createdAt: '2026-10-15',
  },
];

export default {
  artist: FALLBACK_ARTIST,
  releases: FALLBACK_RELEASES,
  fansWall: FALLBACK_FANS_WALL,
};
