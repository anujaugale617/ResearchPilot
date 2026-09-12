const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer so Render caches and finds the browser
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
