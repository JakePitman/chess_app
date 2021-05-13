import React, { useState } from 'react'
import chess from 'chess'

import Board from '../Board'
import MovesList from '../MovesList'
import CommandColumn from '../CommandColumn'
import styles from "./FreeMode.scss"
import { PieceName, Move } from "../../sharedTypes"


const pieceNameToNotation = {
  "king": "K",
  "queen": "Q",
  "rook": "R",
  "bishop": "B",
  "knight": "N",
}

const FreeMode = () => { 
  const gameClient = chess.create()
  const [board, setBoard] = useState(gameClient.game.board)
  const [reasonInput, setReasonInput] = useState('')
  const [moves, setMoves] = useState<Move[][]>([])
  const [commandColumnMessage, setCommandColumnMessage] = useState<string>(null)
  const [isWhite, setIsWhite] = useState<boolean>(true)

  const addMoveToList = ( move: string ) => {
    setMoves(prevMoves => { 
      const lastTurn = prevMoves[prevMoves.length -1]
      return lastTurn && lastTurn[0] && !lastTurn[1] ? 
        [...prevMoves.slice(0, prevMoves.length - 1), [lastTurn[0], {notation: move}]] :
        [...prevMoves, [{notation: move}]]
    });
  }

  const movePiece = (
    piece: PieceName,
    targetSquare: string,
    currentLocation: {rank: number, file: string},
    isTaking: boolean
  ) => {
    const { rank, file } = currentLocation
    targetSquare = isTaking ? "x" + targetSquare : targetSquare
    try {
      if ( piece === "pawn" ) {
        const move = isTaking ?
          file + targetSquare :
          targetSquare
        gameClient.move(move)
        addMoveToList(move)
      } else if ( piece === "king" ) {
        const moveNotation = "K" + targetSquare
        try { 
          gameClient.move(moveNotation) 
          addMoveToList(moveNotation)
        } catch {
          if (targetSquare === "g1" || targetSquare === "g8") {
            gameClient.move("0-0")
            addMoveToList("0-0")
          } else if (targetSquare === "c1" || targetSquare === "c8") {
            gameClient.move("0-0-0")
            addMoveToList("0-0-0")
          } else {
            throw Error("Invalid King move")
          }
        }
      } else {
        const pieceNotation = pieceNameToNotation[piece]
        const moveNotation = pieceNotation + targetSquare
        try {
          gameClient.move(moveNotation)
          addMoveToList(moveNotation)
        // Passing rank & file together isn't supported (eg. Nb1C3)
        } catch(e) {
          try {
            const move = pieceNotation + file + targetSquare
            gameClient.move(move)
            addMoveToList(move)
          } catch(e) {
            const move = pieceNotation + rank + targetSquare
            gameClient.move(move)
            addMoveToList(move)
          }
        }
      }
      setCommandColumnMessage('')
    } catch {
      setCommandColumnMessage("Invalid move")
    }
    setBoard({ ...gameClient.game.board })
  }

  const addReasonToMove = () => {
    moves.length > 0 && setMoves(prevMoves => {
      const lastTurn = prevMoves[prevMoves.length - 1]
      const lastMoveDup = { ...lastTurn[lastTurn.length - 1] }
      lastMoveDup.reason = reasonInput
      return [
        ...prevMoves.slice(0, prevMoves.length - 1),
        [ ...lastTurn.slice(0, lastTurn.length - 1), lastMoveDup ]
      ]
    })
    setReasonInput('')
  }

  return(
      <div className={styles.appContainer}>
        <div className={styles.columnsContainer}>
          <div className={styles.sideColumn}>
            <MovesList turns={moves}></MovesList>
          </div>
          <Board movePiece={movePiece} board={board}></Board>
          <div className={styles.sideColumn}>
            <CommandColumn 
              setReasonInput={setReasonInput}
              reasonInput={reasonInput}
              addReasonToMove={addReasonToMove}
              moves={moves}
              incomingMessage={commandColumnMessage}
              isWhite={isWhite}
              setIsWhite={setIsWhite}
            />
          </div>
        </div>
      </div>
  )
}

export default FreeMode