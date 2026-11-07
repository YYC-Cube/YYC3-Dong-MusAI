// M98 API服务配置
const API_CONFIG = {
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  endpoints: {
    health: '/health',
    artist: '/api/artist/profile',
    releases: '/api/music/releases',
    featured: '/api/music/featured',
    fansWall: '/api/fans/wall',
    playTrack: '/api/music/:id/play'
  }
};

export default API_CONFIG;
