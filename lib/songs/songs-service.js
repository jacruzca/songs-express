const mongoose = require('mongoose');
const debug = require('../utils/logger')('service:song');
const { DatabaseError } = require('../utils/errors');
const { PAGE_SIZE } = require('../utils/constants');
const { CustomValidationError, NotFoundError } = require('../utils/errors');

const { ValidationError } = mongoose.Error;

const SongsService = (SongModel, logger = debug) => {
  /**
   * Retrieves a song with th given id
   * @param {*} id the id of the song
   * @throws `NotFoundError` if the song was not found
   */
  const getSongById = async (id) => {
    logger('Retrieving song by id: %s', id);
    const song = await SongModel.findOne({
      _id: id,
    });
    if (!song) {
      throw new NotFoundError(`song with id ${id} not found`);
    }
    return song;
  };

  /**
   * Retrieves a list of songs according to the given params
   * @param {*} params the parameters to find and sort the songs. All of them are optional
   * @param {*} params.title the title of the songs to search for
   * @param {*} params.skip the documents to skip the results. Default 0
   * @param {*} params.limit the max number of documents to retrieve. Default 5
   * @throws `DatabaseError` if some error happened at a database level
   */
  const listSongs = async (params) => {
    const { title, skip = 0, limit = PAGE_SIZE } = params;
    try {
      logger('Listing songs with params: %O', params);
      const query = {};
      if (title && title.length > 0) {
        query.title = {
          $regex: `^.*${title}.*$`,
          $options: 'gi',
        };
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
   * @throws `DatabaseError` if some error happened at a database level
   */
  const createSong = async (song) => {
    try {
      logger('Creating song: %s', song.title);
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
  return {
    getSongById,
    createSong,
    listSongs,
    createRandomSong,
  };
};

module.exports = SongsService;
