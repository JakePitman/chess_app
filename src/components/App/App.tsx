import React, { useState } from 'react'
import chess from 'chess'

import Board from '../Board'
import styles from "./App.scss"
import { BoardInfoProvider } from '../../contexts/BoardInfoContext';
import { PieceName } from "../../sharedTypes"

const gameClient = chess.create()

const pieceNameToNotation = {
  "king": "K",
  "queen": "Q",
  "rook": "R",
  "bishop": "B",
  "knight": "N",
}

const App = () => { 
  const [board, setBoard] = useState(gameClient.game.board)
  const [input, setInput] = useState('')

  const movePiece = (piece: PieceName, targetSquare: string) => {
    const pieceNotation = pieceNameToNotation[piece]
    const moveNotation = (piece === "pawn" ? '' : pieceNotation) + targetSquare
    gameClient.move(moveNotation)
    setBoard({ ...gameClient.game.board })
  }

  return(
    <BoardInfoProvider value={board}>
      <div className={styles.appContainer}>
        <Board movePiece={movePiece}></Board>
        <input 
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              gameClient.move(input)
              setInput('')
              setBoard({...gameClient.game.board})
            }
          }}
        />
      </div>
    </BoardInfoProvider>
  )
}

export default App