

const btn__adicionar = document.querySelector('.adicionar')
const btn__close = document.querySelector('#close')
const dashboard = document.querySelector('.dashboard')

//colocando função de click no botao
btn__adicionar.addEventListener('click', abrirModal)

//função para Abrir o Modal
function abrirModal() {
  const ModalCompleto = document.querySelector('.ParteDeForaModal')
  const styleAtual = ModalCompleto.style.display

  if (styleAtual == 'block') {
    ModalCompleto.style.display = 'none'
  }
  else {
    ModalCompleto.style.display = 'block'
  }
}

// fechando o modal quando se clica na parte de fora dele
window.onclick = function (event) {
  const modal = document.querySelector('.ParteDeForaModal')
  if (event.target == modal) {
    abrirModal()
  }
}

//fechando o modal pelo botão X
btn__close.addEventListener('click', evento => {
  console.log(evento.target.textContent)
  const modal = document.querySelector('.ParteDeForaModal')
  
  if(evento.target.textContent == 'X'){
    modal.style.display = 'none'
  }

})






