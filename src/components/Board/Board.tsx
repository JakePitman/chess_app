import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import styles from './Board.scss'
import Rank from '../Rank'
import PieceName from "../../sharedTypes/PieceName"

type Props = {
  movePiece: (piece: PieceName, targetSquare: string) => void
}

const Board = ({ movePiece }: Props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.mainContainer}>
        {
          [8,7,6,5,4,3,2,1].map(n => (
            <Rank rankNumber={n} key={`rank-${n}`} movePiece={movePiece}/>
          ))
        }
      </div>
    </DndProvider>
  )
}

export default Board