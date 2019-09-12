const mongoose = require('mongoose');
const { DatabaseError } = require('../utils/errors');
const { SongModel } = require('./songs-schema');
const { PAGE_SIZE } = require('../utils/constants');
const { CustomValidationError } = require('../utils/errors');

const { ValidationError } = mongoose.Error;

/**
 * Retrieves a list of songs according to the given params
 * @param {*} params the parameters to find and sort the songs. All of them are optional
 * @param {*} params.title the title of the songs to search for
 * @param {*} params.skip the documents to skip the results. Default 0
 * @param {*} params.limit the max number of documents to retrieve. Default 5
 * @throws DatabaseError if some error happened at a database level
 */
const listSongs = async ({ title, skip = 0, limit = PAGE_SIZE }) => {
  try {
    const query = {};
    if (title && title.length > 0) {
      query.title = { $regex: `^.*${title}.*$`, $options: 'gi' };
    }
    const songs = await SongModel.find(query)
      .limit(limit)
      .skip(skip);
    return songs;
  } catch (e) {
    throw new DatabaseError(e.message);
  }
};

/**
 * Creates a new song in the database
 * @param {*} song the song object to be created
 * @throws ValidationError if some database validation failed
 * @throws DatabaseError if some error happened at a database level
 */
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

/**
 * Creates a song with fixed values
 */
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
