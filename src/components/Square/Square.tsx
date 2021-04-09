import React, { useState, useContext, useEffect } from 'react'

import styles from './Square.scss'
import BoardInfoContext from '../../contexts/BoardInfoContext'
import Piece from "../Piece"
import { PieceName, Side } from "../../sharedTypes"

type Props = {
  rankNumber: number
  fileNumber: number
  fileLetter: string
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

const Square = ({ rankNumber, fileNumber, fileLetter }: Props) => { 
  const board = useContext(BoardInfoContext)
  const [ pieceInfo, setPieceInfo ] = useState<PieceInfo>(null)

  useEffect(() => {
    setPieceInfo(board.squares.find(square =>
      square.file === fileLetter && square.rank === rankNumber
    ).piece)
  }, [board])

  return (
    <div className={isWhite(rankNumber, fileNumber) ? styles.white : styles.black}>
      {
        pieceInfo && 
        <Piece 
          color={pieceInfo.side.name}
          piece={pieceInfo.type}
        />
      }
      <p className={styles.location}>
        {fileLetter + rankNumber}
      </p>
    </div>
  )
}

export default Square