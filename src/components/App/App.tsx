import React, { useState } from 'react'
import chess from 'chess'

import Board from '../Board'
import MovesList from '../MovesList'
import styles from "./App.scss"
import { BoardInfoProvider } from '../../contexts/BoardInfoContext';
import { PieceName, Move } from "../../sharedTypes"

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
  const [moves, setMoves] = useState<Move[][]>([ [{notation: "e4"}, {notation: "e5"}], [{notation: "d4"}, {notation: "d5"}], [{notation: "f4"}] ])

  const movePiece = (
    piece: PieceName,
    targetSquare: string,
    currentLocation: {rank: number, file: string},
    isTaking: boolean
  ) => {
    const { rank, file } = currentLocation
    targetSquare = isTaking ? "x" + targetSquare : targetSquare
    if ( piece === "pawn" ) {
      gameClient.move(
        isTaking ?
        file + targetSquare :
        targetSquare
      )
    } else if ( piece === "king" ) {
      const moveNotation = "K" + targetSquare
      try { 
        gameClient.move(moveNotation) 
      } catch {
        if (targetSquare === "g1" || targetSquare === "g8") {
          gameClient.move("0-0")
        } else if (targetSquare === "c1" || targetSquare === "c8") {
          gameClient.move("0-0-0")
        } else {
          throw Error("Invalid King move")
        }
      }
    } else {
      const pieceNotation = pieceNameToNotation[piece]
      const moveNotation = pieceNotation + targetSquare
      try {
        gameClient.move(moveNotation)
      // Passing rank & file together isn't supported (eg. Nb1C3)
      } catch(e) {
        try {
          gameClient.move(pieceNotation + file + targetSquare)
        } catch(e) {
          gameClient.move(pieceNotation + rank + targetSquare)
        }
      }
    }
    setBoard({ ...gameClient.game.board })
  }

  return(
    <BoardInfoProvider value={board}>
      <div className={styles.appContainer}>
        <div className={styles.columnsContainer}>
          <div className={styles.sideColumn}>
            <MovesList turns={moves}></MovesList>
          </div>
          <Board movePiece={movePiece}></Board>
          <div className={styles.sideColumn}>
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
              style={{"width": "100%"}}
            />
          </div>
        </div>
      </div>
    </BoardInfoProvider>
  )
}

export default App