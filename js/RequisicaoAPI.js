

//62f0613f0cd845b6a9eb49f41db94d82

//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=62f0613f0cd845b6a9eb49f41db94d82

//https://api.openweathermap.org/data/2.5/weather?id=524901&lang=fr&appid=62f0613f0cd845b6a9eb49f41db94d82

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
    catch (erro) {
        console.log(erro.message)
    }

}

//transformando o JSON da API em um objeto 
const clima = async (cidade) => {

    const data = await consultaClima(cidade)

    const cidadeAtual = {
        "nome":data.name,
        "temperatura":parseInt(data.main.temp),
        "condicao":data.weather[0].description,
        "bandeira": `https://flagsapi.com/${data.sys.country}/flat/64.png`,
        "icone":`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        "umidade":data.main.humidity + '%',
        "vento":`${data.wind.speed}km/h`
    }


    //adicionando id para as cidades
    cidadeAtual.id = cidades[cidades.lenght -1] ? (cidades[cidades.length - 1]).id + 1 : 0;
    
    climaElemento(cidadeAtual)

    //subindo a pessoa nova para o array de pessoas
    cidades.push(cidadeAtual)

    //atualizando o localStorage
    localStorage.setItem("cidades", JSON.stringify(cidades))
}


//criando elemento cidades
function climaElemento (cidade) {
    const novoClima = `
    <div class="dashboard">
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



