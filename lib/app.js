require('dotenv').config();

const express = require('express');
const configDatabase = require('./database');
const configMiddlewares = require('./middlewares');
const configRoutes = require('./routes');

configDatabase();

let app = express();
app = configMiddlewares(app);
app = configRoutes(app);

module.exports = app;
