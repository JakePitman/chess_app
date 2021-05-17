import React, { useState, useEffect, useRef } from 'react'
import chess from 'chess'
import _ from 'lodash'

import Board from '../Board'
import MovesList from '../MovesList'
import CommandColumn from './CommandColumn'
import { Line, MovesListType } from "../../sharedTypes"
import styles from "./TestMode.scss"

type Props = {
  lines: Line[];
}

const TestMode = ({ lines }: Props) => {
  const gameClientRef = useRef(chess.create())
  const [commandColumnMessage, setCommandColumnMessage] = useState("")
  const [currentLine, setCurrentLine] = useState<Line>(_.sample(lines))
  const [remainingAutomaticMoves, setRemainingAutomaticMoves] = useState<string[]>([])
  const [moves, setMoves] = useState<MovesListType>([])

  const flattenMoves = (movesObjects: MovesListType) => (
    _.flattenDeep(movesObjects.map(
      turn => (turn[1] ? [ turn[0].notation, turn[1].notation ] : [turn[0].notation])
      )
    )
  )

  useEffect(() => {
    gameClientRef.current = chess.create()
    setMoves([])
    // Gets a number between 0 & the number of moves (not inclusive)
    const startingPoint = Math.floor(Math.random() * (currentLine.moves.length - 1) + 1)
    setRemainingAutomaticMoves(flattenMoves(
      currentLine.moves.slice(0, startingPoint)
    ))
  }, [currentLine])

  if (remainingAutomaticMoves.length > 0) {
    setTimeout(() => {
      // Re-renders Board with next automatic move
      setRemainingAutomaticMoves([...(remainingAutomaticMoves.slice(1, remainingAutomaticMoves.length))])
    }, 300)
  }

  const addMoveToList = ( move: string ) => {
    setMoves(prevMoves => { 
      const lastTurn = prevMoves[prevMoves.length -1]
      return lastTurn && lastTurn[0] && !lastTurn[1] ? 
        [...prevMoves.slice(0, prevMoves.length - 1), [lastTurn[0], {notation: move}]] :
        [...prevMoves, [{notation: move}]]
    });
  }

  const setRandomLine = () => {
    const otherLines = lines.filter(line => (
      flattenMoves(line.moves).toString() !== flattenMoves(currentLine.moves).toString()
    ))
    setCurrentLine(_.sample(otherLines))
  }

  return(
    <div className={styles.container}>
      <div className={styles.columnsContainer}>
        <div className={styles.sideColumn}>
          <MovesList turns={moves}></MovesList>
        </div>
        <Board 
          automaticMoves={remainingAutomaticMoves}
          client={gameClientRef.current}
          isWhite={currentLine.playercolor === "white"}
          setCommandColumnMessage={setCommandColumnMessage}
          addMoveToList={addMoveToList}
        />
        <div className={styles.sideColumn}>
          <CommandColumn setRandomLine={setRandomLine}/>
        </div>
      </div>
    </div>
  )
}

export default TestMode
