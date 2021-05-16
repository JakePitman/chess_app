import React, { useState, useRef } from 'react'
import chess from 'chess'
import _ from 'lodash'

import Board from '../Board'
import MovesList from '../MovesList'
import styles from "./TestMode.scss"
import { Line, MovesListType } from "../../sharedTypes"

type Props = {
  lines: Line[];
}

const TestMode = ({ lines }: Props) => {
  const gameClientRef = useRef(chess.create())
  const [commandColumnMessage, setCommandColumnMessage] = useState("")
  const [currentLine, setCurrentLine] = useState<Line>(_.sample(lines))
  const currentLineMoves = _.flattenDeep(currentLine?.moves.map(turn => (turn[1] ? [ turn[0].notation, turn[1].notation ] : [turn[0].notation])))
  const [remainingAutomaticMoves, setRemainingAutomaticMoves] = useState<string[]>(currentLineMoves)
  const [moves, setMoves] = useState<MovesListType>([])

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
      </div>
    </div>
  )
}

export default TestMode
