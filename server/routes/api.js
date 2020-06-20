const { webScraper } = require('../controllers/APIController');
module.exports = (app) => {
  app.get('/api/scraper/', webScraper);
};
