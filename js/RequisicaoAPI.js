
const cidades = JSON.parse(localStorage.getItem("cidades")) || []
const apiKey = '62f0613f0cd845b6a9eb49f41db94d82';


// variaveis de input e botao procurar
const input = document.querySelector('#input-cidade')
const btn__procurar = document.querySelector('#search')


//cria todos os objetos armazenados no localStorage
cidades.forEach(elemento => {
    climaElemento(elemento)
});


//busca os dados na API
const consultaClima = async (cidade) => {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`

        const response = await fetch(apiUrl)
        const data = await response.json()

        return data;
    }
    catch (Error) {
        console.log(Error.message)
    }

}

//transformando o JSON da API em um objeto 
const clima = async (cidade) => {

    const data = await consultaClima(cidade)

    const cidadeAtual = {
        "nome": data.name,
        "temperatura": parseInt(data.main.temp),
        "condicao": data.weather[0].description,
        "bandeira": `https://flagsapi.com/${data.sys.country}/flat/64.png`,
        "icone": `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        "umidade": data.main.humidity + '%',
        "vento": `${data.wind.speed}km/h`,
        "id": data.name
    }


    climaElemento(cidadeAtual)

    //subindo a pessoa nova para o array de pessoas
    cidades.push(cidadeAtual)

    //atualizando o localStorage
    localStorage.setItem("cidades", JSON.stringify(cidades))

}


//criando elemento cidades
function climaElemento(cidade) {
    const novoClima = `
    <div class="dashboard" id="${cidade.nome}">
        <div class="btn">
            <button class="remove"><i class="fa-solid fa-trash"></i></button>
            <button class="edit"><i class="fa-solid fa-pen"></i></button>
        </div>
        <div class="dashboard__principal">
            <div>
                <i class="fa-solid fa-location-dot"></i>
                <span id="cidade">${cidade.nome}</span>
                <img src="${cidade.bandeira}" >
            </div>
            <p class="temperatura" ><span>${cidade.temperatura}</span>&deg;C</p>
        </div>
        <div class="dashboard__descricao">
                <p> ${cidade.condicao}</p>
                <img src="${cidade.icone}">
        </div>
        <div class="dashboard__detalhes">
                <p class="umidade">
                    <i class="fa-solid fa-droplet"></i>
                    <span>${cidade.umidade}</span>
                </p>
                <p>
                    <i class="fa-solid fa-wind"></i>
                    <span>${cidade.vento}</span>
                </p>
            </div>
        </div>
    
    `
    //criando os elementos HTML
    // const fundo = document.querySelector('.Fundo__dashboard')
    // //começando com o dashboard
    // const dashboard = document.createElement('div')
    // dashboard.classList.add('dashboard')

    // fundo.appendChild(dashboard)

    // //div de botões
    // const btn = document.createElement('div')
    // btn.classList.add('btn')
    // dashboard.appendChild(btn)
    // //botões de apaagr e editar
    // const btn__remover = document.createElement('button')
    // btn__remover.classList.add('remove')
    // btn__remover.innerHTML = '<i class="fa-solid fa-trash"></i>'


    // const btn__edit = document.createElement('button')
    // btn__edit.classList.add('edit')
    // btn__edit.innerHTML = '<i class="fa-solid fa-pen"></i>'

    // btn.appendChild(btn__edit)
    // btn.appendChild(btn__remover)


    // // criando o dashboard principal
    // const dashboard__principal = document.createElement('div')
    // dashboard__principal.classList.add('dashboard__principal')
    // dashboard.appendChild(dashboard__principal)

    // //div 1
    // const div1 = document.createElement('div')
    // dashboard__principal.appendChild(div1)

    // const location = document.createElement('i')
    // location.classList.add('')



    const listaClima = document.querySelector('.Fundo__dashboard')

    listaClima.innerHTML = novoClima + listaClima.innerHTML


}


const modal = document.querySelector('.ParteDeForaModal')

//ativando a busca com o botão
btn__procurar.addEventListener("click", (evento) => {
    evento.preventDefault();

    const cidade = input.value;

    clima(cidade)

    modal.style.display = 'none'

    input.value = ""


})
//ativando a busca ao pressionar enter no input
input.addEventListener("keyup", evento => {
    evento.preventDefault();
    if (evento.code == "Enter") {

        const cidade = evento.target.value
        clima(cidade)

        modal.style.display = 'none'
        input.value = ""


    }
})

//capturando todos os dashboards
const todosDashboard = document.querySelectorAll('.dashboard')

//percorrendo todos os dashboards e dando a função mouseleave e mouseenter

todosDashboard.forEach(elemento => {
    elemento.addEventListener("mouseenter", evento => {

        const dashboardAcessado = evento.target
        const btn__remove = dashboardAcessado.querySelector('.remove')
        const btn__edit = dashboardAcessado.querySelector('.edit')
        const cidade = dashboardAcessado.querySelector('#cidade').innerText


        dashboardAcessado.style.background = "black"
        btn__edit.style.visibility = 'visible'
        btn__remove.style.visibility = 'visible'


        if (evento.target.id === cidade) {
            btn__remove.addEventListener('click', evento => {
                const pai = evento.target.parentNode.parentNode.parentNode

                apagar(pai, cidade)

            })

            btn__edit.addEventListener('click', evento => {
                const pai = evento.target.parentNode.parentNode.parentNode
                let input = pai.querySelector('#cidade').parentNode
                console.log(input)
                

                const indexCidade = cidades.findIndex(elemento => elemento.nome === cidade)

                const cidadeEditar = cidades[indexCidade]


            })
        }

    })
    elemento.addEventListener("mouseleave", evento => {

        const dashboardMaior = evento.target
        const btn__remove = dashboardMaior.querySelector('.remove')
        const btn__edit = dashboardMaior.querySelector('.edit')

        dashboardMaior.style.background = "var(--cor-principal)"
        btn__edit.style.visibility = 'hidden'
        btn__remove.style.visibility = 'hidden'
    })


})

//função para apagar os climas da cidade e do DOM
function apagar(tag, cidade) {

    //removendo a tag
    tag.remove()

    //removendo do objeto cidades
    cidades.splice(cidades.splice(cidades.findIndex(elemento => elemento.nome === cidade), 1))

    //subindo para o localStorage o novo objeto sem o elemento removido
    localStorage.setItem('cidades', JSON.stringify(cidades))
}
