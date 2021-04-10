import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import styles from './Board.scss'
import Rank from '../Rank'

const Board = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.mainContainer}>
        {
          [8,7,6,5,4,3,2,1].map(n => (
            <Rank rankNumber={n} key={`rank-${n}`}/>
          ))
        }
      </div>
    </DndProvider>
  )
}

export default Board