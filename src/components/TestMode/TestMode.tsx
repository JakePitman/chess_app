import React, { useState, useEffect } from 'react'
import chess from 'chess'
import _ from "lodash"

import Board from '../Board'
import MovesList from '../MovesList'
import styles from "./TestMode.scss"
import { Line } from "../../sharedTypes"

type Props = {
  lines: Line[]
}

const TestMode = ({ lines }: Props) => {
  const gameClient = chess.create()
  const [board, setBoard] = useState(gameClient.game.board)
  const [currentLine, setCurrentLine] = useState<Line>(_.sample(lines))

  return(
    <div className={styles.container}>
      {
        currentLine ?
        (
          <MovesList turns={currentLine.moves}></MovesList>
        ) : (
          <p>No lines found. Please record one in Free mode</p>
        )
      }
    </div>
  )
}

export default TestMode
