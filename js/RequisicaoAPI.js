import {abrirModal} from "RequisicaoAPI.js";

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

btn__procurar.addEventListener("click", (evento) =>{
evento.preventDefault();

const cidade = input.value;

clima(cidade)

})
//funções

//busca os dados na API
const consultaClima = async(cidade) =>{
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`

    const response = await fetch(apiUrl)
    const data = await response.json()
    
    return data;
}

//modifica o DOM com os dados transformado em JSON da API
const clima = async(cidade) => {
    const data = await consultaClima(cidade)

    cidadeElemento.innerText = data.name;
    temperatura.innerText = parseInt(data.main.temp);
    condicao.innerText = data.weather[0].description;
    icone.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    bandeira.setAttribute("src", `https://flagsapi.com/${data.sys.country}/flat/64.png`);
    umidade.innerText = data.main.humidity + '%';
    console.log(umidade)
    vento.innerText = `${data.wind.speed}km/h`
}   

input.addEventListener("keyup", evento =>{

    if(evento.code == "Enter"){

    }
})




