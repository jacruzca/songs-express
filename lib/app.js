const express = require('express');

const configMiddlewares = require('./middlewares');
const configRoutes = require('./routes');

let app = express();
app = configMiddlewares(app);
app = configRoutes(app);

module.exports = app;
