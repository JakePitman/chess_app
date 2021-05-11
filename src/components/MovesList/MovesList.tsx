import React from 'react'
import { Move } from "../../sharedTypes"
import styles from "./MovesList.scss"

type Props = {
  turns: Move[][]
}

const MovesList = ({ turns }: Props) => {
  return(
    <>
      <div className={styles.title}>Moves</div>
      <div className={styles.notations}>
        {
          turns.map((turn, i) => { 
            return ( 
              <div className={styles.turn} key={i}>
                <p>{i + 1}. {turn[0].notation}</p>
                {
                  turn[1] && <p>, {turn[1].notation}</p>
                }
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default MovesList