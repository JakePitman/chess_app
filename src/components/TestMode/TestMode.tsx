import React, { useState, useEffect } from 'react'
import chess from 'chess'
import _ from "lodash"

import Board from '../Board'
import MovesList from '../MovesList'
import movePiece from "../../helpers/movePiece"
import styles from "./TestMode.scss"
import { Line } from "../../sharedTypes"

type Props = {
  lines: Line[]
}

const TestMode = ({ lines }: Props) => {
  const gameClient = chess.create()
  const [board, setBoard] = useState(gameClient.game.board)
  const [currentLine, setCurrentLine] = useState<Line>(_.sample(lines))
  const [commandColumnMessage, setCommandColumnMessage] = useState<string>(null)

  return(
    <div className={styles.container}>
      {
        currentLine ?
        (
          <div className={styles.columnsContainer}>
            <div className={styles.sideColumn}>
              <MovesList turns={currentLine.moves}></MovesList>
            </div>
            <Board 
              movePiece={movePiece(
                gameClient,
                (moveNotation: string) => {
                  gameClient.move(moveNotation)
                },
                setCommandColumnMessage,
                setBoard
              )}
              board={board}
              isWhite={currentLine.playercolor === "white"}
            />
          </div>
        ) : (
          <p>No lines found. Please record one in Free mode</p>
        )
      }
    </div>
  )
}

export default TestMode
