import React, { useState, useContext, useLayoutEffect } from 'react'
import { useDrop } from 'react-dnd'

import styles from './Square.scss'
import BoardInfoContext from '../../contexts/BoardInfoContext'
import Piece from "../Piece"
import { PieceName, Side } from "../../sharedTypes"

type Props = {
  rankNumber: number
  fileNumber: number
  fileLetter: string
  movePiece: (
    piece: PieceName,
    targetSquare: string,
    currentLocation: string,
    isTaking: boolean
  ) => void
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
  const getPieceInfo = () => {
    return board.squares.find(square =>
      square.file === fileLetter && square.rank === rankNumber
    ).piece
  }
  const [ pieceInfo, setPieceInfo ] = useState<PieceInfo>(null)

  useLayoutEffect(() => {
    const newInfo = getPieceInfo()
    setPieceInfo(newInfo)
  }, [board])

  const squareNotation = `${fileLetter}${rankNumber}`

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'],
    drop: (item: {pieceName: PieceName, square: string}, monitor) => {
      const isTaking = !!getPieceInfo()
      movePiece(
        item.pieceName,
        squareNotation,
        item.square,
        !!getPieceInfo()
      )
      if (isTaking) {
        // Hack: set to null first, so Piece rerenders
        setPieceInfo(null)
        setPieceInfo(getPieceInfo())
      }
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
          pieceInfo={pieceInfo}
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