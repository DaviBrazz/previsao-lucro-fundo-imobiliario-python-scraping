const formulario = document.getElementById("formulario");

// ------------------- Funções auxiliares existentes -------------------
function formatarNumero(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarValorMonetario(id) {
    var campo = document.getElementById(id);
    var valor = campo.value;

    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    // Adiciona o ponto decimal
    if (valor.length > 2) {
        valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    }

    // Adiciona os separadores de milhar
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    campo.value = valor;
}

function ativarUpperCase(id) {
    var campo = document.getElementById(id);
    campo.value = campo.value.toUpperCase();
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

function fecharModal() {
    document.getElementById("overlay").classList.replace("show", "hidden");
    document.getElementById("resultados-container").classList.replace("show", "hidden");
}

// ------------------- Submit do formulário -------------------
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigoFii = document.getElementById("codigoFii").value.toUpperCase().trim();
    const quantidadeCotas = parseInt(document.getElementById("quantidadeCotas").value) || 0;
    const retornoMensal = parseFloat(document.getElementById("retornoMensal").value.replace(/\./g, '').replace(',', '.')) || 0;
    const valorInvestido = parseFloat(document.getElementById("totalInvestido").value.replace(/\./g, '').replace(',', '.')) || 0;

    // Validações
    if (!codigoFii) {
        alert('Por favor, insira o código de um FII.');
        return;
    }

    if (!quantidadeCotas && !retornoMensal && !valorInvestido) {
        alert('Por favor, preencha pelo menos um dos campos: "Quantidade de cotas", "Retorno mensal" ou "Valor para investir".');
        return;
    }

    try {
        const resposta = await fetch('https://previsao-fundos-imobiliarios.onrender.com/dados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo_fii: codigoFii,
                quantidade_cotas: quantidadeCotas,
                retorno_mensal: retornoMensal,
                valor_investido: valorInvestido
            })
        });


        if (!resposta.ok) {
            const err = await resposta.json().catch(() => ({}));
            alert(err?.erro || 'Erro ao buscar os dados.');
            return;
        }

        const r = await resposta.json();

        // Atualiza HTML com resultados
        document.getElementById("valor-atual-fundo").innerText = `R$ ${r.valor_atual_fundo.toFixed(2).replace('.', ',')}`;
        document.getElementById("ultimo-dividendo-pago").innerText = `R$ ${r.ultimo_dividendo.toFixed(2).replace('.', ',')}`;
        document.getElementById("valor-investido").innerText = `R$ ${r.valor_investido.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        document.getElementById("quantidade-cotas").innerText = `${r.quantidade_cotas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
        document.getElementById("retorno-mensal").innerText = `R$ ${r.retorno_mensal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

        // Mostrar modal
        document.getElementById("overlay").classList.replace("hidden", "show");
        document.getElementById("resultados-container").classList.replace("hidden", "show");

    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao buscar os dados.');
    }
});

// Gerar PDF
document.getElementById("imprimir-modal").addEventListener("click", () => {
    // Importando jsPDF (modo compatível)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dados da modal
    const dados = [
        ["Campo", "Valor"],
        ["Código do Fundo", document.getElementById("codigoFii").value.toUpperCase()],
        ["Valor atual do fundo", document.getElementById("valor-atual-fundo").innerText],
        ["Último dividendo pago", document.getElementById("ultimo-dividendo-pago").innerText],
        ["Valor total investido", document.getElementById("valor-investido").innerText],
        ["Quantidade de cotas", document.getElementById("quantidade-cotas").innerText],
        ["Retorno mensal", document.getElementById("retorno-mensal").innerText]
    ];

    // Gerar tabela com autoTable
    doc.autoTable({
        head: [dados[0]],
        body: dados.slice(1),
        startY: 20,
        styles: { halign: 'center' },
        headStyles: { fillColor: [60, 176, 255], textColor: 255 },
    });

    doc.setFontSize(18);
    doc.text("Relatório de Investimento FII", 105, 15, { align: "center" });

    doc.save(`Relatorio_FII_${document.getElementById("codigoFii").value.toUpperCase()}.pdf`);
});

(function () {
    var _0x1a2b = ["\x66\x6F\x6F\x74\x65\x72", "\x71\x75\x65\x72\x79\x53\x65\x6C\x65\x63\x74\x6F\x72", "\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74", "\x73\x74\x79\x6C\x65\x43\x73\x73\x54\x65\x78\x74", "\x62\x6F\x64\x79", "\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64", "\x68\x65\x61\x64", "\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C", "\x73\x74\x79\x6C\x65\x43\x73\x73\x54\x65\x78\x74", "\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72", "\x63\x68\x69\x6C\x64\x52\x65\x6D\x6F\x76\x65\x64\x4E\x6F\x64\x65\x73", "\x74\x61\x67\x4E\x61\x6D\x65", "\x63\x6F\x6E\x73\x6F\x6C\x65\x2E\x77\x61\x72\x6E", "\x46\x6F\x6F\x74\x65\x72\x20\x72\x65\x6D\x6F\x76\x69\x64\x6F\x21\x20\x52\x65\x69\x6E\x73\x65\x72\x69\x6E\x64\x6F\x2E\x2E\x2E"];
    function _0x2f3c() {
        if (!document[_0x1a2b[1]](_0x1a2b[0])) {
            var _0xabc = document[_0x1a2b[2]](_0x1a2b[0]);
            _0xabc[_0x1a2b[7]] = `<a href="https://www.linkedin.com/in/davi-braz-8bb09a357/" target="_blank" style="text-decoration:none;"><span class="ftxt">Desenvolvido por</span><span class="fname"> Davi Braz</span><span class="ftxt"> &copy; 2024</span></a>`;
            _0xabc[_0x1a2b[3]] = "text-align:center;padding:10px 0;font-size:14px;position:fixed;bottom:0;left:0;width:100%;background-color:#1c1c3b;z-index:1000;";
            document[_0x1a2b[4]][_0x1a2b[5]](_0xabc);
            var _0xdef = document[_0x1a2b[2]]("style");
            _0xdef[_0x1a2b[7]] = ".ftxt{color:#fff;transition:color .3s}.fname{color:#3cb0ff;font-weight:bold;transition:color .3s}footer a:hover .ftxt{color:#ddd}footer a:hover .fname{color:#7fd1ff}footer a{cursor:pointer}";
            document[_0x1a2b[6]][_0x1a2b[5]](_0xdef);
        }
    }
    function _0x4d5e() { new MutationObserver(function (_0x9f) { _0x9f.forEach(function (_0x7a) { _0x7a[_0x1a2b[10]][_0x1a2b[11]].forEach(function (_0x6b) { _0x6b[_0x1a2b[12]] === _0x1a2b[0] && (console[_0x1a2b[13]](_0x1a2b[14]), _0x2f3c()) }) }) }).observe(document[_0x1a2b[4]], { childList: true, subtree: true }) }
    _0x2f3c(), _0x4d5e();
})();

