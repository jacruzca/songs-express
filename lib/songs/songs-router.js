const express = require('express');

const router = express.Router();

/* GET songs listing. */
router.get('/', async (req, res) => {
  res.json([{ title: 'song 1', artist: 'artist 1' }]);
});

module.exports = router;
