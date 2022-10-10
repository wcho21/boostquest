const express = require('express');
const morgan = require('morgan');
const session = require('#middlewares/session');
const { PageNotFoundError } = require('./errors.js');
const initAuthData = require('#middlewares/init-auth-data');
const routers = require('#routers');

const app = express();

app.use(morgan('dev'));
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.set('views', './ejs');
app.set('view engine', 'ejs');

app.use(session);
app.use(initAuthData);

app.use('/', routers.rootRouter);
app.use('/leaderboard', routers.leaderboardRouter);
app.use('/about', routers.aboutRouter); 
app.use('/signin', routers.signinRouter); 
app.use('/signout', routers.signoutRouter); 
app.use('/answer', routers.answerRouter); 
app.use('/day', routers.dayRouter);
app.use('/oauth', routers.oauthRouter);

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
