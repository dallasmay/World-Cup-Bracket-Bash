import { ReactComponent as Crown } from "../../../assets/icons/SmallCrown.svg";

import styles from "./H2HPageCountryCard.module.css";

const H2HPageCountryCard = ({
  countryName,
  rank,
  abbr,
  position,
  group,
  positionNumber,
  isWinner
}) => {
  return (
    <div className={styles["country-card-flex-container"]}>
      <svg
        width="8"
        height="56"
        viewBox="0 0 8 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={
          positionNumber === 1
            ? { position: "absolute", top: "-3px" }
            : { position: "absolute", top: "-1px" }
        }
      >
        <path
          d="M0 0H8V56H0V0Z"
          fill={
            group === "a"
              ? "#EC404F"
              : group === "b"
              ? "#FECC4C"
              : group === "c"
              ? "#6DDAC6"
              : group === "d"
              ? "#EC8840"
              : group === "e"
              ? "#8C6AEC"
              : group === "f"
              ? "#89DA6D"
              : group === "g"
              ? "#4B78FE"
              : "#E16AEC"
          }
        />
      </svg>

      <div className={styles["position-container"]}>
        <p className={styles.position}>{position}</p>
      </div>
      <div className={styles["country-card"]}>
        <span
          className={styles["flag-circle"]}
          style={
            isWinner || isWinner === undefined
              ? {
                  backgroundImage: `url(/1x1Flags/Country=${abbr}.png)`,
                }
              : {
                  backgroundImage: `url(/1x1Flags/Country=${abbr}.png)`,
                  opacity: "0.5",
                }

          }
        ></span>
        <div className={styles["country-text-container"]} style={isWinner || isWinner === undefined ? {} : {opacity: "0.5"}}>
          <p className={styles["country-name"]}>{countryName}</p>
          <p className={styles["country-rank"]}>({rank})</p>
        </div>
        {isWinner ? <Crown className={styles.crown}/> : !isWinner ? "" : ""}
      </div>
    </div>
  );
};

export default H2HPageCountryCard;