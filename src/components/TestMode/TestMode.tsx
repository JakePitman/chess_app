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
  const [remainingMovesToMake, setRemainingMovesToMake] =
    useState<MovesListType>([]);
  const [movesMade, setMovesMade] = useState<MovesListType>([]);
  const [automaticMovesCompleted, setAutomaticMovesCompleted] =
    useState<boolean>(false);
  const [startingPoint, setStartingPoint] =
    useState<number | "random">("random");
  const [hintActive, setHintActive] = useState<boolean>(false);

  const flattenMoves = (movesObjects: MovesListType) =>
    _.flattenDeep(
      movesObjects.map((turn) =>
        turn[1] ? [turn[0].notation, turn[1].notation] : [turn[0].notation]
      )
    );

  useEffect(() => {
    if (
      automaticMovesCompleted &&
      remainingMovesToMake.length <= 1 &&
      remainingMovesToMake[0][0] == null
    ) {
      setRandomLine();
    }
  }, [remainingMovesToMake]);

  useEffect(() => {
    // Ensure no state changes trigger automatic moves on old client
    setGameClient(null);
    gameClientRef.current = chess.create();
    setMovesMade([]);
    // Gets a number between 0 & one less than the number of moves (not inclusive)
    const randomStartingPoint = Math.floor(
      Math.random() * (currentLine.moves.length - 2) + 1
    );
    const chosenStartingPoint =
      startingPoint === "random" ? randomStartingPoint : startingPoint;
    setRemainingAutomaticMoves(
      flattenMoves(currentLine.moves.slice(0, chosenStartingPoint)).map(
        (move, i) => {
          const playercolor = i % 2 === 0 ? "white" : "black";
          // Attach player color to move in case of consecutive repeated notation,
          //   eg. 3. cxd5, cxd5 from the Slav exchange variation
          // "cxd5" -> "cxd5" won't rerender, but "cxd5%white" -> "cxd5%black" will.
          return `${move}%${playercolor}`;
        }
      )
    );
    setRemainingMovesToMake(
      _.cloneDeep(
        currentLine.moves.slice(chosenStartingPoint, currentLine.moves.length)
      )
    );
    setAutomaticMovesCompleted(false);
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
    if (otherLines.length === 0) {
      setCurrentLine(_.cloneDeep(currentLine));
    } else {
      setCurrentLine(_.sample(otherLines));
    }
  };

  useEffect(() => {
    // Happens when an automatic move is completed in response to an automatic
    //    move made in response to a player move
    if (automaticMovesCompleted && remainingAutomaticMoves.length === 0) {
      setRemainingMovesToMake(determineNewRemainingMovesToMake());
    }
    if (
      remainingAutomaticMoves.length === 0 &&
      gameClient &&
      !automaticMovesCompleted
    ) {
      // Make an extra move for white at the end of automatic moves
      // when player is black, leaving it on black's turn to move
      if (currentLine.playercolor === "black" && remainingMovesToMake[0][0]) {
        const moveForWhite = remainingMovesToMake[0][0];
        setRemainingAutomaticMoves([moveForWhite.notation]);
      }
      setAutomaticMovesCompleted(true);
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

  const addRemainingMoveToMakeToAutomaticMoves = () => {
    if (remainingMovesToMake.length <= 0) {
      return;
    }
    if (currentLine.playercolor === "white") {
      remainingMovesToMake[0][1] &&
        setTimeout(
          () =>
            setRemainingAutomaticMoves([remainingMovesToMake[0][1].notation]),
          200
        );
    } else {
      remainingMovesToMake[1] &&
        setTimeout(
          () =>
            setRemainingAutomaticMoves([remainingMovesToMake[1][0].notation]),
          200
        );
    }
  };

  const lowestLineLength = () =>
    lines.reduce((lowestLength, currentLine) => {
      const currentLength = currentLine.moves.length;
      return currentLength < lowestLength ? currentLength : lowestLength;
    }, lines[0].moves.length);

  const OAM = remainingMovesToMake[0]
    ? currentLine.playercolor === "white"
      ? remainingMovesToMake[0][0]
      : remainingMovesToMake[0][1]
    : null;

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
          OAM={OAM}
          updateRemainingMoves={() =>
            remainingMovesToMake &&
            setRemainingMovesToMake(determineNewRemainingMovesToMake())
          }
          addRemainingMoveToMakeToAutomaticMoves={
            addRemainingMoveToMakeToAutomaticMoves
          }
          hintActive={hintActive}
          setHintActive={setHintActive}
        />
        <div className={styles.sideColumn}>
          <CommandColumn
            setRandomLine={setRandomLine}
            lineTitle={currentLine.name}
            startingPoint={startingPoint}
            setStartingPoint={setStartingPoint}
            maximumStartingPoint={lowestLineLength() - 2}
            giveHint={() => setHintActive(true)}
            OAM={OAM}
            hintActive={hintActive}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TestMode;
