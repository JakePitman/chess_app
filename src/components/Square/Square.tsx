import React, { useState, useContext, useEffect } from 'react'
import { ItemTypes } from '../../itemTypes'
import { useDrop } from 'react-dnd'

import styles from './Square.scss'
import BoardInfoContext from '../../contexts/BoardInfoContext'
import Piece from "../Piece"
import { PieceName, Side } from "../../sharedTypes"

type Props = {
  rankNumber: number
  fileNumber: number
  fileLetter: string
  movePiece: (piece: PieceName, targetSquare: string, currentLocation: string) => void
}

const isWhite = (rankNumber: number, fileNumber: number) => {
  if (rankNumber % 2 === 0) {
    return fileNumber % 2 !== 0
  } else {
    return fileNumber % 2 === 0
  }
}

type PieceInfo = null | {
  side: {name: Side},
  type: PieceName
}

const Square = ({ rankNumber, fileNumber, fileLetter, movePiece }: Props) => { 
  const board = useContext(BoardInfoContext)
  const [ pieceInfo, setPieceInfo ] = useState<PieceInfo>(null)

  useEffect(() => {
    setPieceInfo(board.squares.find(square =>
      square.file === fileLetter && square.rank === rankNumber
    ).piece)
  }, [board])

  const squareNotation = `${fileLetter}${rankNumber}`

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'],
    drop: (item: {pieceName: PieceName, square: string}, monitor) => {
      movePiece(
        item.pieceName,
        squareNotation,
        item.square
      )
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [])

  return (
    <div 
      className={
        isWhite(rankNumber, fileNumber) ? styles.white : styles.black
      }
      ref={drop}
    >
      {
        pieceInfo && 
        <Piece 
          color={pieceInfo.side.name}
          piece={pieceInfo.type}
          location={{rank: rankNumber, file: fileLetter}}
        />
      }
      <div className={isOver ? styles.hoverCircle : ''}/>
      <p className={styles.location}>
        {squareNotation}
      </p>
    </div>
  )
}

export default Square