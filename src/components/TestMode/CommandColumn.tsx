import React, { useState, SetStateAction, Dispatch } from 'react'
import axios from "axios"

import { Move, MovesListType } from "../../sharedTypes"
import styles from "./CommandColumn.scss"
import Button from "../Button"

type Props = {}

const CommandColumn = ({}: Props) => {
  const [message, setMessage] = useState<string>('')

  return(
    <div className={styles.container}>
      <p>TEST MODE</p>
      <p className={styles.message}>{message}</p>
    </div>
  )
}

export default CommandColumn