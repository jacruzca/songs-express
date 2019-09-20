const path = require('path');
const debug = require('../utils/logger')('controller:song');
const {
  CustomValidationError,
  buildErrorResponse,
  NotFoundError,
} = require('../utils/errors');
const { PAGE_SIZE, SONGS_FOLDER } = require('../utils/constants');

const SongsController = (SongsService, logger = debug) => {
  const downloadSong = async (req, res) => {
    try {
      const songId = req.params.id;
      logger('Downloading song: %s', songId);
      const song = await SongsService.getSongById(songId);
      const fileLocation = path.join(`./${SONGS_FOLDER}`, song.location);
      return res.download(fileLocation, song.location);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404);
        return res.json(buildErrorResponse(e));
      }
      res.status(500);
      return res.json(buildErrorResponse(e));
    }
  };

  const getSongs = async (req, res) => {
    try {
      logger('Listing songs with params: %O', req.query);
      const { title } = req.query;
      let { skip = 0, limit = PAGE_SIZE } = req.query;
      skip = parseInt(skip, 10);
      limit = parseInt(limit, 10);

      const songs = await SongsService.listSongs({ skip, limit, title });
      res.json(songs);
    } catch (e) {
      res.status(400);
      res.json(buildErrorResponse(e));
    }
  };

  const createRandomSong = async (req, res) => {
    try {
      logger('Creating random song');
      const song = await SongsService.createRandomSong();
      return res.json(song);
    } catch (e) {
      if (e instanceof CustomValidationError) {
        res.status(400);
        return res.json(buildErrorResponse(e));
      }
      res.status(500);
      return res.json(buildErrorResponse(e));
    }
  };

  return {
    downloadSong,
    getSongs,
    createRandomSong,
  };
};

module.exports = SongsController;
