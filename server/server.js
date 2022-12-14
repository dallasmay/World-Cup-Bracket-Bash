require("dotenv").config();
const { SERVER_PORT } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const {
  seed,
  registerUser,
  setTeamName,
  getUserInfo,
  setDefaultBracket,
  getGroupStageChoices,
  setGroupChoices,
  setRo16Choice,
  setQuarterfinalsChoice,
  setSemifinalsChoice,
  setGroupAsSeen,
  setFinalsChoices,
  getLeaderBoard,
  setLiveGroupChoice,
  calcGroupPoints,
  getOtherTeam,
  setLiveRo16,
  setLiveQf,
  setLiveSf,
  calcRo16Points,
  calcQfPoints,
  calcSfPoints,
} = require("./controller");

// DEV ENDPOINTS
app.get("/seed", seed);
app.post("/live-bracket/group", setLiveGroupChoice);
app.post("/live-bracket/ro16", setLiveRo16);
app.post("/live-bracket/quarterfinals", setLiveQf);
app.post("/live-bracket/semifinals", setLiveSf);
app.get("/points/group", calcGroupPoints);
app.get("/points/ro16", calcRo16Points);
app.get("/points/quarterfinals", calcQfPoints);
app.get("/points/semifinals", calcSfPoints);

//ENDPOINTS
app.post("/user", getUserInfo);
app.post("/register", registerUser);
app.post("/team", setTeamName);
app.post("/bracket/default", setDefaultBracket);

app.post("/bracket/group-stage", getGroupStageChoices)
app.post("/bracket/set-group-stage", setGroupChoices);
app.post("/bracket/group/set-as-seen", setGroupAsSeen)

app.post("/bracket/ro16", setRo16Choice);

app.post("/bracket/quarterfinals", setQuarterfinalsChoice);

app.post("/bracket/semifinals", setSemifinalsChoice);

app.post("/bracket/finals", setFinalsChoices);

app.get("/leaderboard", getLeaderBoard);
app.post("/leaderboard/other-team", getOtherTeam);



app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
