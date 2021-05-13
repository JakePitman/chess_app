import React, { useState } from 'react'
import FreeMode from '../FreeMode'

import Menu from "../Menu"

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
    <div>
      { mode !== "menu" && <button onClick={() => setMode("menu")}>MENU</button> }
      {
        modes[mode]
      }
    </div>
  )
}

export default App