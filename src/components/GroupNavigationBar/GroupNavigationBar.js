import { ReactComponent as PreviousArrow } from "../../assets/icons/PreviousArrow.svg";
import { ReactComponent as NextArrow } from "../../assets/icons/NextArrow.svg";

import styles from "./GroupNavigationBar.module.css";

const GroupNavigationbar = ({ hasEdited, saveChangeHandler }) => {
  return (
    <div className={styles["group-navigation-bar"]}>
      <button className={styles["previous-btn"]}>
        <PreviousArrow className={styles["previous-arrow"]} />
      </button>
      {hasEdited ? (
        <div className={styles["save-btn-container"]}>
          <button onClick={saveChangeHandler} className={styles["save-btn"]}>Save changes</button>
        </div>
      ) : (
        <div className={styles["group-number-container"]}>
          <p className={styles["group-number-text"]}>Group</p>
          <p className={styles["group-number-number"]}>2/8</p>
        </div>
      )}
      <button className={styles["next-btn"]}>
        <NextArrow className={styles["next-arrow"]} />
      </button>
    </div>
  );
};

export default GroupNavigationbar;
