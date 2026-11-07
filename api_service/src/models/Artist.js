const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  artistId: { type: String, required: true, unique: true, default: 'M98' },
  name: { type: String, required: true, default: '董小姐' },
  bio: { 
    type: String, 
    default: '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。'
  },
  genres: { type: [String], default: ['电子', '融合', '东方韵律'] },
  stats: {
    monthlyListeners: { type: Number, default: 128000 },
    totalPlays: { type: Number, default: 2400000 },
    followers: { type: Number, default: 64200 }
  },
  socialLinks: {
    weibo: String,
    douyin: String,
    bilibili: String,
    xiaohongshu: String
  },
  discography: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Release'
  }],
  exclusiveContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExclusiveContent'
  }]
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
