const { showHomepage } = require('../controllers/IndexController');
module.exports = (app) => {
  app.get('/', showHomepage);
};
