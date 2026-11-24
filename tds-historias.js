
// =================================
// MODO CLARO E ESCURO
// =================================

const botaoTema = document.getElementById("botao-tema");

function atualizarTema() {
    const temaSalvo = localStorage.getItem("tema");
    const modoEscuro = temaSalvo === "escuro";

    document.body.classList.toggle("modo-escuro", modoEscuro);

    if (botaoTema) {
        botaoTema.innerHTML = modoEscuro
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';

        botaoTema.setAttribute(
            "aria-label",
            modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"
        );
    }

    atualizarIcones();
}

function atualizarIcones() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

atualizarTema();

if (botaoTema) {
    botaoTema.addEventListener("click", function () {
        const modoEscuro =
            document.body.classList.contains("modo-escuro");

        localStorage.setItem(
            "tema",
            modoEscuro ? "claro" : "escuro"
        );

        atualizarTema();
    });
}


// =================================
// ELEMENTOS DA PÁGINA
// =================================

const campoPesquisa = document.getElementById("pesquisa-catalogo");

const botoesTipo = document.querySelectorAll(".filtro-tipo");

const botoesGenero = document.querySelectorAll(".genero-catalogo");

const historias = document.querySelectorAll(".historia-catalogo");

const semResultados = document.getElementById("sem-resultados");

const quantidadeResultados =
    document.getElementById("quantidade-resultados");

const tituloResultados =
    document.getElementById("titulo-resultados");


// =================================
// VARIÁVEIS DOS FILTROS
// =================================

let tipoAtual = "todos";
let generoAtual = "todos";


// =================================
// NORMALIZAR TEXTO
// =================================

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// =================================
// PESQUISA E FILTROS
// =================================

function filtrarHistorias() {

    const pesquisa = normalizarTexto(campoPesquisa.value);

    let quantidade = 0;

    historias.forEach(function (historia) {

        const tipo = historia.dataset.tipo;
        const genero = historia.dataset.genero;

        const texto = normalizarTexto(historia.textContent);

        const correspondeTipo =
            tipoAtual === "todos" || tipo === tipoAtual;

        const correspondeGenero =
            generoAtual === "todos" || genero === generoAtual;

        const correspondePesquisa =
            texto.includes(pesquisa);

        const mostrar =
            correspondeTipo &&
            correspondeGenero &&
            correspondePesquisa;

        historia.style.display = mostrar ? "" : "none";

        if (mostrar) {
            quantidade++;
        }
    });

    quantidadeResultados.textContent =
        quantidade === 1
            ? "1 história encontrada"
            : quantidade + " histórias encontradas";

    semResultados.style.display =
        quantidade === 0 ? "block" : "none";

    if (generoAtual === "todos") {
        tituloResultados.textContent = "Histórias para descobrir";
    } else {
        const generoSelecionado = Array.from(botoesGenero)
            .find(function (botao) {
                return botao.dataset.genero === generoAtual;
            });

        tituloResultados.textContent = generoSelecionado
            ? "Histórias de " + generoSelecionado.textContent.trim()
            : "Histórias para descobrir";
    }
}


// =================================
// FILTRO DE LIVROS E FANFICS
// =================================

botoesTipo.forEach(function (botao) {

    botao.addEventListener("click", function () {

        botoesTipo.forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        tipoAtual = botao.dataset.tipo;

        filtrarHistorias();
    });
});


// =================================
// FILTRO POR GÊNERO
// =================================

botoesGenero.forEach(function (botao) {

    botao.addEventListener("click", function () {

        botoesGenero.forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        generoAtual = botao.dataset.genero;

        filtrarHistorias();
    });
});


// =================================
// CAMPO DE PESQUISA
// =================================

campoPesquisa.addEventListener("input", function () {
    filtrarHistorias();
});


// =================================
// INICIALIZAÇÃO
// =================================

atualizarIcones();
filtrarHistorias();

console.log("Catálogo LitTune carregado!");