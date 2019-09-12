/* eslint-disable no-console */
/**
 * This module defines all express middlewares
 */

const mongoose = require('mongoose');

const database = () => {
  mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

module.exports = database;
