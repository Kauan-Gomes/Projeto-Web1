

//62f0613f0cd845b6a9eb49f41db94d82

//https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=62f0613f0cd845b6a9eb49f41db94d82

//https://api.openweathermap.org/data/2.5/weather?id=524901&lang=fr&appid=62f0613f0cd845b6a9eb49f41db94d82


const apiKey = '62f0613f0cd845b6a9eb49f41db94d82';


//variaveis modal
const cidadeElemento = document.querySelector('#cidade')
const temperatura = document.querySelector('#temperatura span')
const condicao = document.querySelector('#condicao')
const icone = document.querySelector('#icone')
const umidade = document.querySelector('#umidade')
const vento = document.querySelector('#vento span')
const bandeira = document.querySelector('#bandeira')

// console.log(cidadeElemento)
// console.log(temperatura)
// console.log(condicao)
// console.log(icone)
//console.log(umidade.innerText)
// console.log(vento)
// console.log(bandeira)

// variaveis de input e botao procurar
const input = document.querySelector('#input-cidade')
const btn__procurar = document.querySelector('#search')


//funções

//busca os dados na API
const consultaClima = async (cidade) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`

    try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        return data;

    } catch (error) {
        alert(error)
    }
}

//modifica o DOM com os dados transformado em JSON da API
const clima = async (cidade) => {
    const data = await consultaClima(cidade)

    const novaCidade = data.name;
    const novaTemperatura = parseInt(data.main.temp);
    const novaCondicao = data.weather[0].description;
    const novaBandeira = `https://flagsapi.com/${data.sys.country}/flat/64.png`
    const novaIcone = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    const novaUmidade = data.main.humidity + '%';
    const novoVento= `${data.wind.speed}km/h`

    const novoClima = `
    <div class="dashboard">
                <div class="dashboard__principal">
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <span id="cidade">${novaCidade}</span>
                        <img src="${novaBandeira}" >
                    </div>
                    <p class="temperatura" ><span>${novaTemperatura}</span>&deg;C</p>
                </div>

                <div class="dashboard__descricao">
                    <p> ${novaCondicao}</p>
                    <img src="${novaIcone}">
                </div>
                <div class="dashboard__detalhes">
                    <p class="umidade">
                        <i class="fa-solid fa-droplet"></i>
                        <span>${novaUmidade}</span>
                    </p>
                    <p>
                        <i class="fa-solid fa-wind"></i>
                        <span>${novoVento}</span>
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

})
//ativando a busca ao pressionar enter no input
input.addEventListener("keyup", evento => {
    evento.preventDefault();
    if (evento.code == "Enter") {

        const cidade = evento.target.value
        clima(cidade)

        modal.style.display = 'none'

    }
})



