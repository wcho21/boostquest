const { readFileSync } = require('fs');
const http = require('http');
const https = require('https');
const app = require('./express');
const config = require('./config');

const httpPort = config.server.httpPort ?? 3080;
http.createServer(app).listen(httpPort, () => {
  console.log(`http server is listening on port ${httpPort}`);
});

const sslOptions = {
  key: readFileSync(config.ssl.keyPath),
  cert: readFileSync(config.ssl.certPath),
  ca: readFileSync(config.ssl.caPath),
};
const httpsPort = config.server.httpsPort ?? 3443;
https.createServer(sslOptions, app).listen(httpsPort, () => {
  console.log(`https server is listening on port ${httpsPort}`);
});
