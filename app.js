const express = require('express');
const configMiddlewares = require('./lib/middlewares');
const configRoutes = require('./lib/routes');

var app = express();
app = configMiddlewares(app);
app = configRoutes(app);

module.exports = app;
