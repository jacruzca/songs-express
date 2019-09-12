const express = require('express');
const path = require('path');

const {
  listSongs,
  createRandomSong,
  getSongById,
} = require('./songs-controller');
const { PAGE_SIZE, SONGS_FOLDER } = require('../utils/constants');
const {
  CustomValidationError,
  buildErrorResponse,
  NotFoundError,
} = require('../utils/errors');

const router = express.Router();

router.get('/:id/download', async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
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
});

/* GET songs listing. */
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    let { skip = 0, limit = PAGE_SIZE } = req.query;
    skip = parseInt(skip, 10);
    limit = parseInt(limit, 10);

    const songs = await listSongs({ skip, limit, title });
    res.json(songs);
  } catch (e) {
    res.status(400);
    res.json(buildErrorResponse(e));
  }
});

/* Creates a random song. */
router.post('/', async (req, res) => {
  try {
    const song = await createRandomSong();
    return res.json(song);
  } catch (e) {
    if (e instanceof CustomValidationError) {
      res.status(400);
      return res.json(buildErrorResponse(e));
    }
    res.status(500);
    return res.json(buildErrorResponse(e));
  }
});

module.exports = router;
