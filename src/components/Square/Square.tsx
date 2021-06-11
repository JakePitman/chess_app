import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { useDrop } from "react-dnd";
import _ from "lodash";

import styles from "./Square.scss";
import BoardInfoContext from "../../contexts/BoardInfoContext";
import Piece from "../Piece";
import { PieceName, Side, Move, HintLevel } from "../../sharedTypes";

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
  OAM?: Move;
  automaticMove?: string;
  client: any;
  addMoveToList: (move: string) => void;
  setBoard: React.Dispatch<any>;
  hintLevel: HintLevel;
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

const isTargetOfOAM = (squareNotation: string, OAM: Move, isWhite: boolean) => {
  let OAMtarget;
  if (OAM?.notation === "0-0" && isWhite) {
    OAMtarget = "g1";
  } else if (OAM?.notation === "0-0" && !isWhite) {
    OAMtarget = "g8";
  } else if (OAM?.notation === "0-0-0" && isWhite) {
    OAMtarget = "c1";
  } else if (OAM?.notation === "0-0-0" && !isWhite) {
    OAMtarget = "c8";
  } else {
    OAMtarget = OAM?.notation.slice(OAM?.notation.length - 2);
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
  previousSquare: { rank: number; file: string },
  OAM: Move
) => {
  const prevSquareNotation = `${previousSquare.file}${previousSquare.rank}`;
  return prevSquareNotation === OAM.prevSquare;
};

const canMove = (
  currentSquare: string,
  previousSquare: { rank: number; file: string },
  OAM: Move,
  isWhite: boolean
) => {
  if (!OAM) {
    return true;
  }
  return (
    isTargetOfOAM(currentSquare, OAM, isWhite) &&
    isOAMPiece(previousSquare, OAM)
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
  hintLevel,
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
      isTargetOfOAM(
        squareNotation,
        { notation: automaticMoveNotation, prevSquare: "" },
        isWhite
      )
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
        if (canMove(squareNotation, item.square, OAM, isWhite)) {
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

  const squareColor = () => {
    if (hintLevel > 0 && squareNotation === OAM.prevSquare) {
      return styles.hintSquare;
    } else if (hintLevel > 1 && isTargetOfOAM(squareNotation, OAM, isWhite)) {
      return styles.answerSquare;
    } else {
      return isLightSquare(rankNumber, fileNumber)
        ? styles.white
        : styles.black;
    }
  };

  return (
    <div className={squareColor()} ref={drop}>
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
