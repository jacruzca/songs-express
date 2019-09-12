const mongoose = require('mongoose');
const { DatabaseError } = require('../utils/errors');
const { SongModel } = require('./songs-schema');
const { PAGE_SIZE } = require('../utils/constants');
const { CustomValidationError } = require('../utils/errors');

const { ValidationError } = mongoose.Error;

const listSongs = async ({ skip = 0, limit = PAGE_SIZE }) => {
  console.log('limit :', limit);
  console.log('skip :', skip);
  try {
    const songs = await SongModel.find()
      .limit(limit)
      .skip(skip);
    return songs;
  } catch (e) {
    throw new DatabaseError(e.message);
  }
};

const createSong = async (song) => {
  try {
    const createdSong = await SongModel.create(song);
    return createdSong;
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new CustomValidationError(e);
    }
    throw new DatabaseError(e);
  }
};

const createRandomSong = async () => {
  const song = {
    title: 'Let her go 8',
    artist: 'Passenger',
    genre: 'Pop',
    length: 253,
    location: 'let-her-go-passenger.mp3',
  };
  return createSong(song);
};

module.exports = { listSongs, createRandomSong };
