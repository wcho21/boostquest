const express = require('express');
const fs = require('fs/promises');
const config = require('../config');
const morgan = require('morgan');
const axios = require('axios');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

const app = express();

app.use(morgan('dev'));
app.use(express.static('static'));
app.set('views', './pug');
app.set('view engine', 'pug');

const pool = mysql.createPool(config.mysql).promise();
const sessionStore = new MysqlStore({}, pool);

app.use(session({
  secret: config.server.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// auth middleware
app.use((req, res, next) => {
  if ('user' in req.session) {
    res.locals.signedIn = true;
    console.log('session:', req.session.user);
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
  const clientId = config.oauth.github.clientId;
  res.render('signin', { clientId });
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
      client_id: config.oauth.github.clientId,
      client_secret: config.oauth.github.clientSecret,
      code,
      redirect_uri: config.oauth.github.redirectUri,
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
