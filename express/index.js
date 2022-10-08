const express = require('express');
const fs = require('fs/promises');
const dotenv = require('dotenv');
const axios = require('axios');
const session = require('express-session');

dotenv.config();

const app = express();

app.use(express.static('static'));
app.set('views', './pug');
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// auth middleware
// assume not signed in
// TODO: do auth
app.use((req, res, next) => {
  if ('user' in req.session) {
    res.locals.signedIn = true;
  } else {
    res.locals.signedIn = false;
  }
  console.log('signedIn', res.locals.signedIn);
  next();
});

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

app.get('/oauth/github', async (req, res) => {
  const code = req.query.code;

  const accessTokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.OAUTH_GITHUB_REDIRECT_URI,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );
  
  const githubUserResponse = await axios.get(
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `token ${accessTokenResponse.data.access_token}`,
      },
    }
  );

  const userName = githubUserResponse.data.login;
  const userId = githubUserResponse.data.id;

  req.session.user = {name: userName, id: userId};

  res.redirect('/');
});

module.exports = app;
