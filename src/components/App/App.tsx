import React, { useState } from 'react'
import FreeMode from '../FreeMode'

type Mode = "menu" | "free" | "test" | "list"

const App = () => {
  const [mode, setMode] = useState<Mode>("free")

  const modes = {
    "menu": <div>Menu</div>,
    "free": <FreeMode></FreeMode>,
    "test": <div>Test</div>,
    "list": <div>List</div>
  }

  return (
    <div>
      {
        modes[mode]
      }
    </div>
  )
}

export default App