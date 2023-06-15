const btn__adicionar = document.querySelector('.adicionar')

console.log(btn__adicionar)

//colocando função de click no botao
btn__adicionar.addEventListener('click', abrirModal)  

//função para Abrir o Modal
function abrirModal() {
    const ModalCompleto = document.querySelector('.ParteDeForaModal')
    const styleAtual = ModalCompleto.style.display

    if(styleAtual == 'block'){
        ModalCompleto.style.display = 'none'
    }
    else{
        ModalCompleto.style.display = 'block'
    }
}

window.onclick = function(event) {
    const modal = document.querySelector('.ParteDeForaModal')
  if (event.target == modal) {
    abrirModal()
  }
}




