import React, { useState } from 'react'
import FreeMode from '../FreeMode'

type Mode = "menu" | "free" | "test" | "list"

const Menu = () => {
  const [mode, setMode] = useState<Mode>(null)

  return (
    <div>
      <h1>Welcome</h1>
      <FreeMode></FreeMode>
    </div>
  )
}

export default Menu