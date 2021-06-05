import React, { useState } from "react";
import chess from "chess";
import axios from "axios";
import _ from "lodash";

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

const renderRows = (
  lines: Line[],
  filterColor: "white" | "black",
  selectedFilter: "all" | "selected" | "deselected",
  updateLinesFromDB: () => void
) => {
  return (
    <>
      <div className={styles.rowGroupSeparator} />
      {lines.map((line) => {
        return line.playercolor === filterColor &&
          (selectedFilter === "all" ||
            (selectedFilter === "selected" && line.selected) ||
            (selectedFilter === "deselected" && !line.selected)) ? (
          <LineRow
            title={line.name}
            selected={line.selected}
            id={line.id}
            updateLinesFromDB={updateLinesFromDB}
            isWhiteLine={line.playercolor === "white"}
          />
        ) : null;
      })}
    </>
  );
};

type SelectedFilterSliderOptionProps = {
  text: string;
  isActive: boolean;
  onClick: () => void;
};

const SelectedFilterSliderOption = ({
  text,
  isActive,
  onClick,
}: SelectedFilterSliderOptionProps) => {
  return (
    <div className={styles.controlSlider}>
      <div
        className={
          styles.controlSliderOption +
          ` ${isActive && styles.activeSliderOption}`
        }
        onClick={onClick}
      >
        {text}
      </div>
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
  const [selectedFilter, setSelectedFilter] =
    useState<"all" | "selected" | "deselected">("all");
  const [isWhite, setIsWhite] = useState<boolean>(true);

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

  const flattenMoves = (movesObjects: MovesListType) =>
    _.flattenDeep(
      movesObjects.map((turn) =>
        turn[1] ? [turn[0].notation, turn[1].notation] : [turn[0].notation]
      )
    );

  const flattenedMovesMade = flattenMoves(moves).toString();
  const linesFilteredByMovesMade =
    moves.length > 0
      ? lines.filter((line) => {
          const currentLineFlattened = flattenMoves(line.moves).toString();
          return (
            currentLineFlattened.slice(0, flattenedMovesMade.length) ===
            flattenedMovesMade
          );
        })
      : null;

  return (
    <div className={styles.appContainer}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <MovesList turns={moves}></MovesList>
        </div>
        <Board
          client={gameClient}
          isWhite={isWhite}
          addMoveToList={addMoveToList}
        />
        <div className={styles.sideColumn}>
          <p className={styles.sideColumnTitle}>Lines</p>
          <div className={styles.sideColumnContent}>
            <div className={styles.lineRowsContainer}>
              {renderRows(
                linesFilteredByMovesMade ? linesFilteredByMovesMade : lines,
                "white",
                selectedFilter,
                updateLinesFromDB
              )}
              {renderRows(
                linesFilteredByMovesMade ? linesFilteredByMovesMade : lines,
                "black",
                selectedFilter,
                updateLinesFromDB
              )}
            </div>
            <div className={styles.controls}>
              <div
                className={styles.controlButton}
                onClick={() => setIsWhite(!isWhite)}
              >
                {isWhite ? "White" : "Black"} ↔
              </div>
              <div
                className={styles.controlButton}
                onClick={() => {
                  setMoves([]);
                  setGameClient(chess.create());
                }}
              >
                Reset
              </div>
              <SelectedFilterSliderOption
                text="All"
                isActive={selectedFilter === "all"}
                onClick={() => {
                  setSelectedFilter("all");
                }}
              />
              <SelectedFilterSliderOption
                text="Selected"
                isActive={selectedFilter === "selected"}
                onClick={() => {
                  setSelectedFilter("selected");
                }}
              />
              <SelectedFilterSliderOption
                text="Deselected"
                isActive={selectedFilter === "deselected"}
                onClick={() => {
                  setSelectedFilter("deselected");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMode;
