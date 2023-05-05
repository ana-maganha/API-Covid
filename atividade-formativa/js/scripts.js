async function carregarDados() {

    //Chamando a API para obter dados
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries') //Chamando o endereço da API
        .then(response => response.json()) //Obtendo a resposta e formata o texto com o JSON
        .then(dados => prepararDados(dados)) //Chamando função para gerar HTML dinâmico
        .catch(e => exibirErro(e.message))
}

//////////////////////////////////////////////////////
google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharMapa);

function desenharMapa() {
    let data = google.visualization.arrayToDataTable(dadosmapa);

    let options = {
        //region: 'BR' //pegar uma região específica para mostrar no mapa
        colorAxis: { colors: ['palegreen', 'springgreen', 'darkslategray'] },
        backgroundColor: '#5271ff'
    };

    let chart = new google.visualization.GeoChart(document.getElementById('mapa-paises'));

    chart.draw(data, options);
}

//function para obter dados

function prepararDados(dados) {

    if (dados['data'].length > 0) {
        dadosmapa = [
            ['País', 'Casos de Covid-19']
        ];

        let totalCasos = 0;
        let totalMortos = 0;
        let totalRecuperados = 0;

        for (let i = 0; i < dados['data'].length; i++) {
            dadosmapa.push([dados['data'][i].country, dados['data'][i].confirmed]);
            totalCasos = totalCasos + dados['data'][i].confirmed;
            totalMortos = totalMortos + dados['data'][i].deaths;
        }

        console.log(dadosmapa);
        desenharMapa();

        // Inserindo os totais acumulados no gráficos de pizza
        pizza.push(['Confirmados', totalCasos])
        pizza.push(['Mortes', totalMortos])
        pizza.push(['Recuperados', totalRecuperados])

        desenhandoGraficoPizza();
    }
}

var dadosmapa = [
    ['País', 'Casos de Covid-19'],
    ['0', 0]
];

var pizza = [
    ['Status', 'Total'],
    ['0', 0]
];

//**********Gráfico de Pizza  - Totais Mundiais *****************/
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenhandoGraficoPizza);

function desenhandoGraficoPizza() {

    let data = google.visualization.arrayToDataTable(pizza);

    let options = {
        is3D: true,
        slices: {
            0: { color: 'red' },
            1: { color: 'darkslategray' },
            2: { color: 'palegreen' },
          }
           
    };

    let chart = new google.visualization.PieChart(document.getElementById('pizza'));

    chart.draw(data, options);
}


//////////////////////**********TABELA************//////////////////////////////
async function carregarDados2() {

    //Chamando a API para obter dados
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1') //Chamando o endereço da API
        .then(response => response.json()) //Obtendo a resposta e formata o texto com o JSON
        .then(dados => prepararDadosTabela(dados)) //Chamando função para gerar HTML dinâmico
}
/////////////////////////////Tabela - Dados por UF/////////////////////////
function prepararDadosTabela(dados) {

    //variavel para manipular o tbody do html
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    //laço For para percorrer todos os dados recebidos
    for (let i = 0; i < dados['data'].length; i++) {
        let auxLinha = '';

        //Continuar inserindo o código e o nome da moeda
        auxLinha = auxLinha + '<tr>' +
            '<td class="sumir">' + dados['data'][i].uf + '</td>' +
            '<td>' + dados['data'][i].state + '</td>' +
            '<td>' + dados['data'][i].cases + '</td>' +
            '<td>' + dados['data'][i].deaths + '</td>' +
            '<td class="sumir">' + dados['data'][i].suspects + '</td>' +
            '<td class="sumir">' + dados['data'][i].refuses + '</td>' +
            '</tr>'

        //Inserindo o HTML gerado (linha) no innerHTML da Tbody
        linhas.innerHTML = linhas.innerHTML + auxLinha;
    }
}

////////////////////////////////////////////////

function exibirErro(mensagem){
    let divErro = document.getElementById('div-erro');
    divErro.innerHTML = '<b>Erro ao acessar a API <b> <br />' + mensagem; //vai aparecer a mensagem de erro
    divErro.style.display = 'block' //vai aparecer a div
}

/////////////////
document.addEventListener("DOMContentLoaded",
    function (event) {
        carregarDados();
        carregarDados2();
    }
);

