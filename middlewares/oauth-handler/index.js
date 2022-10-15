const config = require('#config');
const axios = require('axios');
const pool = require('#database/pool');

const oauthHandler = async (req, res) => {
  const code = req.query.code;

  const accessToken = await fetchAccessToken(code);
  const { userId, userName } = await fetchUser(accessToken);

  const [rows] = await pool.query('SELECT EXISTS (SELECT * FROM users_v2 WHERE id = ?) AS `exists`', userId);
  const userExists = rows[0].exists === 1 ? true : false;
  
  if (!userExists) {
    await pool.query('INSERT INTO users_v2 (id, name) VALUES (?, ?)', [userId, userName]);
  }

  // TODO: insert input cases to input_cases_v2 table, instead of using users_v1 table

  // let inputCases;
  // if (!userExists) {
  //   inputCases = Array(5).fill(null).map(el => crypto.randomInt(1, 100));

  //   await pool.query('INSERT INTO users_v1 (uid, name, created_at, input_case_1, input_case_2, input_case_3, input_case_4, input_case_5)' +
  //       ' VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)', [userId, userName, ...inputCases]);
  // } else {
  //   const [rows] = await pool.query('SELECT input_case_1, input_case_2, input_case_3, input_case_4, input_case_5 FROM users_v1 WHERE uid = ?', [userId]);
  //   const row = rows[0];
  //   inputCases = [row.input_case_1, row.input_case_2, row.input_case_3, row.input_case_4, row.input_case_5];
  // }

  req.session.user = { name: userName, id: userId };

  res.redirect('/');
};

async function fetchAccessToken(code) {
  const accessTokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: config.oauth.github.clientId,
      client_secret: config.oauth.github.clientSecret,
      code,
      redirect_uri: config.oauth.github.redirectUri,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );
  const accessToken = accessTokenResponse.data.access_token;

  return accessToken;
}

async function fetchUser(accessToken) {
  const githubUserResponse = await axios.get(
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );

  const userId = githubUserResponse.data.id;
  const userName = githubUserResponse.data.login;

  return { userId, userName };
}

module.exports = oauthHandler;
