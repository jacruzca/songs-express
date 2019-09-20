/* eslint-disable no-console */
/**
 * This module defines all express middlewares
 */

const mongoose = require('mongoose');
const logger = require('./utils/logger')('database');

const database = (dbHost, dbName) => {
  mongoose.connect(`${dbHost}/${dbName}`, {
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on('error', () => logger('connection error:'));
  db.once('open', () => {
    logger('Connected to MongoDB');
  });
};

module.exports = database;
