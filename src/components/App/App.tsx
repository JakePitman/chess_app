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

  const movePiece = (
    piece: PieceName,
    targetSquare: string,
    currentLocation: {rank: number, file: string}
  ) => {
    const { rank, file } = currentLocation
    if ( piece === "pawn" ) {
      gameClient.move(targetSquare)
    } else {
      const pieceNotation = pieceNameToNotation[piece]
      const moveNotation = pieceNotation + currentLocation.file + targetSquare
      try {
        gameClient.move(moveNotation)
      // Passing rank & file together isn't supported (eg. Nb1C3)
      } catch(e) {
        gameClient.move(pieceNotation + currentLocation.rank + targetSquare)
      }
    }
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