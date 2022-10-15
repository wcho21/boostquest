const mysql = require('mysql2');
const config = require('#config');

const poolOptions = {
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};
const pool = mysql.createPool(poolOptions).promise();
module.exports = pool;
