import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { bracketActions, authActions } from "../../../reduxStore/store";

import GroupSortingContainer from "../../../components/groupStage/groupSelection/GroupSortingContainer/GroupSortingContainer";
import BackToProfile from "../../../components/BackToProfile/BackToProfile";
import StageHeader from "../../../components/StageHeader/StageHeader";
import GroupNavigationbar from "../../../components/groupStage/GroupNavigationBar/GroupNavigationBar";
import Loading from "../../../components/Loading/Loading";

import styles from "./GroupSelectionPage.module.css";

const URL = process.env.REACT_APP_SERVER_URL;

const GroupSelectionPage = ({ group }) => {
  const dispatch = useDispatch();

  const [countriesArr, setCountriesArr] = useState(group);
  const [hasEdited, setHasEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    let seenSaveWarning = localStorage.getItem("seenSaveWarning");
    if (seenSaveWarning === "false") {
      setIsWarningModalVisible(true);
    }
  }, []);

  const saveChangeHandler = () => {
    setIsLoading(true);
    let body = {
      userId,
      countriesArr,
    };
    axios.post(`${URL}/bracket/set-group-stage`, body).then((res) => {
      setIsLoading(false);
      setHasEdited(false);
      dispatch(bracketActions.setGroupsArr(res.data[3].rows));
      dispatch(bracketActions.setRo16Arr(res.data[3].rows));
      dispatch(bracketActions.setRo16Winners(res.data[4].rows));
      dispatch(bracketActions.setQuarterFinalsWinners(res.data[5].rows));
      dispatch(bracketActions.setFinalsArr([]));
      dispatch(bracketActions.setConsolationArr([]));
      dispatch(bracketActions.setSemiFinalsWinners([]));
      //Status Changes
      dispatch(authActions.setIsRo16Complete(false));
      dispatch(authActions.setIsQuarterFinalsComplete(false));
      dispatch(authActions.setIsSemiFinalsComplete(false));
    });
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <BackToProfile path={"/group-stage"} backTo={"Group Stage"} />
      {/* <StageHeader stage={"Group Stage"} otherInfo={"Nov 22-29"} /> */}
      {isWarningModalVisible && (
        <div className={styles["modal-container"]}>
          <div className={styles.modal}>
            <p>Remember to save your changes before leaving this page!</p>
            <div className={styles["btn-container"]}>
              <button
                className={styles["modal-btn"]}
                onClick={() => {
                  setIsWarningModalVisible(false)
                  localStorage.setItem("seenSaveWarning", true);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles["content-container"]}>
        <h1 className={styles.heading1}>
          Group {group[0].group_letter.toUpperCase()}
        </h1>
        <GroupSortingContainer
          countriesArr={countriesArr}
          setCountriesArr={setCountriesArr}
          setHasEdited={setHasEdited}
          group={group}
        />
        <GroupNavigationbar
          hasEdited={hasEdited}
          saveChangeHandler={saveChangeHandler}
          groupLetter={group[0].group_letter}
        />
      </div>
    </>
  );
};

export default GroupSelectionPage;
