import React, { Dispatch, SetStateAction } from "react";
import { PieceName, MovesListType } from "../sharedTypes";

const pieceNameToNotation = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
};

// Checks if there is an available move, and only moves if it matches
// Can raise an error in cases such as King movement, where notation
//   may fail & need to be tried again
const moveIfAvailable = (
  move: string,
  onlyAcceptableMove: string,
  makeMove: (move: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  updateRemainingMovesToMake: () => void,
  shouldRaiseError: boolean = false
) => {
  // Test mode
  if (onlyAcceptableMove) {
    if (onlyAcceptableMove === move) {
      makeMove(move);
      updateRemainingMovesToMake();
    } else {
      setCommandColumnMessage("Wrong move!");
    }
    if (shouldRaiseError) {
      throw Error;
    }
    // Free mode
  } else {
    makeMove(move);
  }
};

const movePiece = (
  gameClient: any,
  makeMove: (moveNotation: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  setBoard: Dispatch<React.SetStateAction<string>>,
  updateRemainingMovesToMake: () => void,
  onlyAcceptableMove?: string
) => {
  return (
    piece: PieceName,
    targetSquare: string,
    currentLocation: { rank: number; file: string },
    isTaking: boolean
  ) => {
    const { rank, file } = currentLocation;
    targetSquare = isTaking ? "x" + targetSquare : targetSquare;
    try {
      if (piece === "pawn") {
        const move = isTaking ? file + targetSquare : targetSquare;
        moveIfAvailable(
          move,
          onlyAcceptableMove,
          makeMove,
          setCommandColumnMessage,
          updateRemainingMovesToMake
        );
      } else if (piece === "king") {
        const moveNotation = "K" + targetSquare;
        try {
          moveIfAvailable(
            moveNotation,
            onlyAcceptableMove,
            makeMove,
            setCommandColumnMessage,
            updateRemainingMovesToMake,
            true
          );
        } catch {
          if (targetSquare === "g1" || targetSquare === "g8") {
            const moveNotation = "0-0";
            moveIfAvailable(
              moveNotation,
              onlyAcceptableMove,
              makeMove,
              setCommandColumnMessage,
              updateRemainingMovesToMake,
              true
            );
          } else if (targetSquare === "c1" || targetSquare === "c8") {
            const moveNotation = "0-0-0";
            moveIfAvailable(
              moveNotation,
              onlyAcceptableMove,
              makeMove,
              setCommandColumnMessage,
              updateRemainingMovesToMake
            );
          } else {
            throw Error("Invalid King move");
          }
        }
      } else {
        const pieceNotation = pieceNameToNotation[piece];
        const moveNotation = pieceNotation + targetSquare;
        try {
          moveIfAvailable(
            moveNotation,
            onlyAcceptableMove,
            makeMove,
            setCommandColumnMessage,
            updateRemainingMovesToMake,
            true
          );
          // Passing rank & file together isn't supported (eg. Nb1C3)
        } catch (e) {
          try {
            const moveNotation = pieceNotation + file + targetSquare;
            moveIfAvailable(
              moveNotation,
              onlyAcceptableMove,
              makeMove,
              setCommandColumnMessage,
              updateRemainingMovesToMake,
              true
            );
          } catch (e) {
            const moveNotation = pieceNotation + rank + targetSquare;
            moveIfAvailable(
              moveNotation,
              onlyAcceptableMove,
              makeMove,
              setCommandColumnMessage,
              updateRemainingMovesToMake
            );
          }
        }
      }
      setCommandColumnMessage("");
    } catch {
      setCommandColumnMessage("Invalid move");
    }
    setBoard({ ...gameClient.game.board });
  };
};

export default movePiece;
