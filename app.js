const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

app.listen(PORT, () => {
  console.log(`server is listening on port ::${PORT}`);
});
