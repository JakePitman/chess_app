import React from 'react'
import styles from './Square.scss'

type Props = {
  rankNumber: number
  fileNumber: number
  fileLetter: string
}

const isWhite = (rankNumber: number, fileNumber: number) => {
  if (rankNumber % 2 === 0) {
    return fileNumber % 2 !== 0
  } else {
    return fileNumber % 2 === 0
  }
}

const Square = ({ rankNumber, fileNumber, fileLetter }: Props) => ( 
  <div className={isWhite(rankNumber, fileNumber) ? styles.white : styles.black}>
    <p className={styles.location}>
      {fileLetter + rankNumber}
    </p>
  </div>
)

export default Square