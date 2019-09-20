const express = require('express');
const Container = require('./songs-container');

const SongsController = Container.SongsController();
const router = express.Router();

// Download song
router.get('/:id/download', SongsController.downloadSong);

// GET songs listing
router.get('/', SongsController.getSongs);

// Creates a random song
router.post('/', SongsController.createRandomSong);

module.exports = router;
