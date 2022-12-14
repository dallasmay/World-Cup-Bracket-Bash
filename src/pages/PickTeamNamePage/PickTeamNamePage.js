import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { authActions } from "../../reduxStore/store";

import Button from "../../components/Button/Button";
import { ReactComponent as WCLogo } from "../../assets/icons/SoccerBallLogo.svg";

import styles from "./PickTeamNamePage.module.css";

const URL = process.env.REACT_APP_SERVER_URL;

const PickTeamNamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);

  const [teamName, setTeamName] = useState("");
  const [isTaken, setIsTaken] = useState(false);

  const teamNameSubmitHandler = (evt) => {
    dispatch(authActions.setIsLoading(true));
    evt.preventDefault();
    let body = {
      userId,
      teamName,
    };

    axios
      .post(`${URL}/team`, body)
      .then((res) => {
        console.log(res)
        dispatch(authActions.setTeamName(res.data.team_name));
        dispatch(authActions.setIsLoading(false));
        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data === "Teamname Already Taken") {
          alert(err.response.data)
        } else {
          alert(err);
        }
        dispatch(authActions.setIsLoading(false));
      });
  };

  return (
    <>
      <div className={styles["logo-container"]}>
        <WCLogo className={styles["wc-logo"]} />
      </div>
      <div className={styles["content-container"]}>
        <h1 className={styles.heading1}>Choose your team name for the leaderboard</h1>
        <form
          onSubmit={teamNameSubmitHandler}
          className={styles["signup-form"]}
        >
          <div
            className={`${styles["input-container"]} ${styles["teamname-input-container"]}`}
          >
            <input
              type="text"
              placeholder="Team name"
              id="name-signup"
              className={styles["auth-input"]}
              onChange={(evt) => setTeamName(evt.target.value)}
              maxLength="30"
              minLength="2"
              onClick={() => setIsTaken(false)}
            />
          </div>
          <div className={styles["next-btn-container"]}>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PickTeamNamePage;
