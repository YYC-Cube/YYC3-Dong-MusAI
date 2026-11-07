const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artistId: { type: String, required: true, default: 'M98' },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist', 
    required: true
  },
  releaseDate: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['single', 'ep', 'album', 'remix'], 
    default: 'single' 
  },
  coverArt: String,
  tracks: [{
    title: String,
    duration: Number,
    streamUrl: String,
    downloadUrl: String,
    lyrics: String,
    credits: String
  }],
  stats: {
    plays: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  isExclusive: { type: Boolean, default: false }
});

const Release = mongoose.model('Release', releaseSchema);

module.exports = Release;
