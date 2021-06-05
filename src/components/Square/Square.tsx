import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { useDrop } from "react-dnd";
import _ from "lodash";

import styles from "./Square.scss";
import BoardInfoContext from "../../contexts/BoardInfoContext";
import Piece from "../Piece";
import { PieceName, Side } from "../../sharedTypes";

type Props = {
  rankNumber: number;
  fileNumber: number;
  fileLetter: string;
  movePiece: (
    client: any,
    piece: PieceName,
    targetSquare: string,
    currentLocation: { rank: number; file: string },
    isTaking: boolean
  ) => void;
  isWhite: boolean;
  OAM?: string;
  automaticMove?: string;
  client: any;
  addMoveToList: (move: string) => void;
  setBoard: React.Dispatch<any>;
};

const isLightSquare = (rankNumber: number, fileNumber: number) => {
  if (rankNumber % 2 === 0) {
    return fileNumber % 2 !== 0;
  } else {
    return fileNumber % 2 === 0;
  }
};

type PieceInfo = null | {
  side: { name: Side };
  type: PieceName;
};

const isTargetOfOAM = (
  squareNotation: string,
  OAM: string,
  isWhite: boolean
) => {
  let OAMtarget;
  if (OAM === "0-0" && isWhite) {
    OAMtarget = "g1";
  } else if (OAM === "0-0" && !isWhite) {
    OAMtarget = "g8";
  } else if (OAM === "0-0-0" && isWhite) {
    OAMtarget = "c1";
  } else if (OAM === "0-0-0" && !isWhite) {
    OAMtarget = "c8";
  } else {
    OAMtarget = OAM.slice(OAM.length - 2);
  }
  return squareNotation === OAMtarget;
};

const pieceNameToNotation = {
  king: "K",
  queen: "Q",
  rook: "R",
  bishop: "B",
  knight: "N",
};

const isOAMPiece = (
  draggingPieceName: PieceName,
  previousSquare: { rank: number; file: string },
  OAM: string
) => {
  if (draggingPieceName === "king" && (OAM === "0-0" || OAM === "0-0-0")) {
    return true;
  }
  const splitOAM = OAM.split("");
  if (draggingPieceName === "pawn") {
    // eg. "dxe5"
    if (splitOAM.includes("x")) {
      const currentFile = previousSquare.file; // d
      const nextFile = splitOAM[2]; // e
      if (
        (String.fromCharCode(currentFile.charCodeAt(0) + 1) === nextFile ||
          String.fromCharCode(currentFile.charCodeAt(0) - 1) === nextFile) &&
        (splitOAM[3] === `${previousSquare.rank + 1}` ||
          splitOAM[3] === `${previousSquare.rank - 1}`) &&
        splitOAM[0] === previousSquare.file
      ) {
        return true;
      }
    }
    // eg. "e5"
    return (
      splitOAM[0] === previousSquare.file &&
      (splitOAM[1] === `${previousSquare.rank + 1}` ||
        splitOAM[1] === `${previousSquare.rank - 1}` ||
        splitOAM[1] === `${previousSquare.rank + 2}` ||
        splitOAM[1] === `${previousSquare.rank - 2}`)
    );
  }
  const draggingPieceNotation = pieceNameToNotation[draggingPieceName];
  const pieceFromOAM = splitOAM[0];
  // eg. Ngxf5, but not Ng3
  const OAMPieceLocationIndicator =
    splitOAM.filter((e) => e !== "x").length > 3 ? splitOAM[1] : null;
  if (OAMPieceLocationIndicator) {
    const pieceWithRank = `${draggingPieceNotation}${previousSquare.rank}`;
    const pieceWithFile = `${draggingPieceNotation}${previousSquare.file}`;
    const OAMPieceWithIndicator = `${pieceFromOAM}${OAMPieceLocationIndicator}`;
    return (
      pieceWithRank === OAMPieceWithIndicator ||
      pieceWithFile === OAMPieceWithIndicator
    );
  }
  return pieceFromOAM === draggingPieceNotation;
};

const canMove = (
  currentSquare: string,
  pieceName: PieceName,
  previousSquare: { rank: number; file: string },
  OAM: string,
  isWhite: boolean
) => {
  if (!OAM) {
    return true;
  }
  return (
    isTargetOfOAM(currentSquare, OAM, isWhite) &&
    isOAMPiece(pieceName, previousSquare, OAM)
  );
};

const Square = ({
  rankNumber,
  fileNumber,
  fileLetter,
  movePiece,
  OAM,
  isWhite,
  automaticMove,
  client,
  addMoveToList,
  setBoard,
}: Props) => {
  const squareNotation = `${fileLetter}${rankNumber}`;

  // First set of automatic moves are mapped to format "MOVE%PLAYER_COLOR"
  // to trigger rerenders in this component, even when two consecutive
  // automatic moves are the same (eg. 3. dxc5, dxc5)
  const automaticMoveNotation = automaticMove?.includes("%")
    ? automaticMove.split("%")[0]
    : automaticMove;

  const board = useContext(BoardInfoContext);
  const getPieceInfo = () => {
    return board.squares.find(
      (square) => square.file === fileLetter && square.rank === rankNumber
    ).piece;
  };
  const [pieceInfo, setPieceInfo] = useState<PieceInfo>(null);

  useLayoutEffect(() => {
    const newInfo = getPieceInfo();
    setPieceInfo(newInfo);
  }, [board]);

  useEffect(() => {
    if (
      automaticMoveNotation &&
      isTargetOfOAM(squareNotation, automaticMoveNotation, isWhite)
    ) {
      client.move(automaticMoveNotation);
      setBoard({ ...client.game.board });
      addMoveToList(automaticMoveNotation);
      setTimeout(() => {
        setPieceInfo(null);
        setPieceInfo(_.cloneDeep(getPieceInfo()));
      }, 100);
    }
  }, [automaticMove]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["king", "queen", "rook", "bishop", "knight", "pawn"],
      drop: (
        item: { pieceName: PieceName; square: { rank: number; file: string } },
        monitor
      ) => {
        const isTaking = !!getPieceInfo();
        if (
          canMove(squareNotation, item.pieceName, item.square, OAM, isWhite)
        ) {
          movePiece(
            client,
            item.pieceName,
            squareNotation,
            item.square,
            !!getPieceInfo()
          );
          if (isTaking) {
            // Hack: set to null first, so Piece rerenders
            setPieceInfo(null);
            setPieceInfo(getPieceInfo());
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [OAM, client, pieceInfo]
  );

  return (
    <div
      className={
        isLightSquare(rankNumber, fileNumber) ? styles.white : styles.black
      }
      ref={drop}
    >
      {pieceInfo && (
        <Piece
          pieceInfo={pieceInfo}
          location={{ rank: rankNumber, file: fileLetter }}
        />
      )}
      <div className={isOver ? styles.hoverCircle : ""} />
      <p className={styles.location}>{squareNotation}</p>
    </div>
  );
};

export default Square;
