import React from 'react'
import { useDrag } from 'react-dnd'

import styles from './Piece.scss'
import { PieceName, Side } from "../../sharedTypes"

const PIECES = {
  white: {
    king: '\u2654',
    queen: '\u2655',
    rook: '\u2656',
    bishop: '\u2657',
    knight: '\u2658',
    pawn: '\u2659',
  },
  black: {
    king: '\u265A',
    queen: '\u265B',
    rook: '\u265C',
    bishop: '\u265D',
    knight: '\u265E',
    pawn: '\u265F',
  }
}

type Props = {
  pieceInfo: {side: { name: Side }, type: PieceName}
  location: { rank: number, file: string }
}

const Piece = ({pieceInfo, location}: Props) => {
  const { type, side } = pieceInfo

  const [{isDragging}, drag] = useDrag(() => ({
    type: type,
    item: { 
      pieceName: type,
      square: location 
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div 
      className={
        isDragging ? styles.dragging : styles.piece
      }
      ref={drag}
    >
      {PIECES[side.name][type]}
    </div>
  )
}

export default Piece