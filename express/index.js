const express = require('express');

const app = express();

app.use(express.static('static'));
app.set('views', './pug');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
