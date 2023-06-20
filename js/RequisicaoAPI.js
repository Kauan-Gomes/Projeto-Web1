
const cidades = JSON.parse(localStorage.getItem("cidades")) || []
const apiKey = '62f0613f0cd845b6a9eb49f41db94d82';
// variaveis de input e botao procurar
const input = document.querySelector('#input-cidade')
const btn__procurar = document.querySelector('#search')

//console.log(cidades[0].nome)
//console.log(cidades.findIndex(elemento => elemento.nome === 'Osasco'))
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
const poluição = async (lat, lon) => {
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}
    `
    const response = await fetch(apiUrl)
    const data = await response.json()

    return data;

}

const showErrorMessage = () => {
    // errorMessageContainer.classList.remove("hide");
    alert('Cidade não encontrada')
};

//transformando o JSON da API em um objeto 
const clima = async (cidade) => {

    const data = await consultaClima(cidade)
    const dataPoluicao = await poluição(data.coord.lat, data.coord.lon)

    if (data.cod === "404") {
        showErrorMessage();
        return;
    }
    const cidadeAtual = {
        "nome": data.name,
        "temperatura": parseInt(data.main.temp),
        "condicao": data.weather[0].description,
        "bandeira": `https://flagsapi.com/${data.sys.country}/flat/64.png`,
        "icone": `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        "umidade": data.main.humidity + '%',
        "vento": `${data.wind.speed}km/h`,
        "id": data.name,
        "indicePoluicao": dataPoluicao.list[0].main.aqi
    }


    climaElemento(cidadeAtual)

    //subindo a pessoa nova para o array de pessoas
    cidades.push(cidadeAtual)

    //atualizando o localStorage
    localStorage.setItem("cidades", JSON.stringify(cidades))


}


//criando elemento cidades
function climaElemento(cidade) {

    let aqi = cidade.indicePoluicao

    if (aqi == 1) {
        aqi = 'Ideal'
    }
    else if (aqi == 2) {
        aqi = 'Bom'
    }
    else if (aqi == 3) {
        aqi = 'Moderado'
    }
    else if (aqi == 4) {
        aqi = 'Ruim'
    }
    else if (aqi == 5) {
        aqi = 'Muito ruim'
    }

    const novoClima = `
    <div class="dashboard" id="${cidade.nome}">
        <div class="btn">
            <button class="remove"><i class="fa-solid fa-trash"></i></button>
            <button class="edit"><i class="fa-solid fa-pen"></i></button>
            <div class="modal__edit">    
                <button class="x" >X</button>
                <input type="text" placeholder="Digite uma nova cidade">
                <button id="searchNovo"> <i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
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
        
        <div class="dashboard__poluicao">  
            <h2>Indice de poluição:</h2>
            <div class="dashboard__poluicao__indice">
                <p>
                    Indice: ${cidade.indicePoluicao}
                </p>
                <p>
                    Aqi: ${aqi}
                </p>
            </div>
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
function atualizar() {
    window.location.reload(false);
}

const modal = document.querySelector('.ParteDeForaModal')

//ativando a busca com o botão
btn__procurar.addEventListener("click", (evento) => {
    evento.preventDefault();

    try {
        const cidade = input.value;

        clima(cidade)

        modal.style.display = 'none'

        input.value = ""
        console.log(cidades)

    }
    finally {
        //função q executa alguma coisa após o tempo determinado
        //primeiro parametro oq vai executar, segundo depois de quanto tempo em milisegundo
        setTimeout(atualizar, 2000);
    }



})
//ativando a busca ao pressionar enter no input
input.addEventListener("keyup", evento => {
    evento.preventDefault();
    if (evento.code == "Enter") {
        try {
            const cidade = evento.target.value
            clima(cidade)

            console.log(cidades)
            modal.style.display = 'none'
            input.value = ""
        }
        finally {
            setTimeout(atualizar, 2000);
        }
    }

})

//capturando todos os dashboards
const todosDashboard = document.querySelectorAll('.dashboard')

//percorrendo todos os dashboards e dando a função mouseleave e mouseenter
todosDashboard.forEach(elemento => {
    elemento.style.backgroundColor = 'blue'
    elemento.addEventListener("mouseenter", evento => {


        const dashboardAcessado = evento.target
        const btn__remove = dashboardAcessado.querySelector('.remove')
        const btn__edit = dashboardAcessado.querySelector('.edit')
        const cidade = dashboardAcessado.querySelector('#cidade').innerText

        dashboardAcessado.style.background = "black"
        btn__edit.style.visibility = 'visible'
        btn__remove.style.visibility = 'visible'


        const fundo = dashboardAcessado.parentNode
        console.log(todosDashboard)

        const apiUnsplash = `https://source.unsplash.com/1600x900/?`

        fundo.style.backgroundImage = `url("${apiUnsplash + cidade}")`;

        // fundo.style.backgroundPosition = 'contain'
        // fundo.style.backgroundRepeat = 'no-repeat'

        // dashboardAcessado.style.zIndex = '2'
        // fundo.style.zIndex = '0'
        // elemento.style.zIndex = '1'

        console.log(fundo)




        if (dashboardAcessado.id === `${cidade}`) {
            btn__remove.addEventListener('click', evento => {
                const pai = evento.target.parentNode.parentNode.parentNode

                apagar(pai, dashboardAcessado.id)
                setTimeout(atualizar, 1000);

            })

            btn__edit.addEventListener('click', evento => {
                const pai = evento.target.parentNode.parentNode.parentNode
                const model_edit = pai.querySelector('.modal__edit')
                const fechar = pai.querySelector('.x')
                const input = pai.querySelector('input')
                const btn__procurar = pai.querySelector('#searchNovo')



                btn__procurar.addEventListener('click', evento => {
                    const cidade = input.value
                    const pai = evento.target.parentNode.parentNode.parentNode.parentNode
                    const cidadeEliminada = pai.querySelector('#cidade').innerText
                    try {
                        clima(cidade)

                        model_edit.style.display = 'none'

                        input.value = ""

                        apagar(pai, cidadeEliminada)
                    }
                    finally{
                        setTimeout(atualizar, 2000);
                    }
                })



                model_edit.style.display = 'flex'

                fechar.addEventListener('click', evento => {
                    model_edit.style.display = 'none'
                })

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

        const fundo = dashboardMaior.parentNode
        fundo.style.backgroundImage = 'none'
    })


})

//função para apagar os climas da cidade e do DOM
function apagar(tag, id) {

    //console.log(tag)
    //removendo a tag
    tag.remove()
    //console.log(id)
    //removendo do objeto cidades
    console.log(cidades.findIndex(elemento => elemento.id === `${id}`))
    cidades.splice(cidades.findIndex(elemento => elemento.id === `${id}`), 1)

    //subindo para o localStorage o novo objeto sem o elemento removido
    localStorage.setItem('cidades', JSON.stringify(cidades))


}
