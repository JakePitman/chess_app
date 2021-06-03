import React, { useState } from "react";
import chess from "chess";
import axios from "axios";

import styles from "./ListMode.scss";
import { Line, MovesListType } from "../../sharedTypes";
import Board from "../Board";
import MovesList from "../MovesList";

type LineProps = {
  title: string;
  selected: boolean;
  id: number;
  updateLinesFromDB: () => void;
};

const LineRow = ({ title, selected, id, updateLinesFromDB }: LineProps) => {
  return (
    <div className={styles.lineRow}>
      <div
        className={styles.checkbox + ` ${selected && styles.selected}`}
        onClick={() =>
          axios
            .put("http://localhost:3000/line", {
              name: title,
              selected: !selected,
            })
            .then((res) => {
              console.log({ res });
              updateLinesFromDB();
            })
            .catch((err) => console.log({ err }))
        }
      />
      <p className={styles.lineTitle}>{title}</p>
      <p
        className={styles.deleteButton}
        onClick={() =>
          axios
            .delete(`http://localhost:3000/line/${id}`)
            .then((res) => {
              console.log({ res });
              updateLinesFromDB();
            })
            .catch((err) => console.log({ err }))
        }
      >
        x
      </p>
    </div>
  );
};

type Props = {
  lines: Line[];
  updateLinesFromDB: () => void;
};

const ListMode = ({ lines, updateLinesFromDB }: Props) => {
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
            <LineRow
              title={line.name}
              selected={line.selected}
              id={line.id}
              updateLinesFromDB={updateLinesFromDB}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListMode;
