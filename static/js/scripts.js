formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // buscar pelo código do fundo no backend e adicionar nas variáveis
    const codigoFii = document.getElementById("codigoFii").value.toLowerCase();

    if (!codigoFii) {
        alert('Por favor, insira o código de um FII.');
        return;
    }


    const CampoQuantidadeCotas = document.getElementById("quantidadeCotas").value;
    const CampoRetornoMensal = document.getElementById("retornoMensal").value;
    const CampoTotalInvestido = document.getElementById("totalInvestido").value;

    if (!CampoQuantidadeCotas && !CampoRetornoMensal && !CampoTotalInvestido) {
        alert('Por favor, preencha pelo menos um dos campos: "Quantidade de cotas" , "Retorno mensal" ou "Valor para investir".');
        return;
    }

    try {
        const resposta = await fetch(`http://127.0.0.1:5000/dados-fii/${codigoFii}`);
        const dados = await resposta.json();

        if (dados.preco == 'Preço não encontrado' && dados.dividendo == 'Dividendo não encontrado') {
            alert('Fundo imobiliário não encontrado');
            return
        }



        let precoAtualFii = parseFloat(dados.preco.replace(",", ".")).toFixed(2);  // mantém como string
        let ultimoDividendo = parseFloat(dados.dividendo.replace(",", ".")).toFixed(2) // mantém como string

        let quantidadeCotas = parseInt(document.getElementById("quantidadeCotas").value);
        let retornoMensal = parseFloat(document.getElementById("retornoMensal").value.replace(/\./g, '').replace(',', '.'));

        let valorTotalInvestido = parseFloat(document.getElementById("totalInvestido").value.replace(/\./g, '').replace(',', '.'));


        // Verifica se os valores são válidos
        if (isNaN(quantidadeCotas)) quantidadeCotas = 0;
        if (isNaN(retornoMensal)) retornoMensal = 0.00;
        if (isNaN(valorTotalInvestido)) valorTotalInvestido = 0.00;


        if (quantidadeCotas > 0) {

            valorTotalInvestido = precoAtualFii * quantidadeCotas;

            retornoMensal = ultimoDividendo * quantidadeCotas;

        } else if (retornoMensal > 0) {
            quantidadeCotas = Math.ceil(retornoMensal / ultimoDividendo);

            valorTotalInvestido = precoAtualFii * parseFloat(quantidadeCotas);

        } else if (valorTotalInvestido > 0) {
            console.log(valorTotalInvestido)
            quantidadeCotas = Math.ceil(valorTotalInvestido / precoAtualFii);


            retornoMensal = ultimoDividendo * quantidadeCotas;

        } else {
            quantidadeCotas = 0;
            valorTotalInvestido = 0;
            retornoMensal = 0;
        }

        // Exibição dos resultados
        document.getElementById("valor-atual-fundo").innerHTML = `R$ ${precoAtualFii.toString().replace(".", ",")}`;

        document.getElementById("ultimo-dividendo-pago").innerHTML = `R$ ${ultimoDividendo.toString().replace(".", ",")}`;

        document.getElementById("valor-investido").innerHTML = `R$ ${valorTotalInvestido.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        document.getElementById("quantidade-cotas").innerHTML = `${quantidadeCotas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        document.getElementById("retorno-mensal").innerHTML = `R$ ${retornoMensal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao buscar os dados.');
    }

    // Mostrar modal
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("overlay").classList.add("show");
    document.getElementById("resultados-container").classList.remove("hidden");
    document.getElementById("resultados-container").classList.add("show");
});

// ----------------------------------------------------------------------------

function formatarNumero(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarValorMonetario(id) {
    var campo = document.getElementById(id);
    var valor = campo.value;

    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    // Adiciona o ponto decimal (caso haja valor)
    if (valor.length > 2) {
        valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    }

    // Adiciona os separadores de milhar
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    campo.value = valor;
}

function ativarUpperCase(id) {
    var campo = document.getElementById(id);
    var valor = campo.value;

    valor = valor.toUpperCase();

    campo.value = valor;
}

function verificarCampoCalculo() {
    var quantidadeCotas = document.getElementById("quantidadeCotas").value;
    var retornoMensal = document.getElementById("retornoMensal").value;
    var totalInvestido = document.getElementById("totalInvestido").value;

    if (quantidadeCotas) {
        document.getElementById("retornoMensal").disabled = true;
        document.getElementById("totalInvestido").disabled = true;
    } else if (retornoMensal) {
        document.getElementById("quantidadeCotas").disabled = true;
        document.getElementById("totalInvestido").disabled = true;
    } else if (totalInvestido) {
        document.getElementById("quantidadeCotas").disabled = true;
        document.getElementById("retornoMensal").disabled = true;
    } else {
        document.getElementById("quantidadeCotas").disabled = false;
        document.getElementById("retornoMensal").disabled = false;
        document.getElementById("totalInvestido").disabled = false;
    }
}

// ----------------------------------------------------------------------------

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById("valorAtualFundo").value = "";
    document.getElementById("quantidadeFundo").value = "";
    document.getElementById("valorEsperadoFundo").value = "";

    document.getElementById("resultado-valor-total-atual").innerHTML = "R$ 0,00";
    document.getElementById("resultado-valor-total-esperado").innerHTML = "R$ 0,00";
    document.getElementById("lucro-adquirido").innerHTML = "R$ 0,00";
    document.getElementById("cotas-para-venda").innerHTML = "";
    document.getElementById("resumo").innerHTML = "Nenhum cálculo realizado.";
}

// ----------------------------------------------------------------------------

// Função para fechar a modal
function fecharModal() {
    document.getElementById("overlay").classList.remove("show");
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("resultados-container").classList.remove("show");
    document.getElementById("resultados-container").classList.add("hidden");
}

