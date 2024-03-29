import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import styles from "./Board.scss";
import Rank from "../Rank";
import { BoardInfoProvider } from "../../contexts/BoardInfoContext";
import movePieceFactory from "../../helpers/movePiece";
import { Move, HintLevel } from "../../sharedTypes";

type Props = {
  automaticMoves?: string[];
  client: any;
  isWhite: boolean;
  setCommandColumnMessage?: Dispatch<SetStateAction<string>>;
  addMoveToList: (move: string, prevSquare: string) => void;
  OAM?: Move;
  updateRemainingMoves?: () => void;
  addRemainingMoveToMakeToAutomaticMoves?: () => void;
  setHintLevel?: Dispatch<SetStateAction<HintLevel>>;
  hintLevel?: HintLevel;
};

const Board = ({
  automaticMoves,
  client,
  isWhite,
  setCommandColumnMessage,
  addMoveToList,
  OAM,
  updateRemainingMoves,
  addRemainingMoveToMakeToAutomaticMoves,
  setHintLevel,
  hintLevel = 0,
}: Props) => {
  const [board, setBoard] = useState(client.game.board);

  useEffect(() => {
    setBoard(client.game.board);
  }, [client]);

  const movePiece = movePieceFactory(
    (moveNotation: string, prevSquare: string) => {
      client.move(moveNotation);
      addMoveToList(moveNotation, prevSquare);
      setHintLevel && setHintLevel(0);
      updateRemainingMoves && updateRemainingMoves();
      addRemainingMoveToMakeToAutomaticMoves &&
        addRemainingMoveToMakeToAutomaticMoves();
    },
    setCommandColumnMessage,
    setBoard
  );

  return (
    <BoardInfoProvider value={board}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.mainContainer}>
          <div className={styles.innerContainer}>
            {(isWhite
              ? [8, 7, 6, 5, 4, 3, 2, 1]
              : [1, 2, 3, 4, 5, 6, 7, 8]
            ).map((n) => (
              <Rank
                rankNumber={n}
                key={`rank-${n}`}
                movePiece={movePiece}
                isWhite={isWhite}
                OAM={OAM}
                automaticMove={automaticMoves ? automaticMoves[0] : undefined}
                client={client}
                addMoveToList={addMoveToList}
                setBoard={setBoard}
                hintLevel={hintLevel}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </BoardInfoProvider>
  );
};

export default Board;
