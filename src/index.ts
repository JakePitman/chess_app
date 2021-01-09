import './style.css'

function component() {
  const element = document.createElement('div');
  const msg: string = "Hello World >:]"
  element.innerText = msg
  element.classList.add("hello")

  return element;
}

document.body.appendChild(component());