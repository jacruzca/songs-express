const debug = require('debug');

module.exports = (section = 'default') => debug(`songs:${section}`);
