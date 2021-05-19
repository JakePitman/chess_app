import React, {Dispatch, SetStateAction} from "react"
import { PieceName } from "../sharedTypes"

const pieceNameToNotation = {
  "king": "K",
  "queen": "Q",
  "rook": "R",
  "bishop": "B",
  "knight": "N",
}

const moveIfAvailable = (
  move: string,
  onlyAcceptableMove: string,
  makeMove: (move: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  shouldRaiseError: boolean = false
) => {
  if (onlyAcceptableMove) {
    onlyAcceptableMove === move ?
      makeMove(move) :
      setCommandColumnMessage("Wrong move!")
    if (shouldRaiseError) {throw Error}
  } else {
    makeMove(move)
  }
}

const movePiece = (
  gameClient: any,
  makeMove: (moveNotation: string) => void,
  setCommandColumnMessage: Dispatch<React.SetStateAction<string>>,
  setBoard: Dispatch<React.SetStateAction<string>>,
  onlyAcceptableMove?: string
) => {
  return (
    piece: PieceName,
    targetSquare: string,
    currentLocation: {rank: number, file: string},
    isTaking: boolean,
  ) => {
    const { rank, file } = currentLocation
    targetSquare = isTaking ? "x" + targetSquare : targetSquare
    try {
      if ( piece === "pawn" ) {
        const move = isTaking ?
          file + targetSquare :
          targetSquare
        moveIfAvailable(move, onlyAcceptableMove, makeMove, setCommandColumnMessage)
      } else if ( piece === "king" ) {
        const moveNotation = "K" + targetSquare
        try { 
          moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage, true)
        } catch {
          if (targetSquare === "g1" || targetSquare === "g8") {
            const moveNotation = "0-0"
            moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage, true)
          } else if (targetSquare === "c1" || targetSquare === "c8") {
            const moveNotation = "0-0-0"
            moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage)
          } else {
            throw Error("Invalid King move")
          }
        }
      } else {
        const pieceNotation = pieceNameToNotation[piece]
        const moveNotation = pieceNotation + targetSquare
        try {
          moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage, true)
        // Passing rank & file together isn't supported (eg. Nb1C3)
        } catch(e) {
          try {
            const moveNotation = pieceNotation + file + targetSquare
            moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage, true)
          } catch(e) {
            const moveNotation = pieceNotation + rank + targetSquare
            moveIfAvailable(moveNotation, onlyAcceptableMove, makeMove, setCommandColumnMessage)
          }
        }
      }
      setCommandColumnMessage('')
    } catch {
      setCommandColumnMessage("Invalid move")
    }
    setBoard({ ...gameClient.game.board })
  }
}

export default movePiece