import React, { useState, SetStateAction, Dispatch } from 'react'
import axios from "axios"

import { Move, MovesListType } from "../../sharedTypes"
import styles from "./CommandColumn.scss"
import Button from "../Button"

type Props = {
  setRandomLine: () => void
}

const CommandColumn = ({ setRandomLine }: Props) => {
  const [message, setMessage] = useState<string>('')

  return(
    <div className={styles.container}>
      <p>TEST MODE</p>
      <Button text="New line" onClick={setRandomLine}/>
      <p className={styles.message}>{message}</p>
    </div>
  )
}

export default CommandColumn