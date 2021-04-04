import React from 'react'

import styles from './Board.scss'
import Rank from '../Rank'

const Board = () => {
  return (
    <div className={styles.mainContainer}>
      {
        [8,7,6,5,4,3,2,1].map(n => (
          <Rank rankNumber={n} key={`rank-${n}`}/>
        ))
      }
    </div>
  )
}

export default Board