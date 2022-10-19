const pool = require('#database/pool');
const config = require('#config');

const table = config.mysql.problemsTable;
const usersTable = config.mysql.usersTable;

const getRow = async (userId, problemId) => {
  const sql = `SELECT * FROM \`${table}\` WHERE user_id = ? AND problem_id = ?`;
  const [rows] = await pool.query(sql, [userId, problemId]);

  return (rows.length === 0) ? null : rows[0];
}

const rowExists = async (userId, problemId) => {
  const sql = `SELECT EXISTS (SELECT * FROM \`${table}\` WHERE user_id = ? AND problem_id = ?) AS \`exists\``;
  const [rows] = await pool.query(sql, [userId, problemId]);
  const row = rows[0];

  return (row.exists === 1) ? true : false;
}

exports.getStatus = async (userId, problemId) => {
  const row = await getRow(userId, problemId);

  const status = {
    solved: false,
    tried: false,
    lastTriedAt: null,
  };

  if (row === null) {
    return status;
  }

  status.tried = true;
  status.lastTriedAt = row.last_tried_at;
  status.solved = (row.solved === 1) ? true : false;

  return status;
}

exports.updateAsSolved = async (userId, problemId) => {
  let sql;
  if (await rowExists(userId, problemId)) {
    sql = `UPDATE \`${table}\` SET last_tried_at = NOW(), solved = 1 WHERE user_id = ? AND problem_id = ?`;
  } else {
    sql = `INSERT INTO \`${table}\` (user_id, problem_id, solved) VALUES (?, ?, 1)`;
  }

  await pool.query(sql, [userId, problemId]);
}

exports.updateLastTriedTime = async (userId, problemId) => {
  let sql;
  if (await rowExists(userId, problemId)) {
    sql = `UPDATE \`${table}\` SET last_tried_at = NOW() WHERE user_id = ? AND problem_id = ?`;
  } else {
    sql = `INSERT INTO \`${table}\` (user_id, problem_id) VALUES (?, ?)`;
  }

  await pool.query(sql, [userId, problemId]);
}

exports.getRankingForProblem = async (problemId, numOfRanking) => {
  const sql = `SELECT u.name, p.last_tried_at FROM \`${table}\` AS p JOIN \`${usersTable}\` AS u ON p.user_id = u.id WHERE p.problem_id = ? AND p.solved = 1 ORDER BY last_tried_at LIMIT ?`;

  const [rows] = await pool.query(sql, [problemId, numOfRanking]);
  
  const namesAndTimes = rows.map(row => ({
    rankerName: row.name,
    solvedTimestamp: new Date(row.last_tried_at).getTime(),
  }));
  return namesAndTimes;
}
