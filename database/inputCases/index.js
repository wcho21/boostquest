const pool = require('#database/pool');
const config = require('#config');

const table = config.mysql.inputCasesTable;

exports.insert = async (userId, dayId, inputCase) => {
  await pool.query(`INSERT INTO \`${table}\` (user_id, day_id, input_case) VALUES (?, ?, ?)`, [userId, dayId, inputCase]);
}
