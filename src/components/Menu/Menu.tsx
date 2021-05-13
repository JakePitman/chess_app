import React, { Dispatch, SetStateAction } from 'react'
type Mode = "menu" | "free" | "test" | "list"

type Props = {
  setMode: Dispatch<SetStateAction<Mode>>;
}

const Menu = ({ setMode }: Props) => {
  return <div>
    <button onClick={() => setMode("free")}>FREE</button>
    <button onClick={() => setMode("test")}>TEST</button>
    <button onClick={() => setMode("list")}>LIST</button>
  </div>
}

export default Menu