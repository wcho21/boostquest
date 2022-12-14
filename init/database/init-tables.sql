USE boostquest;

CREATE TABLE IF NOT EXISTS users_v1 (
  uid VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  input_case_1 SMALLINT NOT NULL,
  input_case_2 SMALLINT NOT NULL,
  input_case_3 SMALLINT NOT NULL,
  input_case_4 SMALLINT NOT NULL,
  input_case_5 SMALLINT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS problems_v1 (
  pid SMALLINT NOT NULL,
  uid VARCHAR(64) NOT NULL,
  last_tried_at TIMESTAMP NOT NULL,
  solved BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (pid, uid)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS users_v2 (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS input_cases_v2 (
  user_id INT NOT NULL,
  day_id SMALLINT NOT NULL,
  input_case SMALLINT NOT NULL,
  PRIMARY KEY (user_id, day_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS problems_v2 (
  user_id INT NOT NULL,
  problem_id SMALLINT NOT NULL,
  last_tried_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  solved BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, problem_id)
) ENGINE=InnoDB;
