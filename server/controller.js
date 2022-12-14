require("dotenv").config();
const Sequelize = require("sequelize");

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  seed: (req, res) => {
    sequelize
      .query(
        `CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        team_name VARCHAR(100) UNIQUE,
        group_score INT DEFAULT 0,
        ro16_score INT DEFAULT 0,
        quarter_score INT DEFAULT 0,
        semi_score INT DEFAULT 0,
        final_score INT DEFAULT 0,
        a_is_seen BOOL DEFAULT false,
        b_is_seen BOOL DEFAULT false,
        c_is_seen BOOL DEFAULT false,
        d_is_seen BOOL DEFAULT false,
        e_is_seen BOOL DEFAULT false,
        f_is_seen BOOL DEFAULT false,
        g_is_seen BOOL DEFAULT false,
        h_is_seen BOOL DEFAULT false
    );
        CREATE TABLE countries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20) NOT NULL UNIQUE,
          abbr VARCHAR(10) NOT NULL UNIQUE,
          fifa_rank INT NOT NULL UNIQUE
        );
        CREATE TABLE brackets (
          id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4 (),
          user_id VARCHAR(50) NOT NULL REFERENCES users(id),
          round VARCHAR(10) NOT NULL,
          group_letter VARCHAR(1) NOT NULL,
          game_number INT,
          country_id INT NOT NULL REFERENCES countries(id),
          position INT NOT NULL,
          UTC_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
        );
        INSERT INTO countries (name, abbr, fifa_rank)
        values ('Argentina', 'ARG', '3'),
        ('Australia', 'AUS', '38'),
        ('Belgium', 'BEL', '2'),
        ('Brazil', 'BRA', '1'),
        ('Cameroon', 'CMR', '43'),
        ('Canada', 'CAN', '41'),
        ('Costa Rica', 'CRC', '31'),
        ('Croatia', 'CRO', '12'),
        ('Denmark', 'DEN', '10'),
        ('Ecuador', 'ECU', '44'),
        ('England', 'ENG', '5'),
        ('France', 'FRA', '4'),
        ('Germany', 'GER', '11'),
        ('Ghana', 'GHA', '61'),
        ('Iran', 'IRN', '20'),
        ('Japan', 'JPN', '24'),
        ('Mexico', 'MEX', '13'),
        ('Morocco', 'MAR', '22'),
        ('Netherlands', 'NED', '8'),
        ('Poland', 'POL', '26'),
        ('Portugal', 'POR', '9'),
        ('Qatar', 'QAT', '50'),
        ('Saudi Arabia', 'KSA', '51'),
        ('Senegal', 'SEN', '18'),
        ('Serbia', 'SRB', '21'),
        ('South Korea', 'KOR', '28'),
        ('Spain', 'ESP', '7'),
        ('Switzerland', 'SUI', '15'),
        ('Tunisia', 'TUN', '30'),
        ('United States', 'USA', '16'),
        ('Uruguay', 'URU', '14'),
        ('Wales', 'WAL', '19');`
      )
      .then(() => res.status(200).send("Db Seeded"))
      .catch((err) => console.log(err));
  },
  registerUser: (req, res) => {
    const { userId, name } = req.body;

    sequelize
      .query(
        `INSERT INTO users (id, name)
    VALUES ('${userId}', '${name}')`
      )
      .then(() => res.status(200).send())
      .catch((err) => console.log(err));
  },
  setTeamName: (req, res) => {
    const { userId, teamName } = req.body;

    sequelize
      .query(
        `UPDATE users
    SET team_name = $1
    WHERE id = $2
    RETURNING team_name`,
        {
          bind: [`${teamName}`, `${userId}`],
        }
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0][0]);
      })
      .catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          res.status(400).send("Teamname Already Taken");
        } else {
          res.status(400).send(err);
        }
        console.log(err);
      });
  },
  getUserInfo: (req, res) => {
    const { userId } = req.body;

    sequelize
      .query(
        `SELECT team_name, (group_score + ro16_score + quarter_score + semi_score + final_score) AS score, a_is_seen, b_is_seen, c_is_seen, d_is_seen, e_is_seen, f_is_seen, g_is_seen, h_is_seen FROM users WHERE id = '${userId}';
        
        SELECT id, (group_score + ro16_score + quarter_score + semi_score + final_score) AS score FROM users ORDER BY score DESC;`
      )
      .then((dbRes) => {
        let scoreArr = dbRes[1][1].rows;
        let entry = scoreArr.find((ele) => {
          return ele.id === userId;
        });
        let rank = scoreArr.indexOf(entry) + 1;
        res.status(200).send([dbRes[0][0], rank]);
      })
      .catch((err) => console.log(err));
  },
  setDefaultBracket: (req, res) => {
    const { userId } = req.body;

    sequelize
      .query(
        `INSERT INTO brackets (user_id, round, group_letter, country_id, position)
        VALUES ('${userId}', 'group', 'a', '19', '1'),
        ('${userId}', 'group', 'a', '24', '2'),
        ('${userId}', 'group', 'a', '10', '3'),
        ('${userId}', 'group', 'a', '22', '4'),
        ('${userId}', 'group', 'b', '11', '1'),
        ('${userId}', 'group', 'b', '30', '2'),
        ('${userId}', 'group', 'b', '32', '3'),
        ('${userId}', 'group', 'b', '15', '4'),
        ('${userId}', 'group', 'c', '1', '1'),
        ('${userId}', 'group', 'c', '17', '2'),
        ('${userId}', 'group', 'c', '20', '3'),
        ('${userId}', 'group', 'c', '23', '4'),
        ('${userId}', 'group', 'd', '12', '1'),
        ('${userId}', 'group', 'd', '9', '2'),
        ('${userId}', 'group', 'd', '29', '3'),
        ('${userId}', 'group', 'd', '2', '4'),
        ('${userId}', 'group', 'e', '27', '1'),
        ('${userId}', 'group', 'e', '13', '2'),
        ('${userId}', 'group', 'e', '16', '3'),
        ('${userId}', 'group', 'e', '7', '4'),
        ('${userId}', 'group', 'f', '3', '1'),
        ('${userId}', 'group', 'f', '8', '2'),
        ('${userId}', 'group', 'f', '18', '3'),
        ('${userId}', 'group', 'f', '6', '4'),
        ('${userId}', 'group', 'g', '4', '1'),
        ('${userId}', 'group', 'g', '28', '2'),
        ('${userId}', 'group', 'g', '25', '3'),
        ('${userId}', 'group', 'g', '5', '4'),
        ('${userId}', 'group', 'h', '21', '1'),
        ('${userId}', 'group', 'h', '31', '2'),
        ('${userId}', 'group', 'h', '26', '3'),
        ('${userId}', 'group', 'h', '14', '4');
    `
      )
      .then(() => {
        res.status(200).send("Default bracket created for user");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  setGroupAsSeen: (req, res) => {
    const { userId, groupLetter } = req.body;
    const group = `${groupLetter}_is_seen`;

    sequelize
      .query(
        `UPDATE users
        SET ${group} = true
        WHERE id = '${userId}'
        RETURNING a_is_seen, b_is_seen, c_is_seen, d_is_seen, e_is_seen, f_is_seen, g_is_seen, h_is_seen;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  getGroupStageChoices: (req, res) => {
    const { userId } = req.body;

    sequelize
      .query(
        `SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'group'
          ORDER BY group_letter ASC, position ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'ro16'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'qua'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'sem')
          OR (b.user_id = '${userId}' AND round = 'cons')
          ORDER BY round DESC, game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'final')
          OR (b.user_id = '${userId}' AND round = 'wCons')
          ORDER BY game_number ASC;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => console.log(err));
  },
  setGroupChoices: (req, res) => {
    const { userId, countriesArr } = req.body;
    const groupLetter = countriesArr[0].group_letter;

    const groupADeletePath = "49, 51, 57, 59, 61, 62, 63, 64";

    const deletePath =
      groupLetter === "a" || groupLetter === "b"
        ? "49, 51, 57, 59, 61, 62, 63, 64"
        : groupLetter === "c" || groupLetter === "d"
        ? "50, 52, 57, 59, 61, 62, 63, 64"
        : groupLetter === "e" || groupLetter === "f"
        ? "53, 55, 58, 60, 61, 62, 63, 64"
        : groupLetter === "g" || groupLetter === "h"
        ? "54, 56, 58, 60, 61, 62, 63, 64"
        : "";
    sequelize
      .query(
        `DELETE
         FROM brackets
         WHERE user_id = '${userId}' AND group_letter = '${groupLetter}';

         DELETE
         FROM brackets
         WHERE user_id = '${userId}' AND game_number IN (${deletePath});
         
         INSERT INTO brackets (user_id, round, group_letter, country_id, position)
        VALUES ('${userId}', 'group', '${groupLetter}', '${countriesArr[0].id}', '1'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[1].id}', '2'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[2].id}', '3'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[3].id}', '4');
        
        SELECT group_letter, position, name, abbr, fifa_rank, c.id 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'group'
          ORDER BY group_letter ASC, position ASC;

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'ro16'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'qua'
          ORDER BY game_number ASC;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => console.log(err));
  },
  setRo16Choice: (req, res) => {
    const { userId, winner, gameNum } = req.body;
    const { group_letter, id, position } = winner;

    const deletePath =
      gameNum === 49 || gameNum === 50
        ? "57, 61, 63, 64"
        : gameNum === 51 || gameNum === 52
        ? "59, 62, 63, 64"
        : gameNum === 53 || gameNum === 54
        ? "58, 61, 63, 64"
        : gameNum === 55 || gameNum === 56
        ? "60, 62, 63, 64"
        : "";

    sequelize
      .query(
        `DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number = '${gameNum}';

       DELETE
         FROM brackets
         WHERE user_id = '${userId}' AND game_number IN (${deletePath});
       
       INSERT INTO brackets (user_id, round, group_letter, game_number, country_id, position)
      VALUES ('${userId}', 'ro16', '${group_letter}', '${gameNum}', '${id}', '${position}');

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'ro16'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'qua'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'sem')
          OR (b.user_id = '${userId}' AND round = 'cons')
          ORDER BY round DESC, game_number ASC;`
      )
      .then((dbRes) => {
        // res.status(200).send(dbRes[0]);
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  setQuarterfinalsChoice: (req, res) => {
    const { userId, winner, gameNum } = req.body;
    const { group_letter, id, position } = winner;
    console.log(userId, winner, gameNum, group_letter, id, position);

    const deletePath =
      gameNum === 57 || gameNum === 58
        ? "61, 63, 64"
        : gameNum === 59 || gameNum === 60
        ? "62, 63, 64"
        : "";

    sequelize
      .query(
        `DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number = '${gameNum}';
       
       DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number IN (${deletePath});
       
       INSERT INTO brackets (user_id, round, group_letter, game_number, country_id, position)
      VALUES ('${userId}', 'qua', '${group_letter}', '${gameNum}', '${id}', '${position}');
      
      SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'qua'
          ORDER BY game_number ASC;
          
          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'sem')
          OR (b.user_id = '${userId}' AND round = 'cons')
          ORDER BY round DESC, game_number ASC;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => console.log(err));
  },
  setSemifinalsChoice: (req, res) => {
    const { userId, winner, gameNum, runnerUp } = req.body;
    const { group_letter, id, position } = winner;
    const runnerUpId = runnerUp.id;
    const runnerUpGroupLetter = runnerUp.group_letter;
    const runnerUpPosition = runnerUp.position;

    sequelize
      .query(
        `DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number = '${gameNum}';
       
       DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number IN (63, 64);
       
       INSERT INTO brackets (user_id, round, group_letter, game_number, country_id, position)
      VALUES ('${userId}', 'sem', '${group_letter}', '${gameNum}', '${id}', '${position}'),
      ('${userId}', 'cons', '${runnerUpGroupLetter}', '${gameNum}', '${runnerUpId}', '${runnerUpPosition}');
      
      SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'sem')
          OR (b.user_id = '${userId}' AND round = 'cons')
          ORDER BY round DESC, game_number ASC;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => console.log(err));
  },
  setFinalsChoices: (req, res) => {
    const { userId, winner, gameNum } = req.body;
    const { group_letter, id, position } = winner;

    sequelize
      .query(
        `DELETE
       FROM brackets
       WHERE user_id = '${userId}' AND game_number = '${gameNum}';
       
       INSERT INTO brackets (user_id, round, group_letter, game_number, country_id, position)
      VALUES ('${userId}', '${
          gameNum === 64 ? "final" : gameNum === 63 ? "wCons" : ""
        }', '${group_letter}', '${gameNum}', '${id}', '${position}');

      
      SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = '${
          gameNum === 64 ? "final" : gameNum === 63 ? "wCons" : ""
        }';`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => console.log(err));
  },
  getLeaderBoard: (req, res) => {
    sequelize
      .query(
        `SELECT name, team_name, (group_score + ro16_score + quarter_score + semi_score + final_score) AS score FROM users ORDER BY score DESC;
         SELECT name FROM test_users WHERE id = 'updateTime';`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[1]);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send("Server Error");
      });
  },
  setLiveGroupChoice: (req, res) => {
    const { country1, country2, country3, country4, userId, groupLetter } =
      req.body;
    console.log(country1, country2, country3, country4, userId, groupLetter);

    // sequelize.query(`
    //     CREATE TABLE live_bracket (
    //       id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4 (),
    //       user_id VARCHAR(50) NOT NULL,
    //       round VARCHAR(10) NOT NULL,
    //       group_letter VARCHAR(1) NOT NULL,
    //       game_number INT,
    //       country_id INT NOT NULL REFERENCES countries(id),
    //       position INT NOT NULL,
    //       UTC_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
    //     );`).then((res) => console.log(res));

    sequelize
      .query(
        `
         DELETE
         FROM live_bracket
         WHERE user_id = '${userId}' AND round = 'group' AND group_letter = '${groupLetter}';

         INSERT INTO live_bracket (user_id, round, group_letter, country_id, position)
        VALUES ('${userId}', 'group', '${groupLetter}', '${country1[0].id}', '${country1[1]}'),
        ('${userId}', 'group', '${groupLetter}', '${country2[0].id}', '${country2[1]}'),
        ('${userId}', 'group', '${groupLetter}', '${country3[0].id}', '${country3[1]}'),
        ('${userId}', 'group', '${groupLetter}', '${country4[0].id}', '${country4[1]}');`
      )
      .then((dbRes) => {
        console.log(dbRes);
        res
          .status(200)
          .send(`Group ${groupLetter.toUpperCase()} updated successfully!`);
      })
      .catch((err) => console.log(err));
  },
  calcGroupPoints: (req, res) => {
    sequelize
      .query(
        `
      SELECT user_id, country_id, group_letter, position
      FROM brackets
      WHERE round = 'group'
      ORDER BY user_id, group_letter ASC, position ASC;

      SELECT country_id, group_letter, position
      FROM live_bracket
      WHERE round = 'group'
      ORDER BY group_letter ASC, position ASC;
    `
      )
      .then((dbRes) => {
        const userBrackets = dbRes[1][0].rows;
        const liveBracket = dbRes[1][1].rows;

        const numOfBrackets = userBrackets.length / 32;
        const separatedUserBrackets = [];
        const scores = [];
        const userIds = [];

        for (let i = 1; i <= numOfBrackets; i++) {
          let currentBracket = [];
          for (let j = 0; j < 32; j++) {
            currentBracket.push(userBrackets.shift());
          }
          separatedUserBrackets.push(currentBracket);
        }

        for (let i = 0; i < separatedUserBrackets.length; i++) {
          let positionScore = 0;
          let qualScore = 0;
          for (let j = 0; j < 32; j++) {
            let currPositionScore = 0;
            let currQualScore = 0;
            if (
              separatedUserBrackets[i][j].country_id ===
              liveBracket[j].country_id
            ) {
              liveBracket[j].position === 1
                ? (currPositionScore += 26)
                : liveBracket[j].position === 2
                ? (currPositionScore += 16)
                : liveBracket[j].position === 3 || liveBracket[j].position === 4
                ? (currPositionScore += 10)
                : 0;
            }
            if (separatedUserBrackets[i][j].position === 1) {
              if (
                separatedUserBrackets[i][j].country_id ===
                  liveBracket[j].country_id ||
                separatedUserBrackets[i][j].country_id ===
                  liveBracket[j + 1].country_id
              ) {
                currQualScore += 18;
              }
            }
            if (separatedUserBrackets[i][j].position === 2) {
              if (
                separatedUserBrackets[i][j].country_id ===
                  liveBracket[j].country_id ||
                separatedUserBrackets[i][j].country_id ===
                  liveBracket[j - 1].country_id
              ) {
                currQualScore += 18;
              }
            }
            positionScore += currPositionScore;
            qualScore += currQualScore;
          }
          scores.push(positionScore + qualScore);
          userIds.push(`'${separatedUserBrackets[i][0].user_id}'`);
          console.log(
            separatedUserBrackets[i][0].user_id,
            positionScore,
            qualScore
          );
        }
        // res.status(200).send([scores, userIds]);

        sequelize
          .query(
            `
        UPDATE users
        SET
          group_score=bulk_query.updated_group_score
        FROM
          (
            SELECT *
            FROM
              UNNEST(ARRAY[${userIds}], ARRAY[${scores}])
              AS t(user_id, updated_group_score)
          ) AS bulk_query
        WHERE
          users.id=bulk_query.user_id;
  `
          )
          .then((dbRes) => {
            console.log(dbRes);
            res.status(200).send([scores, userIds]);
          })
          .catch((err) => console.log(err));

        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        const monthStr = month === 11 ? "Nov" : month === 12 ? "Dec" : "";
        const adjustedHours = hours >= 13 ? hours % 12 : hours;
        const amPm = hours >= 12 ? "pm" : "am";
        const updateStr = `${monthStr} ${day} at ${adjustedHours}:${minutes}${amPm}`;

        sequelize.query(
          `UPDATE test_users SET name = '${updateStr}' WHERE id = 'updateTime'`
        );
      });

    // sequelize.query(`
    //       CREATE TABLE test_users (
    //     id VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
    //     name VARCHAR(100) NOT NULL,
    //     team_name VARCHAR(100) UNIQUE,
    //     group_score INT DEFAULT 0,
    //     ro16_score INT DEFAULT 0,
    //     quarter_score INT DEFAULT 0,
    //     semi_score INT DEFAULT 0,
    //     final_score INT DEFAULT 0
    // );`);
  },
  getOtherTeam: (req, res) => {
    const { teamName } = req.body;

    sequelize
      .query(`SELECT id, name FROM users WHERE team_name = '${teamName}'`)
      .then((dbRes) => {
        let userId = dbRes[0][0].id;
        let name = dbRes[0][0].name;

        sequelize
          .query(
            `SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'group'
          ORDER BY group_letter ASC, position ASC;

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'ro16'
          ORDER BY game_number ASC;

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}' AND round = 'qua'
          ORDER BY game_number ASC;

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'sem')
          OR (b.user_id = '${userId}' AND round = 'cons')
          ORDER BY round DESC, game_number ASC;

          SELECT group_letter, position, name, abbr, fifa_rank, c.id, round, game_number
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE (b.user_id = '${userId}' AND round = 'final')
          OR (b.user_id = '${userId}' AND round = 'wCons')
          ORDER BY game_number ASC;`
          )
          .then((dbRes) => {
            res.status(200).send([dbRes[1], name]);
          })
          .catch((err) => console.log(err));
      })
      .then((dbRes) => {
        console.log(dbRes);
      })
      .catch((err) => console.log(err));
  },
  setLiveRo16: (req, res) => {
    const { userId, winnerObj, gameNum } = req.body;
    const { id, position, groupLetter } = winnerObj;

    sequelize
      .query(
        `
         DELETE
         FROM live_bracket
         WHERE user_id = '${userId}' AND round = 'ro16' AND game_number = '${gameNum}';

         INSERT INTO live_bracket (user_id, round, group_letter, country_id, position, game_number)
        VALUES ('${userId}', 'ro16', '${groupLetter}', '${id}', '${position}', '${gameNum}');
`
      )
      .then((dbRes) => {
        console.log(dbRes);
        res.status(200).send(`Game ${gameNum} updated successfully!`);
      })
      .catch((err) => console.log(err));
  },
  calcRo16Points: (req, res) => {
    // SELECT user_id, country_id, game_number, group_letter
    //   FROM brackets
    //   WHERE round = 'ro16' AND (user_id = 'FIYXSaYa4ahN6ZORjxHGwgIMtWP2' OR user_id = 'TLEutsVObPdp2hoXMff8AdvmGvR2' OR user_id = 'hReaZjqr5bQ5Th2mEv7gggGKNVx2' OR user_id = 'iIivU5r1d7f0m0NChSFd55axMK13' OR user_id = 'ql4lemXcLxOyCeDbrV74611RF903')
    //   ORDER BY user_id, game_number ASC;

    //   SELECT country_id, game_number, group_letter
    //   FROM live_bracket
    //   WHERE round = 'ro16'
    //   ORDER BY group_letter ASC, position ASC;

    sequelize
      .query(
        `
        SELECT user_id, country_id, game_number, group_letter
          FROM brackets
          WHERE round = 'ro16'
          ORDER BY user_id, game_number ASC;

          SELECT country_id, game_number, group_letter
          FROM live_bracket
          WHERE round = 'ro16'
          ORDER BY group_letter ASC, position ASC;`
      )
      .then((dbRes) => {
        const userBrackets = dbRes[1][0].rows;
        const liveBracket = dbRes[1][1].rows;

        const numOfBrackets = userBrackets.length / 8;
        const separatedUserBrackets = [];
        const scores = [];
        const userIds = [];

        for (let i = 1; i <= numOfBrackets; i++) {
          let currentBracket = [];
          for (let j = 0; j < 8; j++) {
            currentBracket.push(userBrackets.shift());
          }
          separatedUserBrackets.push(currentBracket);
        }

        for (let i = 0; i < separatedUserBrackets.length; i++) {
          let userPoints = 0;
          let userId = separatedUserBrackets[i][0].user_id;
          for (let j = 0; j < separatedUserBrackets[i].length; j++) {
            let countryId = separatedUserBrackets[i][j].country_id;
            let gameNum = separatedUserBrackets[i][j].game_number;

            const liveCountryMatch = liveBracket.find((ele) => {
              return ele.country_id === countryId;
            });

            if (liveCountryMatch === undefined) {
              console.log(`No match for ${countryId}`);
            } else if (liveCountryMatch.game_number === gameNum) {
              userPoints += 80;
              console.log("Right choice, right position");
            } else {
              userPoints += 40;
              console.log("Right choice, wrong position");
            }
          }
          scores.push(userPoints);
          userIds.push(`'${userId}'`);
        }

        sequelize
          .query(
            `
        UPDATE users
        SET
          ro16_score=bulk_query.updated_ro16_score
        FROM
          (
            SELECT *
            FROM
              UNNEST(ARRAY[${userIds}], ARRAY[${scores}])
              AS t(user_id, updated_ro16_score)
          ) AS bulk_query
        WHERE
          users.id=bulk_query.user_id;
  `
          )
          .then((dbRes) => {
            console.log(dbRes);
            res.status(200).send([scores, userIds]);
          })
          .catch((err) => console.log(err));

        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        const monthStr = month === 11 ? "Nov" : month === 12 ? "Dec" : "";
        const adjustedHours = hours >= 13 ? hours % 12 : hours;
        const amPm = hours >= 12 ? "pm" : "am";
        const updateStr = `${monthStr} ${day} at ${adjustedHours}:${minutes}${amPm}`;

        sequelize.query(
          `UPDATE test_users SET name = '${updateStr}' WHERE id = 'updateTime'`
        );
      })
      .catch((err) => console.log(err));
  },
  setLiveQf: (req, res) => {
    const { userId, winnerObj, gameNum } = req.body;
    const { id, position, groupLetter } = winnerObj;

    sequelize
      .query(
        `
         DELETE
         FROM live_bracket
         WHERE user_id = '${userId}' AND round = 'qua' AND game_number = '${gameNum}';

         INSERT INTO live_bracket (user_id, round, group_letter, country_id, position, game_number)
        VALUES ('${userId}', 'qua', '${groupLetter}', '${id}', '${position}', '${gameNum}');
`
      )
      .then((dbRes) => {
        console.log(dbRes);
        res.status(200).send(`Game ${gameNum} updated successfully!`);
      })
      .catch((err) => console.log(err));
  },
  calcQfPoints: (req, res) => {
    sequelize
      .query(
        `
    SELECT user_id, country_id, game_number, group_letter
      FROM brackets
      WHERE round = 'qua'
      ORDER BY user_id, game_number ASC;

      SELECT country_id, game_number, group_letter
      FROM live_bracket
      WHERE round = 'qua'
      ORDER BY game_number ASC;`
      )
      .then((dbRes) => {
        const userBrackets = dbRes[1][0].rows;
        const liveBracket = dbRes[1][1].rows;

        const numOfBrackets = userBrackets.length / 4;
        const separatedUserBrackets = [];
        const scores = [];
        const userIds = [];

        for (let i = 1; i <= numOfBrackets; i++) {
          let currentBracket = [];
          for (let j = 0; j < 4; j++) {
            currentBracket.push(userBrackets.shift());
          }
          separatedUserBrackets.push(currentBracket);
        }

        for (let i = 0; i < separatedUserBrackets.length; i++) {
          let userPoints = 0;
          let userId = separatedUserBrackets[i][0].user_id;
          for (let j = 0; j < separatedUserBrackets[i].length; j++) {
            let countryId = separatedUserBrackets[i][j].country_id;
            let gameNum = separatedUserBrackets[i][j].game_number;

            const liveCountryMatch = liveBracket.find((ele) => {
              return ele.country_id === countryId;
            });

            if (liveCountryMatch === undefined) {
              console.log(`No match for ${countryId}`);
            } else if (liveCountryMatch.game_number === gameNum) {
              userPoints += 160;
              console.log("Right choice, right position");
            } else {
              userPoints += 80;
              console.log("Right choice, wrong position");
            }
          }
          scores.push(userPoints);
          userIds.push(`'${userId}'`);
        }
        // res.status(200).send([userIds, scores]);

        sequelize
          .query(
            `
        UPDATE users
        SET
          quarter_score=bulk_query.updated_quarter_score
        FROM
          (
            SELECT *
            FROM
              UNNEST(ARRAY[${userIds}], ARRAY[${scores}])
              AS t(user_id, updated_quarter_score)
          ) AS bulk_query
        WHERE
          users.id=bulk_query.user_id;
  `
          )
          .then((dbRes) => {
            console.log(dbRes);
            res.status(200).send([scores, userIds]);
          })
          .catch((err) => console.log(err));

        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        const monthStr = month === 11 ? "Nov" : month === 12 ? "Dec" : "";
        const adjustedHours = hours >= 13 ? hours % 12 : hours;
        const amPm = hours >= 12 ? "pm" : "am";
        const updateStr = `${monthStr} ${day} at ${adjustedHours}:${minutes}${amPm}`;

        sequelize.query(
          `UPDATE test_users SET name = '${updateStr}' WHERE id = 'updateTime'`
        );
      })
      .catch((err) => console.log(err));
  },
  setLiveSf: (req, res) => {
    const { userId, winnerObj, gameNum } = req.body;
    const { id, position, groupLetter } = winnerObj;

    sequelize
      .query(
        `
         DELETE
         FROM live_bracket
         WHERE user_id = '${userId}' AND round = 'sem' AND game_number = '${gameNum}';

         INSERT INTO live_bracket (user_id, round, group_letter, country_id, position, game_number)
        VALUES ('${userId}', 'sem', '${groupLetter}', '${id}', '${position}', '${gameNum}');
`
      )
      .then((dbRes) => {
        console.log(dbRes);
        res.status(200).send(`Game ${gameNum} updated successfully!`);
      })
      .catch((err) => console.log(err));
  },
  calcSfPoints: (req, res) => {
    sequelize
      .query(
        `
    SELECT user_id, country_id, game_number, group_letter
      FROM brackets
      WHERE round = 'sem'
      ORDER BY user_id, game_number ASC;

      SELECT country_id, game_number, group_letter
      FROM live_bracket
      WHERE round = 'sem'
      ORDER BY game_number ASC;`
      )
      .then((dbRes) => {
        const userBrackets = dbRes[1][0].rows;
        const liveBracket = dbRes[1][1].rows;

        const numOfBrackets = userBrackets.length / 2;
        const separatedUserBrackets = [];
        const scores = [];
        const userIds = [];

        for (let i = 1; i <= numOfBrackets; i++) {
          let currentBracket = [];
          for (let j = 0; j < 2; j++) {
            currentBracket.push(userBrackets.shift());
          }
          separatedUserBrackets.push(currentBracket);
        }

        for (let i = 0; i < separatedUserBrackets.length; i++) {
          let userPoints = 0;
          let userId = separatedUserBrackets[i][0].user_id;
          for (let j = 0; j < separatedUserBrackets[i].length; j++) {
            let countryId = separatedUserBrackets[i][j].country_id;
            let gameNum = separatedUserBrackets[i][j].game_number;

            const liveCountryMatch = liveBracket.find((ele) => {
              return ele.country_id === countryId;
            });

            if (liveCountryMatch === undefined) {
              console.log(`No match for ${countryId}`);
            } else if (liveCountryMatch.game_number === gameNum) {
              userPoints += 320;
              console.log("Right choice, right position");
            } else {
              userPoints += 160;
              console.log("Right choice, wrong position");
            }
          }
          scores.push(userPoints);
          userIds.push(`'${userId}'`);
        }
        // res.status(200).send([userIds, scores]);

        sequelize
          .query(
            `
        UPDATE users
        SET
          semi_score=bulk_query.updated_semi_score
        FROM
          (
            SELECT *
            FROM
              UNNEST(ARRAY[${userIds}], ARRAY[${scores}])
              AS t(user_id, updated_semi_score)
          ) AS bulk_query
        WHERE
          users.id=bulk_query.user_id;
  `
          )
          .then((dbRes) => {
            console.log(dbRes);
            res.status(200).send([scores, userIds]);
          })
          .catch((err) => console.log(err));

        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = `${date.getMinutes()}`.padStart(2, "0");
        const monthStr = month === 11 ? "Nov" : month === 12 ? "Dec" : "";
        const adjustedHours = hours >= 13 ? hours % 12 : hours;
        const amPm = hours >= 12 ? "pm" : "am";
        const updateStr = `${monthStr} ${day} at ${adjustedHours}:${minutes}${amPm}`;

        sequelize.query(
          `UPDATE test_users SET name = '${updateStr}' WHERE id = 'updateTime'`
        );
      })
      .catch((err) => console.log(err));
  },
};
