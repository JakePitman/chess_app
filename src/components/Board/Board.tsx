import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import styles from './Board.scss'
import Rank from '../Rank'
import PieceName from "../../sharedTypes/PieceName"
import { BoardInfoProvider } from '../../contexts/BoardInfoContext';

type Props = {
  movePiece: (
    piece: PieceName,
    targetSquare: string,
    currentLocation: {rank: number, file: string},
    isTaking: boolean
  ) => void
  board: any;
  isWhite: boolean;
}

const Board = ({ movePiece, board, isWhite }: Props) => {
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
              <Rank rankNumber={n} key={`rank-${n}`} movePiece={movePiece} isWhite={isWhite}/>
            ))
          }
        </div>
      </DndProvider>
    </BoardInfoProvider>
  )
}

export default Board