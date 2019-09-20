/**
 * This module defines all routes for the app
 */

const songsRouter = require('./songs/songs-router');

const routes = (app) => {
  app.use('/v1/songs', songsRouter);
  return app;
};

module.exports = routes;
