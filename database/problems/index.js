const pool = require('#database/pool');
const config = require('#config');

const table = config.mysql.problemsTable;

const getProblemRow = async (problemId, userId) => {
  const sql = `SELECT * FROM \`${table}\` WHERE pid = ? AND uid = ?`;
  const [rows] = await pool.query(sql, [problemId, userId]);

  return (rows.length === 0) ? null : rows[0];
}

const isProblemRowExists = async (problemId, userId) => {
  const sql = `SELECT EXISTS (SELECT * FROM \`${table}\` WHERE pid = ? AND uid = ?) AS \`exists\``;
  const [rows] = await pool.query(sql, [problemId, userId]);
  const row = rows[0];

  return (row.exists === 1) ? true : false;
}

exports.getProblemStatus = async (problemId, userId) => {
  const row = await getProblemRow(problemId, userId);

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

exports.updateProblemAsSolved = async (problemId, userId) => {
  let sql;
  if (await isProblemRowExists(problemId, userId)) {
    sql = `UPDATE \`${table}\` SET last_tried_at = NOW(), solved = 1 WHERE pid = ? AND uid = ?`;
  } else {
    sql = `INSERT INTO \`${table}\` (pid, uid, last_tried_at, solved) VALUES (?, ?, NOW(), 1)`;
  }

  await pool.query(sql, [problemId, userId]);
}

exports.updateProblemLastTriedAt = async (problemId, userId) => {
  let sql;
  if (await isProblemRowExists(problemId, userId)) {
    sql = `UPDATE \`${table}\` SET last_tried_at = NOW() WHERE pid = ? AND uid = ?`;
  } else {
    sql = `INSERT INTO \`${table}\` (pid, uid, last_tried_at) VALUES (?, ?, NOW())`;
  }

  await pool.query(sql, [problemId, userId]);
}
