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
  gameClient: any,
  makeMove: (moveNotation: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  setBoard: Dispatch<React.SetStateAction<string>>
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
        makeMove(move);
      } else if (piece === "king") {
        const moveNotation = "K" + targetSquare;
        try {
          makeMove(moveNotation);
        } catch {
          if (targetSquare === "g1" || targetSquare === "g8") {
            const moveNotation = "0-0";
            makeMove(moveNotation);
          } else if (targetSquare === "c1" || targetSquare === "c8") {
            const moveNotation = "0-0-0";
            makeMove(moveNotation);
          } else {
            throw Error("Invalid King move");
          }
        }
      } else {
        const pieceNotation = pieceNameToNotation[piece];
        const moveNotation = pieceNotation + targetSquare;
        try {
          makeMove(moveNotation);
          // Passing rank & file together isn't supported (eg. Nb1C3)
        } catch (e) {
          try {
            const moveNotation = pieceNotation + file + targetSquare;
            makeMove(moveNotation);
          } catch (e) {
            const moveNotation = pieceNotation + rank + targetSquare;
            makeMove(moveNotation);
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
