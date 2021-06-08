import React, { useState, SetStateAction, Dispatch } from "react";

import styles from "./CommandColumn.scss";
import Button from "../Button";
import { Move } from "../../sharedTypes";

const StartingPointMenuOption = ({
  value,
  setStartingPoint,
  closeMenu,
  isSelected,
}: {
  value: number | "random";
  setStartingPoint: Dispatch<SetStateAction<number | "random">>;
  closeMenu: () => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={
        styles.startingPointMenuOption +
        ` ${isSelected && styles.selectedStartingPointOption}`
      }
      onClick={() => {
        setStartingPoint(value);
        closeMenu();
      }}
    >
      {value}
    </div>
  );
};

const StartingPointMenu = ({
  maximumStartingPoint,
  setStartingPoint,
  closeMenu,
  currentStartingPoint,
}: {
  maximumStartingPoint: number;
  setStartingPoint: Dispatch<SetStateAction<number | "random">>;
  closeMenu: () => void;
  currentStartingPoint: number | "random";
}) => {
  const toMaximumStartingPoint = Array.from(
    { length: maximumStartingPoint },
    (_, i) => i + 1
  );
  return (
    <div className={styles.startingPointMenuContainer}>
      {toMaximumStartingPoint.map((e, i) => (
        <StartingPointMenuOption
          value={i + 1}
          setStartingPoint={setStartingPoint}
          closeMenu={closeMenu}
          isSelected={currentStartingPoint === i + 1}
          key={i + 1}
        />
      ))}
      <StartingPointMenuOption
        value={"random"}
        setStartingPoint={setStartingPoint}
        closeMenu={closeMenu}
        isSelected={currentStartingPoint === "random"}
        key={"random"}
      />
    </div>
  );
};

type Props = {
  setRandomLine: () => void;
  lineTitle: string;
  startingPoint: number | "random";
  setStartingPoint: Dispatch<SetStateAction<number | "random">>;
  maximumStartingPoint: number;
  giveHint: () => void;
  OAM: Move | null;
  hintActive: boolean;
};

const CommandColumn = ({
  setRandomLine,
  lineTitle,
  startingPoint,
  setStartingPoint,
  maximumStartingPoint,
  giveHint,
  OAM,
  hintActive,
}: Props) => {
  const [message, setMessage] = useState<string>("");
  const [startingPointPopupActive, setStartingPointPopupActive] =
    useState<boolean>(false);

  return (
    <div className={styles.container}>
      {startingPointPopupActive ? (
        <StartingPointMenu
          maximumStartingPoint={maximumStartingPoint}
          setStartingPoint={setStartingPoint}
          closeMenu={() => setStartingPointPopupActive(false)}
          currentStartingPoint={startingPoint}
        />
      ) : (
        <>
          <p className={styles.inputHeader}>{lineTitle}</p>
          <Button text="New line" onClick={setRandomLine} />
          <Button
            text={`Starting point: ${startingPoint}`}
            onClick={() => {
              setStartingPointPopupActive(true);
            }}
          />
          <Button text="Hint" onClick={giveHint} />
          <div className={styles.message}>
            {/* {OAM && hintActive ? OAM.reason : message} */}
            {OAM && hintActive ? (
              OAM.reason.split("\n").map((reason) => <p>‣ {reason}</p>)
            ) : (
              <p>{message}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommandColumn;
