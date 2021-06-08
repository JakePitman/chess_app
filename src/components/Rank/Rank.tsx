import React from "react";

import Square from "../Square";
import styles from "./Rank.scss";
import PieceName from "../../sharedTypes/PieceName";
import { Move } from "../../sharedTypes";

type Props = {
  rankNumber: number;
  movePiece: (
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
  hintActive: boolean;
};

const FILE_LETTERS = {
  "1": "a",
  "2": "b",
  "3": "c",
  "4": "d",
  "5": "e",
  "6": "f",
  "7": "g",
  "8": "h",
};

const Rank = ({
  rankNumber,
  movePiece,
  isWhite,
  OAM,
  automaticMove,
  client,
  addMoveToList,
  setBoard,
  hintActive,
}: Props) => {
  return (
    <div className={styles.mainContainer}>
      {(isWhite ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]).map(
        (fileNumber) => {
          const fileLetter = FILE_LETTERS[fileNumber];
          return (
            <Square
              rankNumber={rankNumber}
              fileNumber={fileNumber}
              fileLetter={fileLetter}
              movePiece={movePiece}
              key={`square-${fileLetter}${rankNumber}`}
              isWhite={isWhite}
              OAM={OAM}
              automaticMove={automaticMove}
              client={client}
              addMoveToList={addMoveToList}
              setBoard={setBoard}
              hintActive={hintActive}
            />
          );
        }
      )}
    </div>
  );
};

export default Rank;
