const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PUBLIC_DIR = path.resolve(__dirname, './public');

app.use(express.static(PUBLIC_DIR));

const PORT = process.env.PORT || 3000;

//-- Middleware SETUP
const VIEW_DIR = path.resolve(__dirname, 'server', 'views');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', VIEW_DIR);

//-- Routes SETUP
require('./server/routes/index')(app);
require('./server/routes/api')(app);

const { crawler, filterResult } = require('./server/src/crawler');

io.on('connection', (socket) => {
  console.log('a user is online');

  //-- scrape the website
  socket.on('SCRAPE', async (data) => {
    const baseURL = data.url;

    try {
      const scrapedResult = await crawler(baseURL);
      const wordsResult = filterResult(scrapedResult.textResults);

      socket.emit('SCRAPE_RESULT', {
        error: null,
        imageResults: scrapedResult.imageResults,
        wordsResult,
      });
    } catch (error) {
      console.log(error);
      socket.emit('SCRAPE_RESULT', {
        error: true,
        imageResults: [],
        wordsResult: {},
      });
    }
  });
});

http.listen(PORT, () => {
  console.log(`server is listening on port ::${PORT}`);
});
