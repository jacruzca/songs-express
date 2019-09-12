const mongoose = require('mongoose');

const { Schema } = mongoose;

const songSchema = new Schema({
  title: { type: String, required: true, index: true },
  artist: { type: String, required: true, index: true },
  genre: { type: String, required: true, index: true },
  length: { type: Number, min: 1, required: true },
  location: { type: String, required: true, index: true },
  created: { type: Date, required: true, default: Date.now },
});

const SongModel = mongoose.model('Song', songSchema);

module.exports = {
  songSchema,
  SongModel,
};
