const express = require('express');
const morgan = require('morgan');
const config = require('#config');
const httpsRedirector = require('#middlewares/https-redirector');
const session = require('#middlewares/session');
const initAuthData = require('#middlewares/init-auth-data');
const { pageNotFoundErrorCreator } = require('#middlewares/page-not-found-error-creator');
const expressErrorHandler = require('#middlewares/express-error-handler');
const routers = require('#routers');

const app = express();

app.use(morgan(config.node.env === 'production' ? 'combined' : 'dev'));
app.use(httpsRedirector);
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.set('views', './ejs');
app.set('view engine', 'ejs');

app.use(session);
app.use(initAuthData);

app.use('/', routers.rootRouter);
app.use('/about', routers.aboutRouter); 
app.use('/signin', routers.signinRouter); 
app.use('/signout', routers.signoutRouter); 
app.use('/answer', routers.answerRouter); 
app.use('/day', routers.dayRouter);
app.use('/oauth', routers.oauthRouter);
app.use('/leaderboard', routers.leaderboardRouter);

app.use(pageNotFoundErrorCreator);
app.use(expressErrorHandler);

module.exports = app;
