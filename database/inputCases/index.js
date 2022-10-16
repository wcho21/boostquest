const pool = require('#database/pool');
const config = require('#config');

const table = config.mysql.inputCasesTable;

exports.insert = async (userId, dayId, inputCase) => {
  await pool.query(`INSERT INTO \`${table}\` (user_id, day_id, input_case) VALUES (?, ?, ?)`, [userId, dayId, inputCase]);
}

exports.fetch = async (userId, dayId) => {
  const [rows] = await pool.query(`SELECT input_case FROM \`${table}\` WHERE user_id = ? AND day_id = ?`, [userId, dayId]);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const inputCase = row.input_case;
  return inputCase;
}
