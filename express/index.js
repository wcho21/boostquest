const express = require('express');
const fs = require('fs/promises');

const app = express();

app.use(express.static('static'));
app.set('views', './pug');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/leaderboard', (req, res) => {
  res.render('leaderboard');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.get('/day/:num', (req, res) => {
  const num = req.params.num ? req.params.num : 0;
  res.render('day', { num });
});

app.get('/day/:num/input', async (req, res) => {
  const buffer = await fs.readFile('./challenges/input/10/1.txt');
  const input = buffer.toString();
  res.type('text/plain');
  res.send(input);
});

module.exports = app;
