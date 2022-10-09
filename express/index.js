const express = require('express');
const fs = require('fs/promises');
const config = require('../config');
const morgan = require('morgan');
const axios = require('axios');
const session = require('./../middlewares/session');
const { PageNotFoundError } = require('./errors.js');
const validateChallengeNumber = require('../middlewares/validate-challenge-number');
const validateAccessTime = require('../middlewares/validate-access-time');
const crypto = require('crypto');
const pool = require('../database/pool');

const app = express();

app.use(morgan('dev'));
app.use(express.static('static'));
app.set('views', './ejs');
app.set('view engine', 'ejs');

app.use(session);

// auth middleware
app.use((req, res, next) => {
  if ('user' in req.session) {
    res.locals.signedIn = true;
    res.locals.user = req.session.user;
  } else {
    res.locals.signedIn = false;
  }
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

app.get('/signout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/day/:num',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res) => {
    const num = req.params.num;

    let firstProblemSolved = false;
    let secondProblemSolved = false;
    if (res.locals.signedIn) {
      const firstProblemId = num + '1';
      const userId = res.locals.user.id;
      const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [firstProblemId, userId]);
      if (rows.length === 1 && rows[0].solved === 1) {
        firstProblemSolved = true;
      }
    }
    if (firstProblemSolved && res.locals.signedIn) {
      const secondProblemId = num + '2';
      const userId = res.locals.user.id;
      const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [secondProblemId, userId]);
      if (rows.length === 1 && rows[0].solved === 1) {
        secondProblemSolved = true;
      }
    }

    res.locals.firstProblemSolved = firstProblemSolved;
    res.locals.secondProblemSolved = secondProblemSolved;

    res.render('day', { num });
  });

app.get('/day/:num/input',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res, next) => {
    if (!res.locals.signedIn) {
      throw new PageNotFoundError();
    }

    const num = req.params.num;
    const problemSetNumber = num + '0';
    const inputCasesIdx = parseInt(num) - 1;
    const inputCase = req.session.user.inputCases[inputCasesIdx];
    const buffer = await fs.readFile('./challenges/inputs/' + problemSetNumber + '/' + inputCase + '.txt');
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

  const userId = githubUserResponse.data.id;
  const userName = githubUserResponse.data.login;

  const [rows] = await pool.query('SELECT EXISTS (SELECT * FROM users_v1 WHERE uid = ?) AS `exists`', userId);
  const userExists = rows[0].exists === 1 ? true : false;
  let inputCases;
  if (!userExists) {
    inputCases = Array(5).fill(null).map(el => crypto.randomInt(1, 100));

    await pool.query('INSERT INTO users_v1 (uid, name, created_at, input_case_1, input_case_2, input_case_3, input_case_4, input_case_5)' +
        ' VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)', [userId, userName, ...inputCases]);
  } else {
    const [rows] = await pool.query('SELECT input_case_1, input_case_2, input_case_3, input_case_4, input_case_5 FROM users_v1 WHERE uid = ?', [userId]);
    const row = rows[0];
    inputCases = [row.input_case_1, row.input_case_2, row.input_case_3, row.input_case_4, row.input_case_5];
  }

  req.session.user = {name: userName, id: userId, inputCases};

  res.redirect('/');
});

app.use((req, res) => {
  throw new PageNotFoundError();
});

app.use((err, req, res, next) => {
  if (err instanceof PageNotFoundError) {
    res.render('404');
    return;
  }

  console.error(err);
  res.sendStatus(500);
});

module.exports = app;
