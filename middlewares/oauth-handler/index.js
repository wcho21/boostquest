const config = require('#config');
const axios = require('axios');
const users = require('#database/users');
const inputCases = require('#database/inputCases');
const { randomInt } = require('crypto');

const oauthHandler = async (req, res) => {
  const code = req.query.code;

  const accessToken = await fetchAccessToken(code);
  const { userId, userName } = await fetchUser(accessToken);

  const userExists = await users.exists(userId);
  
  if (!userExists) {
    await users.insert(userId, userName);

    const numOfDays = 4;
    const inputCaseNumMin = 1;
    const inputCaseNumMax = 100

    for (let i = 0; i < numOfDays; ++i) {
      const inputCase = randomInt(inputCaseNumMin, inputCaseNumMax+1); // +1 since end is exclusive
      const dayId = i+1;

      await inputCases.insert(userId, dayId, inputCase);
    }
  }

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
