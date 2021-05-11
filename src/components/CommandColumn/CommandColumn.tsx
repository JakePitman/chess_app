import React, { useState, SetStateAction, Dispatch } from 'react'
import axios from "axios"

import { Move } from "../../sharedTypes"
import styles from "./CommandColumn.scss"

type Props = {
  setReasonInput: Dispatch<SetStateAction<string>>;
  reasonInput: string;
  addReasonToMove: () => void;
  moves: Move[][];
  incomingMessage: string;
}

const CommandColumn = ({
  setReasonInput,
  reasonInput,
  addReasonToMove,
  moves,
  incomingMessage
}: Props) => {
  const [titleInput, setTitleInput] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  return(
    <div className={styles.container}>
        <div>
          <p className={styles.titleHeader}>Title</p>
          <input
            onChange={(e) => setTitleInput(e.target.value)}
            value={titleInput}
            className={styles.titleInput}
            placeholder="Add a title"
          />
        </div>
        <div>
          <p className={styles.reasonHeader}>Add reason to last move</p>
          <textarea 
            className={styles.reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            value={reasonInput}
            placeholder="Add reason to last move"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                if (moves.length <= 0) {
                  setMessage("No moves made yet")
                  setReasonInput("")
                } else {
                  addReasonToMove()
                }
              }
            }}
          /> 
      </div>
      <button 
        className={styles.button}
        onClick={() => {
          if (titleInput.length <= 0) {
            setMessage("Please enter a title")
          } else {
            console.log(moves)
          }
        }
        }
      >Save moves</button>
      <p className={styles.message}>{incomingMessage ? incomingMessage : message}</p>
    </div>
  )
}

export default CommandColumn