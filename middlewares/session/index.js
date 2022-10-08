const expressSession = require('express-session');
const MysqlStore = require('express-mysql-session')(expressSession);
const config = require('../../config');
const pool = require('../../database/pool');

const sessionStore = new MysqlStore({}, pool);
const sessionOption = {
  secret: config.server.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
};

const session = expressSession(sessionOption);
module.exports = session;
