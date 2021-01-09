import './style.css'

import chess from 'chess'
const gameClient = chess.create()

gameClient.on('check', (attack) => {
  console.log("ATTACK: ", attack)
})

gameClient.move('Nc3')
gameClient.move('a5')
gameClient.move('Ne4')
gameClient.move('a4')
gameClient.move('Nd6')
console.log("GAME STATUS: ", gameClient.getStatus())

function component() {
  const element = document.createElement('div');
  const msg: string = "Hello World >:]"
  element.innerText = msg
  element.classList.add("hello")

  return element;
}

document.body.appendChild(component());