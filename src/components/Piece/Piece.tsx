import React from 'react'
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
  color: Side,
  piece: PieceName
}

const Piece = ({color, piece}: Props) => {
  return (
    <div className={styles.piece}>{PIECES[color][piece]}</div>
  )
}

export default Piece