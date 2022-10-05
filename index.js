const http = require('http');
const app = require('./express');
const config = require('./config');

const httpPort = config.server.httpPort ?? 3080;
http.createServer(app).listen(httpPort, () => {
  console.log(`http server is listening on port ${httpPort}`);
});
