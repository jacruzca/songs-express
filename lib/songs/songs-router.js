const express = require('express');
const { listSongs, createRandomSong } = require('./songs-controller');
const { PAGE_SIZE } = require('../utils/constants');
const {
  CustomValidationError,
  buildErrorResponse,
} = require('../utils/errors');

const router = express.Router();

/* GET songs listing. */
router.get('/', async (req, res) => {
  try {
    let { skip = 0, limit = PAGE_SIZE } = req.query;
    skip = parseInt(skip, 10);
    limit = parseInt(limit, 10);
    const songs = await listSongs({ skip, limit });
    res.json(songs);
  } catch (e) {
    res.status(400);
    res.json(buildErrorResponse(e));
  }
});

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
