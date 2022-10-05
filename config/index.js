const dotenv = require('dotenv');

dotenv.config();

const e = process.env;

module.exports = {
  server: {
    httpPort: e.SERVER_HTTP_PORT,
  },
};
