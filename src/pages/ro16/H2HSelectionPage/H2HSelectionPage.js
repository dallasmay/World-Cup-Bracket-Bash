import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import BackToProfile from "../../../components/BackToProfile/BackToProfile";
import StageHeader from "../../../components/StageHeader/StageHeader";
import H2HNavBar from "../../../components/H2HNavBar/H2HNavBar";

import { ReactComponent as Crown } from "../../../assets/icons/Crown.svg";
import { ReactComponent as Loader } from "../../../assets/icons/SmallLoadingSoccer.svg";

import { bracketActions, authActions } from "../../../reduxStore/store";

import styles from "./H2HSelectionPage.module.css";

const URL = process.env.REACT_APP_SERVER_URL;

const H2HSelectionPage = ({ group }) => {
  const ro16Winners = useSelector((state) => state.bracket.ro16Winners);

  const [winner, setWinner] = useState(ro16Winners.find((ele) => {
    return ele.name === group[0].name || ele.name === group[1].name
  }))
  
  const [isLeftActive, setIsLeftActive] = useState(winner?.name === group[0].name ? true : winner?.name === group[1].name ? false : null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  
  const toggleActiveLeft = () => {
    if (isLeftActive === null || isLeftActive === false) {
      setIsLoading(true);
      setIsLeftActive(true);
      let body = {
        userId,
        winner: group[0],
        gameNum: group[2]
      };
      axios
        .post(`${URL}/bracket/ro16`, body)
        .then((res) => {
          setIsLoading(false);
          dispatch(bracketActions.setQuarterFinalsArr(res.data[3].rows));
          dispatch(bracketActions.setRo16Winners(res.data[3].rows));
          dispatch(bracketActions.setQuarterFinalsWinners(res.data[4].rows));
          dispatch(bracketActions.setSemiFinalsArr(res.data[4].rows));
          dispatch(bracketActions.setFinalsArr(res.data[5].rows));
          dispatch(bracketActions.setConsolationArr(res.data[5].rows));
          dispatch(bracketActions.setSemiFinalsWinners(res.data[5].rows));
          //Status Changes
          if((res.data[3].rows).length === 8) {
            dispatch(authActions.setIsRo16Complete(true));
          }
            dispatch(authActions.setIsQuarterFinalsComplete(false));
            dispatch(authActions.setIsSemiFinalsComplete(false));
        })
        .catch((err) => {
          alert("There was a server error");
          console.log(err);
        });
    }
  };
  const toggleActiveRight = () => {
    if (isLeftActive === null || isLeftActive === true) {
        setIsLoading(true);
        setIsLeftActive(false);
        let body = {
          userId,
          winner: group[1],
          gameNum: group[2],
        };
        axios
          .post(`${URL}/bracket/ro16`, body)
          .then((res) => {
            setIsLoading(false);
            dispatch(bracketActions.setQuarterFinalsArr(res.data[3].rows));
            dispatch(bracketActions.setRo16Winners(res.data[3].rows));
            dispatch(bracketActions.setQuarterFinalsWinners(res.data[4].rows));
            dispatch(bracketActions.setSemiFinalsArr(res.data[4].rows));
            dispatch(bracketActions.setFinalsArr(res.data[5].rows));
            dispatch(bracketActions.setConsolationArr(res.data[5].rows));
            dispatch(bracketActions.setSemiFinalsWinners(res.data[5].rows));
            //Status Changes
            if (res.data[3].rows.length === 8) {
              dispatch(authActions.setIsRo16Complete(true));
            }
              dispatch(authActions.setIsQuarterFinalsComplete(false));
              dispatch(authActions.setIsSemiFinalsComplete(false));
          })
          .catch((err) => {
            alert("There was a server error");
            console.log(err);
        });
    }
  };

  return (
    <>
      <BackToProfile path={"/ro16"} backTo={"Round of 16"} />
      {/* <StageHeader stage={"Round of 16"} otherInfo={"Game 1 of 8"} /> */}
      <div className={styles["content-container"]}>
          <p className={styles["game-info"]}>Game {group[2]}</p>
          <p className={styles["select-winner"]}>Select the winner</p>
        {/* <p className={styles["game-info"]}>Dec 4</p>
        <p className={styles["game-info"]}>11:00AM MDT</p> */}
        {isLoading && (
          <div className={styles["loader-container"]}>
            <Loader className={styles.loader} />
          </div>
        )}
        <div className={styles["crown-container"]}>
          <Crown
            className={styles.crown}
            style={
              isLeftActive === null
                ? {}
                : isLeftActive
                ? { visibility: "visible" }
                : {}
            }
          />
          <Crown
            className={styles.crown}
            style={
              isLeftActive === null
                ? {}
                : isLeftActive
                ? { visibility: "hidden" }
                : { visibility: "visible" }
            }
          />
        </div>
        <div className={styles["cards-container"]}>
          <button
            onClick={toggleActiveLeft}
            className={`${styles["country-card"]} ${
              isLeftActive === null
                ? "box-shadow-1px-lightgrey"
                : isLeftActive
                ? "box-shadow-2px-yellow"
                : "box-shadow-1px-lightgrey"
            }`}
            disabled={isLoading ? true : false}
          >
            <img
              src={`/1x1Flags3x/Country=${group[0].abbr}.png`}
              className={styles["flag-img"]}
            />
            <p className={styles.rank}>({group[0].fifa_rank})</p>
            <div className={styles["country-text-container"]}>
              <p className={styles["team-name"]}>{group[0].name}</p>
              <p className={styles.abbr}>{group[0].abbr}</p>
            </div>
          </button>
          <button
            onClick={toggleActiveRight}
            className={`${styles["country-card"]} ${
              isLeftActive === null
                ? "box-shadow-1px-lightgrey"
                : isLeftActive
                ? "box-shadow-1px-lightgrey"
                : "box-shadow-2px-yellow"
            }`}
            disabled={isLoading ? true : false}
          >
            <img
              src={`/1x1Flags3x/Country=${group[1].abbr}.png`}
              className={styles["flag-img"]}
            />
            <p className={styles.rank2}>({group[1].fifa_rank})</p>
            <div className={styles["country-text-container2"]}>
              <p className={styles["team-name2"]}>{group[1].name}</p>
              <p className={styles.abbr2}>{group[1].abbr}</p>
            </div>
          </button>
        </div>
      </div>
      <H2HNavBar round={"ro16"} gameNum={group[2]} />
    </>
  );
};

export default H2HSelectionPage;
