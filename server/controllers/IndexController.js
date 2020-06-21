exports.showHomepage = (req, res, next) => {
  res.render('index', {
    pageTitle: 'Web Scraper',
  });
};
