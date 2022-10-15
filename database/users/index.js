const pool = require('#database/pool');
const config = require('#config');

const table = config.mysql.usersTable;

exports.exists = async (id) => {
  const [rows] = await pool.query(`SELECT EXISTS (SELECT * FROM \`${table}\` WHERE id = ?) AS \`exists\``, id);
  const exists = rows[0].exists === 1 ? true : false;

  return exists;
}

exports.insert = async (id, name) => {
  await pool.query(`INSERT INTO \`${table}\` (id, name) VALUES (?, ?)`, [id, name]);
}
