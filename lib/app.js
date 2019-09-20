require('dotenv').config();

const express = require('express');
const configDatabase = require('./database');
const configMiddlewares = require('./middlewares');
const configRoutes = require('./routes');

configDatabase(process.env.DB_HOST, process.env.DB_NAME);

let app = express();
app = configMiddlewares(app);
app = configRoutes(app);

module.exports = app;
