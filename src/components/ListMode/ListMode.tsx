import React, { useState } from "react";
import chess from "chess";

import styles from "./ListMode.scss";
import { Line, MovesListType } from "../../sharedTypes";
import Board from "../Board";
import MovesList from "../MovesList";

type LineProps = {
  title: string;
  selected: boolean;
};

const LineRow = ({ title, selected }: LineProps) => {
  return (
    <div className={styles.lineRow}>
      <p className={styles.lineTitle}>{title}</p>;
      <div
        className={styles.checkbox + ` ${selected && styles.selected}`}
      ></div>
    </div>
  );
};

type Props = {
  lines: Line[];
};

const ListMode = ({ lines }: Props) => {
  const [gameClient, setGameClient] = useState(chess.create());
  const [moves, setMoves] = useState<MovesListType>([]);
  const addMoveToList = (move: string) => {
    setMoves((prevMoves) => {
      const lastTurn = prevMoves[prevMoves.length - 1];
      return lastTurn && lastTurn[0] && !lastTurn[1]
        ? [
            ...prevMoves.slice(0, prevMoves.length - 1),
            [lastTurn[0], { notation: move }],
          ]
        : [...prevMoves, [{ notation: move }]];
    });
  };
  return (
    <div className={styles.appContainer}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <MovesList turns={moves}></MovesList>
        </div>
        <Board client={gameClient} isWhite addMoveToList={addMoveToList} />
        <div className={styles.sideColumn}>
          <p className={styles.title}>Lines</p>
          {lines.map((line) => (
            <LineRow title={line.name} selected={line.selected} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListMode;
