# boostquest

A four-day puzzle challenge.

## How to build

### Environment Variables

The environment variables are managed with `dotenv` node package.
The `.env` file must contain the following entries, for example:

```text
SERVER_HOSTNAME=<hostname> (ex: 127.0.0.1)
SERVER_HTTP_PORT=<port-number>
SERVER_HTTPS_PORT=<port-number>
SERVER_SESSION_SECRET=<string>

SSL_KEY_PATH=<path> (ex: ./key.pem)
SSL_CERT_PATH=<path>
SSL_CA_PATH=<path>

OAUTH_GITHUB_CLIENT_ID=<client=id>
OAUTH_GITHUB_CLIENT_SECRET=<secret>
OAUTH_GITHUB_REDIRECT_URI=<uri>

MYSQL_HOST=<host>
MYSQL_PORT=<port-number>
MYSQL_USER=<user-name>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database-name>
MYSQL_USERS_TABLE=<users-table-name>
MYSQL_PROBLEMS_TABLE=<problems-table-name>
MYSQL_INPUT_CASES_TABLE=<input-cases-table-name>

SITE_FIRST_DAY_OPEN_TIME=<datetime> (ex: 2022-10-19T21:00:00+09:00)
```

### `challenges` Directory

This is a secret directory. The contents are not in this repo, but here is some brief introduction.

The problems, answers, and scenario text is managed in the single place, `challenges` directory as below:

```text
boostquest
- ...
- challenges
  - answers
    - 11
    - 12
    - 21
    - 22
    - 31
    - 32
    - 41
  - description
    - 11.ejs
    - 12.ejs
    - 19.ejs
    - 21.ejs
    - 22.ejs
    - 29.ejs
    - 31.ejs
    - 32.ejs
    - 39.ejs
    - 41.ejs
    - 42.ejs
    - 49.ejs
  - inputs
    - 10
    - 20
    - 30
    - 40
```

Each directory in `inputs` must contain 100 input case files.
For example, the `10` directory contains 100 input case files for day 1 puzzle.

Each directory in `answers` must contain 100 answer text files.
For example, the `11` directory contains 100 answer files for the first puzzle of day 1.

Each `ejs` file contains scenario content. For example, `11.ejs` contains the description of the first puzzle of day 1; `12.ejs` contains the description of the second puzzle of that day; `19.ejs` contains last words displayed when both puzzles are solved.

With these files, you can provide your own scenario and puzzles.
