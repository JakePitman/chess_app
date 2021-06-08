import React, { Dispatch, SetStateAction } from "react";
import { PieceName, MovesListType } from "../sharedTypes";

const pieceNameToNotation = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
};

const movePiece = (
  makeMove: (moveNotation: string, prevSquare: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  setBoard: Dispatch<React.SetStateAction<string>>
) => {
  return (
    gameClient: any,
    piece: PieceName,
    targetSquare: string,
    currentLocation: { rank: number; file: string },
    isTaking: boolean
  ) => {
    const { rank, file } = currentLocation;
    const currentLocationNotation = `${file}${rank}`;
    targetSquare = isTaking ? "x" + targetSquare : targetSquare;
    try {
      if (piece === "pawn") {
        const move = isTaking ? file + targetSquare : targetSquare;
        makeMove(move, currentLocationNotation);
      } else if (piece === "king") {
        const moveNotation = "K" + targetSquare;
        try {
          makeMove(moveNotation, currentLocationNotation);
        } catch {
          if (targetSquare === "g1" || targetSquare === "g8") {
            const moveNotation = "0-0";
            makeMove(moveNotation, currentLocationNotation);
          } else if (targetSquare === "c1" || targetSquare === "c8") {
            const moveNotation = "0-0-0";
            makeMove(moveNotation, currentLocationNotation);
          } else {
            throw Error("Invalid King move");
          }
        }
      } else {
        const pieceNotation = pieceNameToNotation[piece];
        const moveNotation = pieceNotation + targetSquare;
        try {
          makeMove(moveNotation, currentLocationNotation);
          // Passing rank & file together isn't supported (eg. Nb1C3)
        } catch (e) {
          try {
            const moveNotation = pieceNotation + file + targetSquare;
            makeMove(moveNotation, currentLocationNotation);
          } catch (e) {
            const moveNotation = pieceNotation + rank + targetSquare;
            makeMove(moveNotation, currentLocationNotation);
          }
        }
      }
      setCommandColumnMessage && setCommandColumnMessage("");
    } catch {
      setCommandColumnMessage && setCommandColumnMessage("Invalid move");
    }
    setBoard({ ...gameClient.game.board });
  };
};

export default movePiece;
