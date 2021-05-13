import React, { useState } from 'react'
import FreeMode from '../FreeMode'

import Menu from "../Menu"
import styles from "./App.scss"

type Mode = "menu" | "free" | "test" | "list"

const App = () => {
  const [mode, setMode] = useState<Mode>("menu")

  const modes = {
    "menu": <Menu setMode={setMode}/>,
    "free": <FreeMode></FreeMode>,
    "test": <div>Test</div>,
    "list": <div>List</div>
  }

  return (
    <div className={styles.container}>
      { 
        mode !== "menu" && 
          <button 
            className={styles.menuButton}
            onClick={() => setMode("menu")}
          >MENU</button> 
      }
      {
        modes[mode]
      }
    </div>
  )
}

export default App