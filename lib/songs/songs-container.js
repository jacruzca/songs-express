const { SongModel } = require('./songs-schema');
const SongsService = require('./songs-service');
const SongsController = require('./songs-controller');

module.exports = {
  SongModel,
  SongsService: (songModel = module.exports.SongModel) => SongsService(songModel),
  SongsController: (songService = module.exports.SongsService()) => SongsController(songService),
};
