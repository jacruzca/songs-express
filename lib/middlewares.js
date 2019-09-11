/**
 * This module defines all express middlewares
 */

const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');

const middlewares = app => {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: false }));

  return app;
};

module.exports = middlewares;
