import React, { useState } from 'react'
import chess from 'chess'

import Board from '../Board'
import styles from "./App.scss"
import { BoardInfoProvider } from '../../contexts/BoardInfoContext';

const gameClient = chess.create()
const App = () => { 
  const [board, setBoard] = useState(gameClient.game.board)

  return(
    <BoardInfoProvider value={board}>
      <div className={styles.appContainer}>
        <Board></Board>
        {/* TODO: Replace with drag & drop*/}
        <button onClick={
          () => {
            gameClient.move('Nc3')
            setBoard({ ...gameClient.game.board })
          }
        }>Nc3</button>
        <button onClick={
          () => {
            gameClient.move('Nc6')
            setBoard({ ...gameClient.game.board })
          }
        }>Nc6</button>
        {/* ----------------------------- */}
      </div>
    </BoardInfoProvider>
  )
}

export default App