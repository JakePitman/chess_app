import './style.css'

function component() {
  const element = document.createElement('div');
  element.innerText = "Hello World!"
  element.classList.add("hello")

  return element;
}

document.body.appendChild(component());