import React, { useState } from 'react'
import chess from 'chess'

import Board from '../Board'
import MovesList from '../MovesList'
import styles from "./TestMode.scss"
import { Move, MovesListType } from "../../sharedTypes"

const TestMode = () => {
  const gameClient = chess.create()
  const [board, setBoard] = useState(gameClient.game.board)
  const [line, setLine] = useState<MovesListType>()

  return(
    <div className={styles.container}>
      <MovesList turns={line}></MovesList>
    </div>
  )
}

export default TestMode
