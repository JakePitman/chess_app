import React, { useState, SetStateAction, Dispatch } from "react";

import styles from "./CommandColumn.scss";
import Button from "../Button";
import { Move, HintLevel } from "../../sharedTypes";

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
  lineVariation: string;
  startingPoint: number | "random";
  setStartingPoint: Dispatch<SetStateAction<number | "random">>;
  maximumStartingPoint: number;
  giveHint: () => void;
  giveAnswer: () => void;
  OAM: Move | null;
  hintLevel: HintLevel;
};

const CommandColumn = ({
  setRandomLine,
  lineTitle,
  lineVariation,
  startingPoint,
  setStartingPoint,
  maximumStartingPoint,
  giveHint,
  giveAnswer,
  OAM,
  hintLevel,
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
          <div className={styles.titleTextContainer}>
            <p className={styles.lineTitle}>{lineTitle}</p>
            <p className={styles.lineVariation}>{lineVariation}</p>
          </div>
          <Button text="New line" onClick={setRandomLine} />
          <Button
            text={`Starting point: ${startingPoint}`}
            onClick={() => {
              setStartingPointPopupActive(true);
            }}
          />
          {hintLevel === 0 ? (
            <Button text="Hint" onClick={giveHint} />
          ) : (
            <Button text="Answer" onClick={giveAnswer} />
          )}
          <div className={styles.message}>
            {OAM?.reason && hintLevel > 0 ? (
              OAM.reason
                .split("\n")
                .map((reason) => <p key={reason}>‣ {reason}</p>)
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
