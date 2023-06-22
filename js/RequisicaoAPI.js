
const cidades = JSON.parse(localStorage.getItem("cidades")) || []
const apiKey = '62f0613f0cd845b6a9eb49f41db94d82';

// variaveis de 
const input = document.querySelector('#input-cidade')
const btn__procurar = document.querySelector('#search')
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

    if (evento.target.textContent == 'X') {
        modal.style.display = 'none'
    }

})



const apagar = (evento) => {

    const tag = evento.target.closest('.dashboard')
    //removendo a div com o clima 
    tag.remove()

    //procurando o indice para poder remover
    const cidadeIndex = cidades.findIndex(elemento => elemento.id == tag.id)

    //removendo do objeto cidades
    cidades.splice(cidadeIndex, 1)

    //subindo para o localStorage o novo objeto sem o elemento removido
    localStorage.setItem('cidades', JSON.stringify(cidades))
}

const editar = (evento) => {

    const tag = evento.target.closest('.dashboard')

    const model_edit = tag.querySelector('.modal__edit')

    model_edit.style.display = 'flex'


    const input = tag.querySelector('input')
    const btn__procurar = tag.querySelector('#searchNovo')


    btn__procurar.addEventListener('click', evento => {
        const cidade = input.value

        clima(cidade)

        const tagEliminada = evento.target.closest('.dashboard')
        tagEliminada.remove()

        const cidadeIndex = cidades.findIndex(elemento => elemento.id == tagEliminada.id)
        cidades.splice(cidadeIndex, 1)

        localStorage.setItem('cidades', JSON.stringify(cidades))

        model_edit.style.display = 'none'

        input.value = ""

    })
    input.addEventListener("keyup", evento => {
        evento.preventDefault();
        if (evento.code == "Enter") {
            const cidade = input.value

            clima(cidade)

            const tagEliminada = evento.target.closest('.dashboard')
            tagEliminada.remove()

            const cidadeIndex = cidades.findIndex(elemento => elemento.id == tagEliminada.id)
            cidades.splice(cidadeIndex, 1)

            localStorage.setItem('cidades', JSON.stringify(cidades))

            model_edit.style.display = 'none'

            input.value = ""

        }

    })


    // fechando o modal ao clicar no X
    const fechar = tag.querySelector('.x')
    fechar.addEventListener('click', evento => {
        model_edit.style.display = 'none'
    })

}

//adicionando todos os eventos as DIVs de clima
const adicionandoEvento = () => {
    //capturando todos os dashboards
    const todosDashboard = document.querySelectorAll('.dashboard')

    //percorrendo todos os dashboards e dando a função mouseleave e mouseenter
    todosDashboard.forEach(elemento => {
        const btn__remove = elemento.querySelector('.remove')
        btn__remove.addEventListener('click', apagar)
        const btn__edit = elemento.querySelector('.edit')
        btn__edit.addEventListener('click', editar)


        elemento.addEventListener("mouseenter", dashboardMouseenter)

        elemento.addEventListener("mouseleave", dashboardMouseleave)
    })

}

//função ao sair do dashboard
const dashboardMouseleave = (evento) => {
    const dashboardMaior = evento.target
    const btn__remove = dashboardMaior.querySelector('.remove')
    const btn__edit = dashboardMaior.querySelector('.edit')

    dashboardMaior.style.background = "var(--cor-principal)"
    btn__edit.style.visibility = 'hidden'
    btn__remove.style.visibility = 'hidden'

    const fundo = dashboardMaior.parentNode
    fundo.style.backgroundImage = 'none'
}

//função ao entrar no dashboard
const dashboardMouseenter = (evento) => {
    const dashboardAcessado = evento.target
    const btn__remove = dashboardAcessado.querySelector('.remove')
    const btn__edit = dashboardAcessado.querySelector('.edit')
    const cidade = dashboardAcessado.querySelector('#cidade').innerText

    dashboardAcessado.style.background = "black"
    btn__edit.style.visibility = 'visible'
    btn__remove.style.visibility = 'visible'


    const fundo = dashboardAcessado.parentNode
    const apiUnsplash = `https://source.unsplash.com/1600x900/?`
    fundo.style.backgroundImage = `url("${apiUnsplash + cidade}")`;

}



//cria todos os objetos armazenados no localStorage
cidades.forEach(elemento => {
    climaElemento(elemento)
});


//busca os dados na API
const consultaClima = async (cidade) => {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`

    const response = await fetch(apiUrl)
    const data = await response.json()

    return data;

}


//busca os dados de poluicao
const poluição = async (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}
    `
    const response = await fetch(apiUrl)
    const data = await response.json()

    return data;
}


//transformando o JSON da API em um objeto 
const clima = async (cidade) => {

    try {
        const data = await consultaClima(cidade)
        const dataPoluicao = await poluição(data.coord.lat, data.coord.lon)

        const cidadeAtual = {
            "nome": data.name,
            "temperatura": parseInt(data.main.temp),
            "condicao": data.weather[0].description,
            "bandeira": `https://flagsapi.com/${data.sys.country}/flat/64.png`,
            "icone": `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            "umidade": data.main.humidity + '%',
            "vento": `${data.wind.speed}km/h`,
            "id": cidades[cidades.length - 1] ? (cidades[cidades.length - 1]).id + 1 : 0,
            "indicePoluicao": dataPoluicao.list[0].main.aqi
        }

        climaElemento(cidadeAtual)

        //subindo a pessoa nova para o array de pessoas
        cidades.push(cidadeAtual)

        //atualizando o localStorage
        localStorage.setItem("cidades", JSON.stringify(cidades))
    } catch {
        const modal = document.querySelector('.ParteDeForaModal')
        modal.style.display = 'block'

    }

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
    <div class="dashboard" id="${cidade.id}">
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

    const listaClima = document.querySelector('.Fundo__dashboard')

    listaClima.innerHTML = novoClima + listaClima.innerHTML

    adicionandoEvento()
}


const modal = document.querySelector('.ParteDeForaModal')

//ativando a busca com o botão
btn__procurar.addEventListener("click", (evento) => {
    evento.preventDefault();
    const cidade = input.value;
    let existe
    console.log(cidades)


    clima(cidade)


    modal.style.display = 'none'
    input.value = ""


    // for (let i = 0; i < cidades.length; i++) {
    //     const verifica = (item) => {
    //         cidades[i].nome.includes(item) ? existe = true : existe = false;
    //     }
    //     verifica(cidade)
    // }
    // console.log(existe)

    // if (existe === true) {
    //     modal.style.display = 'flex'
    // }
    // else {
    //     clima(cidade)

    //     modal.style.display = 'none'
    //     input.value = ""
    // }

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



