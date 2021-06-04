import React, { useState, SetStateAction, Dispatch } from "react";
import axios from "axios";

import { Move, MovesListType } from "../../sharedTypes";
import styles from "./CommandColumn.scss";
import Button from "../Button";

type Props = {
  setReasonInput: Dispatch<SetStateAction<string>>;
  reasonInput: string;
  addReasonToMove: () => void;
  moves: MovesListType;
  incomingMessage: string;
  isWhite: boolean;
  setIsWhite: Dispatch<SetStateAction<boolean>>;
  returnToMenu: () => void;
  updateLinesFromDB: () => void;
};

const CommandColumn = ({
  setReasonInput,
  reasonInput,
  addReasonToMove,
  moves,
  incomingMessage,
  isWhite,
  setIsWhite,
  returnToMenu,
  updateLinesFromDB,
}: Props) => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.titleHeader}>Title</p>
        <input
          onChange={(e) => setTitleInput(e.target.value)}
          value={titleInput}
          className={styles.titleInput}
          placeholder="Add a title"
        />
      </div>
      <Button
        text={isWhite ? "WHITE ↔" : "BLACK ↔"}
        onClick={() => setIsWhite(!isWhite)}
      ></Button>
      <div>
        {/* <p className={styles.reasonHeader}>Add reason to last move</p> */}
        <Button
          text="Add reason to last move"
          onClick={() => {
            if (moves.length <= 0) {
              setMessage("No moves made yet");
              setReasonInput("");
            } else {
              addReasonToMove();
            }
          }}
        ></Button>
        <textarea
          className={styles.reasonInput}
          onChange={(e) => setReasonInput(e.target.value)}
          value={reasonInput}
          placeholder="Enter reason here"
        />
      </div>
      <Button
        text="SAVE MOVES"
        onClick={() => {
          const lastMoveWasBlack = !!moves[moves.length - 1][1];
          if (isWhite && lastMoveWasBlack) {
            setMessage("Please finish on a white move");
          } else if (!isWhite && !lastMoveWasBlack) {
            setMessage("Please finish on a black move");
          } else if (titleInput.length <= 0) {
            setMessage("Please enter a title");
          } else if (moves.length <= 0) {
            setMessage("Please make some moves");
          } else {
            axios
              .post("http://localhost:3000/lines", {
                name: titleInput,
                playercolor: isWhite ? "white" : "black",
                moves: JSON.stringify(moves),
              })
              .then((res) => {
                console.log("RES: ", res);
                setMessage("Line added successfully");
                updateLinesFromDB();
                setTimeout(() => returnToMenu(), 500);
              })
              .catch((e) => {
                setMessage("POST failure. Check console");
                console.log({ POSTFailure: e });
              });
          }
        }}
      />
      <p className={styles.message}>
        {incomingMessage ? incomingMessage : message}
      </p>
    </div>
  );
};

export default CommandColumn;
