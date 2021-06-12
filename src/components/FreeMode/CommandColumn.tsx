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
  resetBoard: () => void;
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
  resetBoard,
}: Props) => {
  const [titleInput, setTitleInput] = useState<string>("");
  const [variationInput, setVariationInput] = useState<string>("");
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
        <input
          onChange={(e) => setVariationInput(e.target.value)}
          value={variationInput}
          className={styles.titleInput}
          placeholder="Add a variation"
        />
      </div>
      <div>
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
          } else if (moves.length < 4) {
            setMessage("Please make at least 4 moves");
          } else if (titleInput.length <= 0) {
            setMessage("Please enter a title");
          } else if (moves.length <= 0) {
            setMessage("Please make some moves");
          } else {
            axios
              .post("http://localhost:3000/lines", {
                name: titleInput,
                variation: variationInput,
                playercolor: isWhite ? "white" : "black",
                moves: JSON.stringify(moves),
              })
              .then((res) => {
                console.log("RES: ", res);
                setMessage("Line added successfully");
                setTitleInput("");
                setReasonInput("");
                updateLinesFromDB();
                resetBoard();
              })
              .catch((e) => {
                setMessage("POST failure. Check console");
                console.log({ POSTFailure: e });
              });
          }
        }}
      />{" "}
      <Button
        text={isWhite ? "WHITE ↔" : "BLACK ↔"}
        onClick={() => setIsWhite(!isWhite)}
      ></Button>
      <Button
        text="RESET BOARD"
        onClick={() => {
          setTitleInput("");
          setReasonInput("");
          resetBoard();
        }}
      />
      <p className={styles.message}>
        {incomingMessage ? incomingMessage : message}
      </p>
    </div>
  );
};

export default CommandColumn;
