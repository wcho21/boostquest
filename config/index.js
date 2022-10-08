const dotenv = require('dotenv');

dotenv.config();

const e = process.env;

module.exports = {
  server: {
    httpPort: e.SERVER_HTTP_PORT,
    sessionSecret: e.SERVER_SESSION_SECRET,
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
  }
};
