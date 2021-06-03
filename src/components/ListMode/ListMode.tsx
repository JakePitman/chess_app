import React, { useState } from "react";
import chess from "chess";
import axios from "axios";

import styles from "./ListMode.scss";
import { Line, MovesListType } from "../../sharedTypes";
import Board from "../Board";
import MovesList from "../MovesList";

const handlePUT = (
  title: string,
  selected: boolean,
  updateLinesFromDB: () => void
) => {
  axios
    .put("http://localhost:3000/line", {
      name: title,
      selected: !selected,
    })
    .then((res) => {
      console.log({ res });
      updateLinesFromDB();
    })
    .catch((err) => console.log({ err }));
};

const handleDELETE = (id: number, updateLinesFromDB: () => void) => {
  axios
    .delete(`http://localhost:3000/line/${id}`)
    .then((res) => {
      console.log({ res });
      updateLinesFromDB();
    })
    .catch((err) => console.log({ err }));
};

type LineRowProps = {
  title: string;
  selected: boolean;
  id: number;
  updateLinesFromDB: () => void;
  isWhiteLine: boolean;
};

const LineRow = ({
  title,
  selected,
  id,
  updateLinesFromDB,
  isWhiteLine,
}: LineRowProps) => {
  return (
    <div
      className={
        styles.lineRow + ` ${isWhiteLine ? styles.whiteRow : styles.blackRow}`
      }
    >
      <div
        className={styles.checkbox + ` ${selected && styles.selected}`}
        onClick={() => handlePUT(title, selected, updateLinesFromDB)}
      />
      <p className={styles.lineTitle}>{title}</p>
      <p
        className={styles.deleteButton}
        onClick={() => handleDELETE(id, updateLinesFromDB)}
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
          <div className={styles.rowGroupSeparator} />
          {lines.map((line) => {
            return (
              line.playercolor === "white" && (
                <LineRow
                  title={line.name}
                  selected={line.selected}
                  id={line.id}
                  updateLinesFromDB={updateLinesFromDB}
                  isWhiteLine
                />
              )
            );
          })}
          <div className={styles.rowGroupSeparator} />
          {lines.map((line) => {
            return (
              line.playercolor === "black" && (
                <LineRow
                  title={line.name}
                  selected={line.selected}
                  id={line.id}
                  updateLinesFromDB={updateLinesFromDB}
                  isWhiteLine={false}
                />
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListMode;
