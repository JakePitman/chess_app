import React from 'react'

import Square from '../Square'
import styles from './Rank.scss'
import PieceName from "../../sharedTypes/PieceName"

type Props = {
  rankNumber: number;
  movePiece: (piece: PieceName, targetSquare: string) => void;
}

const FILE_LETTERS = {
  "1": "a",
  "2": "b",
  "3": "c",
  "4": "d",
  "5": "e",
  "6": "f",
  "7": "g",
  "8": "h",
}

const Rank = ({rankNumber, movePiece}: Props) => { 
  return (
    <div className={styles.mainContainer}>
      {
        [1,2,3,4,5,6,7,8].map((fileNumber) => {
          const fileLetter = FILE_LETTERS[fileNumber]
          return (
            <Square 
              rankNumber={rankNumber}
              fileNumber={fileNumber}
              fileLetter={fileLetter}
              movePiece={movePiece}
              key={`square-${fileLetter}${rankNumber}`}
            /> 
          )
        })
      }
    </div>
  )
}

export default Rank