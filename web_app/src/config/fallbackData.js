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
 * exports: PREFER_LOCAL_FALLBACK, FALLBACK_ARTIST, FALLBACK_RELEASES, FALLBACK_FANS_WALL,
 *          FALLBACK_FEEDBACKS, FALLBACK_EXCLUSIVE_CONTENT, FALLBACK_BLOG_POSTS, FALLBACK_EVENTS
 */

import ASSETS from './assets';

// 生产/测试环境未配置 API 地址时直接使用本地静态数据，避免 Pages 站点进入错误页
export const PREFER_LOCAL_FALLBACK =
  !import.meta.env.VITE_API_BASE_URL &&
  (import.meta.env.PROD || import.meta.env.MODE === 'test');

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

export const FALLBACK_FEEDBACKS = FALLBACK_FANS_WALL.map((item, index) => ({
  name: item.username,
  timestamp: item.createdAt,
  emotion: ['治愈', '共鸣', '星夜', '温柔'][index % 4],
  message: item.message,
}));

export const FALLBACK_EXCLUSIVE_CONTENT = [
  {
    id: 'fallback-exclusive-1',
    title: '《浮生如渡》幕后制作手记',
    type: 'behind-scenes',
    thumbnail: ASSETS.posters[0],
    description: '从东方五声音阶到电子合成器，记录这首歌的诞生过程。',
    duration: '08:24',
    releaseDate: '2026-10-20',
    isLocked: false,
    tags: ['幕后花絮', '免费'],
  },
  {
    id: 'fallback-exclusive-2',
    title: '《渡心时序》沉浸式试听',
    type: 'audio',
    thumbnail: ASSETS.posters[1],
    description: '戴上耳机，进入一段从渡口到星河的声场旅程。',
    duration: '04:12',
    releaseDate: '2026-10-08',
    isLocked: true,
    tags: ['音频', '会员专属'],
  },
  {
    id: 'fallback-exclusive-3',
    title: '音乐哲学：渡船与过客',
    type: 'philosophy',
    thumbnail: ASSETS.posters[2],
    description: '董小姐谈创作中的东方时间观与留白美学。',
    duration: '06:30',
    releaseDate: '2026-09-26',
    isLocked: false,
    tags: ['音乐哲学', '免费'],
  },
  {
    id: 'fallback-exclusive-4',
    title: '现场录音：秋风不问梧桐意',
    type: 'live-session',
    thumbnail: ASSETS.posters[3],
    description: '一段来自排练室的即兴现场，保留最真实的呼吸与回响。',
    duration: '05:48',
    releaseDate: '2026-09-12',
    isLocked: true,
    tags: ['现场录音', '会员专属'],
  },
];

export const FALLBACK_BLOG_POSTS = [
  {
    id: 'fallback-blog-1',
    title: '在电子节拍里，保留一盏东方的灯',
    excerpt: '关于《浮生如渡》的编曲思路与声音采集。',
    content: '从渡口的采样到合成器的铺底，记录一次东方与电子的相遇。',
    publishDate: '2026-10-22',
    readTime: 6,
    tags: ['创作手记', '编曲'],
    coverImage: ASSETS.posters[0],
  },
  {
    id: 'fallback-blog-2',
    title: '从渡口到星河：一场关于时间的现场',
    excerpt: '记录「渡心时序」沉浸式试听会的幕后。',
    content: '空间声场、灯光与呼吸，共同构成了一次可以被听见的时间。',
    publishDate: '2026-10-10',
    readTime: 4,
    tags: ['现场', '幕后'],
    coverImage: ASSETS.posters[1],
  },
];

export const FALLBACK_EVENTS = [
  {
    id: 'fallback-event-1',
    title: 'M98 · 渡心时序 沉浸式试听会',
    description: '东方电子 × 空间声场，限定 120 席。',
    date: '2026-12-20',
    location: '上海 · 云枢空间',
    ticketPrice: '¥198',
    status: 'upcoming',
    image: ASSETS.posters[2],
  },
  {
    id: 'fallback-event-2',
    title: '东方电子音乐夜 · 上海站',
    description: '与多位电子音乐人共同呈现东方声音的当代表达。',
    date: '2026-11-28',
    location: '上海 · MAO Livehouse',
    ticketPrice: '¥168',
    status: 'upcoming',
    image: ASSETS.posters[3],
  },
  {
    id: 'fallback-event-3',
    title: 'M98 线上直播 · 星河渡口',
    description: '一小时不间断的现场演出与创作对谈。',
    date: '2026-11-15',
    location: '线上 · 视频号 / B站',
    ticketPrice: '免费',
    status: 'upcoming',
    image: ASSETS.posters[4],
  },
];

export default {
  artist: FALLBACK_ARTIST,
  releases: FALLBACK_RELEASES,
  fansWall: FALLBACK_FANS_WALL,
  feedbacks: FALLBACK_FEEDBACKS,
  exclusiveContent: FALLBACK_EXCLUSIVE_CONTENT,
  blogPosts: FALLBACK_BLOG_POSTS,
  events: FALLBACK_EVENTS,
};
