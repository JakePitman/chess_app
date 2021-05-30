import React, { useState, useEffect, useRef } from "react";
import chess from "chess";
import _ from "lodash";

import Board from "../Board";
import MovesList from "../MovesList";
import CommandColumn from "./CommandColumn";
import { Line, MovesListType } from "../../sharedTypes";
import styles from "./TestMode.scss";

type Props = {
  lines: Line[];
};

const TestMode = ({ lines }: Props) => {
  const gameClientRef = useRef(chess.create());
  const [gameClient, setGameClient] = useState();
  const [commandColumnMessage, setCommandColumnMessage] = useState("");
  const [currentLine, setCurrentLine] = useState<Line>(_.sample(lines));
  const [remainingAutomaticMoves, setRemainingAutomaticMoves] = useState<
    string[]
  >([]);
  // TODO: figure out when to run next move logic
  // wait for player if it's their move
  // make computer move if not...........
  // maybe set move to null, and delete turn when both moves are null:
  //  if (!isWhite && remainingMovesToMake[0][0] !== null) {movePiece()}
  const [remainingMovesToMake, setRemainingMovesToMake] =
    useState<MovesListType>([]);
  const [movesMade, setMovesMade] = useState<MovesListType>([]);

  const flattenMoves = (movesObjects: MovesListType) =>
    _.flattenDeep(
      movesObjects.map((turn) =>
        turn[1] ? [turn[0].notation, turn[1].notation] : [turn[0].notation]
      )
    );

  useEffect(() => {
    // Ensure no state changes trigger automatic moves on old client
    setGameClient(null);
    gameClientRef.current = chess.create();
    setMovesMade([]);
    // Gets a number between 0 & the number of moves (not inclusive)
    const startingPoint = Math.floor(
      Math.random() * (currentLine.moves.length - 1) + 1
    );
    setRemainingAutomaticMoves(
      flattenMoves(currentLine.moves.slice(0, startingPoint))
    );
    setRemainingMovesToMake(
      _.cloneDeep(
        currentLine.moves.slice(startingPoint, currentLine.moves.length)
      )
    );
  }, [currentLine]);

  useEffect(() => {
    setGameClient(gameClientRef.current);
  }, [gameClientRef.current]);

  if (remainingAutomaticMoves.length > 0) {
    setTimeout(() => {
      // Re-renders Board with next automatic move
      setRemainingAutomaticMoves([
        ...remainingAutomaticMoves.slice(1, remainingAutomaticMoves.length),
      ]);
    }, 200);
  }

  const addMoveToList = (move: string) => {
    setMovesMade((prevMoves) => {
      const lastTurn = prevMoves[prevMoves.length - 1];
      return lastTurn && lastTurn[0] && !lastTurn[1]
        ? [
            ...prevMoves.slice(0, prevMoves.length - 1),
            [lastTurn[0], { notation: move }],
          ]
        : [...prevMoves, [{ notation: move }]];
    });
  };

  const setRandomLine = () => {
    const otherLines = lines.filter(
      (line) =>
        flattenMoves(line.moves).toString() !==
        flattenMoves(currentLine.moves).toString()
    );
    setCurrentLine(_.sample(otherLines));
  };

  // Make an extra move for white at the end of automatic moves
  // when player is black, leaving it on black's turn to move
  useEffect(() => {
    if (
      remainingAutomaticMoves.length === 0 &&
      gameClient &&
      currentLine.playercolor === "black" &&
      remainingMovesToMake[0][0]
    ) {
      const moveForWhite = remainingMovesToMake[0][0];
      const remainingMovesDup = [...remainingMovesToMake];
      remainingMovesDup[0][0] = null;
      setRemainingMovesToMake(remainingMovesDup);
      setRemainingAutomaticMoves([moveForWhite.notation]);
    }
  }, [remainingAutomaticMoves.length]);

  const determineNewRemainingMovesToMake = () => {
    if (remainingMovesToMake[0][0]) {
      const dup = _.cloneDeep(remainingMovesToMake);
      dup[0][0] = null;
      return dup;
    }
    return remainingMovesToMake.slice(1, remainingMovesToMake.length);
  };

  return gameClient ? (
    <div className={styles.container}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <MovesList turns={movesMade}></MovesList>
        </div>
        <Board
          automaticMoves={remainingAutomaticMoves}
          client={gameClient}
          isWhite={currentLine.playercolor === "white"}
          setCommandColumnMessage={setCommandColumnMessage}
          addMoveToList={addMoveToList}
          OAM={
            currentLine.playercolor === "white"
              ? remainingMovesToMake[0][0]
              : remainingMovesToMake[0][1]
          }
          updateRemainingMoves={() =>
            setRemainingMovesToMake(determineNewRemainingMovesToMake())
          }
        />
        <div className={styles.sideColumn}>
          <CommandColumn setRandomLine={setRandomLine} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TestMode;
