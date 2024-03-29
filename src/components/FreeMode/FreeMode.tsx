import React, { useState } from "react";
import chess from "chess";

import Board from "../Board";
import MovesList from "../MovesList";
import CommandColumn from "./CommandColumn";
import styles from "./FreeMode.scss";
import { MovesListType } from "../../sharedTypes";

type Props = {
  returnToMenu: () => void;
  updateLinesFromDB: () => void;
};

const FreeMode = ({ returnToMenu, updateLinesFromDB }: Props) => {
  const [gameClient, setGameClient] = useState<any>(chess.create());
  const [reasonInput, setReasonInput] = useState("");
  const [moves, setMoves] = useState<MovesListType>([]);
  const [commandColumnMessage, setCommandColumnMessage] =
    useState<string>(null);
  const [isWhite, setIsWhite] = useState<boolean>(true);

  const resetBoard = () => {
    setMoves([]);
    setGameClient(chess.create());
  };

  const addMoveToList = (move: string, prevSquare: string) => {
    setMoves((prevMoves) => {
      const lastTurn = prevMoves[prevMoves.length - 1];
      return lastTurn && lastTurn[0] && !lastTurn[1]
        ? [
            ...prevMoves.slice(0, prevMoves.length - 1),
            [lastTurn[0], { notation: move, prevSquare: prevSquare }],
          ]
        : [...prevMoves, [{ notation: move, prevSquare: prevSquare }]];
    });
  };

  const addReasonToMove = () => {
    moves.length > 0 &&
      setMoves((prevMoves) => {
        const lastTurn = prevMoves[prevMoves.length - 1];
        const lastMoveDup = { ...lastTurn[lastTurn.length - 1] };
        lastMoveDup.reason = reasonInput;
        return [
          ...prevMoves.slice(0, prevMoves.length - 1),
          [...lastTurn.slice(0, lastTurn.length - 1), lastMoveDup],
        ];
      });
    setReasonInput("");
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <MovesList turns={moves}></MovesList>
        </div>
        <Board
          client={gameClient}
          isWhite={isWhite}
          setCommandColumnMessage={setCommandColumnMessage}
          addMoveToList={addMoveToList}
        ></Board>
        <div className={styles.sideColumn}>
          <CommandColumn
            setReasonInput={setReasonInput}
            reasonInput={reasonInput}
            addReasonToMove={addReasonToMove}
            moves={moves}
            incomingMessage={commandColumnMessage}
            isWhite={isWhite}
            setIsWhite={setIsWhite}
            returnToMenu={returnToMenu}
            updateLinesFromDB={updateLinesFromDB}
            resetBoard={resetBoard}
          />
        </div>
      </div>
    </div>
  );
};

export default FreeMode;
