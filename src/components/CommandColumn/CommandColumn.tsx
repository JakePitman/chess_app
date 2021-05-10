import React, { SetStateAction, Dispatch } from 'react'
import { Move } from "../../sharedTypes"

type Props = {
  setReasonInput: Dispatch<SetStateAction<string>>;
  reasonInput: string;
  addReasonToMove: () => void;
  moves: Move[][]
}

const CommandColumn = ({
  setReasonInput,
  reasonInput,
  addReasonToMove,
  moves
}: Props) => {
  return(
    <div>
        <input 
        onChange={(e) => setReasonInput(e.target.value)}
        value={reasonInput}
        style={{"width": "100%"}}
        placeholder="Add reason to last move"
        onKeyDown={(e) => {
            if (e.keyCode === 13) {
              addReasonToMove()
            }
          }}
      /> 
      <button onClick={() => console.log(moves)}>Show moves</button>
    </div>
  )
}

export default CommandColumn