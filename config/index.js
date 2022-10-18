const dotenv = require('dotenv');

dotenv.config();

const e = process.env;

module.exports = {
  node: {
    env: e.NODE_ENV ?? 'development',
  },
  server: {
    hostname: e.SERVER_HOSTNAME,
    httpPort: e.SERVER_HTTP_PORT,
    httpsPort: e.SERVER_HTTPS_PORT,
    sessionSecret: e.SERVER_SESSION_SECRET,
  },
  ssl: {
    keyPath: e.SSL_KEY_PATH,
    certPath: e.SSL_CERT_PATH,
    caPath: e.SSL_CA_PATH
  },
  oauth: {
    github: {
      clientId: e.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: e.OAUTH_GITHUB_CLIENT_SECRET,
      redirectUri: e.OAUTH_GITHUB_REDIRECT_URI,
    },
  },
  mysql: {
    host: e.MYSQL_HOST,
    port: e.MYSQL_PORT,
    user: e.MYSQL_USER,
    password: e.MYSQL_PASSWORD,
    database: e.MYSQL_DATABASE,
    usersTable: e.MYSQL_USERS_TABLE,
    problemsTable: e.MYSQL_PROBLEMS_TABLE,
    inputCasesTable: e.MYSQL_INPUT_CASES_TABLE,
  },
  site: {
    firstDayOpenTime: e.SITE_FIRST_DAY_OPEN_TIME,
  },
};
