import React, { useState, useEffect, Dispatch, SetStateAction} from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import styles from './Board.scss'
import Rank from '../Rank'
import { BoardInfoProvider } from '../../contexts/BoardInfoContext';
import movePieceFactory from "../../helpers/movePiece"
import { Move } from "../../sharedTypes"

type Props = {
  automaticMoves?: string[];
  client: any;
  isWhite: boolean;
  setCommandColumnMessage: Dispatch<SetStateAction<string>>;
  addMoveToList: (move: string) => void;
  OAM: Move,
  updateRemainingMoves: () => void;
}

const Board = ({ 
  automaticMoves,
  client,
  isWhite,
  setCommandColumnMessage,
  addMoveToList,
  OAM,
  updateRemainingMoves
}: Props) => {
  const [board, setBoard] = useState(client.game.board)

  useEffect(() => {
    if (automaticMoves && automaticMoves.length > 0) {
      client.move(automaticMoves[0])
      setBoard({...client.game.board})
      addMoveToList(automaticMoves[0])
      //TODO: need to update squares on capture... May not be possible from here
      // Is it possible to tell a square to make a move?
      //   eg. automaticMove = "Ng5", tell g5 square to make this move?
      //   could pass in next automatic move to each square, and square moves if it matches
      //   then pass null when none are left, so moves don't get made again
    }
  }, [automaticMoves?.length])

  const movePiece = movePieceFactory(
    client,
    (moveNotation: string) => {
      client.move(moveNotation)
      addMoveToList(moveNotation)
    },
    setCommandColumnMessage,
    setBoard,
    updateRemainingMoves,
  )

  return (
    <BoardInfoProvider value={board}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.mainContainer}>
          {
            (
              isWhite ?
              [8,7,6,5,4,3,2,1] :
              [1,2,3,4,5,6,7,8]
            ).map(n => (
              <Rank rankNumber={n} key={`rank-${n}`} movePiece={movePiece} isWhite={isWhite} OAM={OAM?.notation}/>
            ))
          }
        </div>
      </DndProvider>
    </BoardInfoProvider>
  )
}

export default Board