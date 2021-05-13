import React, { useState } from 'react'

import Menu from "../Menu"
import FreeMode from '../FreeMode'
import TestMode from '../TestMode'
import Button from "../Button"
import styles from "./App.scss"

type Mode = "menu" | "free" | "test" | "list"

const App = () => {
  const [mode, setMode] = useState<Mode>("menu")

  const modes = {
    "menu": <Menu setMode={setMode}/>,
    "free": <FreeMode/>,
    "test": <TestMode/>,
    "list": <div>List</div>
  }

  return (
    <div className={styles.container}>
      { 
        mode !== "menu" && 
          <div className={styles.menuButtonContainer}>
            <Button 
              text="MENU"
              onClick={() => setMode("menu")}
            />
          </div>
      }
      {
        modes[mode]
      }
    </div>
  )
}

export default App