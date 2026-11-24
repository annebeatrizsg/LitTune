
/* ================================= */
/* MODO CLARO E ESCURO */
/* ================================= */

const botaoTema = document.getElementById("botao-tema");

// Recupera o tema salvo
const temaSalvo = localStorage.getItem("tema");

// Aplica o tema salvo
if (temaSalvo === "escuro") {
    document.body.classList.add("modo-escuro");

    botaoTema.innerHTML =
        '<i data-lucide="sun" class="icone-tema"></i>';

    botaoTema.setAttribute("aria-label", "Ativar modo claro");
}

// =================================
// FILTROS DE LIVROS E FANFICS
// =================================

const botoesFiltro = document.querySelectorAll(".filtro");
const historias = document.querySelectorAll(".card-historia");

let filtroAtual = "ambos";

function filtrarHistorias() {

    const pesquisa = document
        .getElementById("campo-pesquisa")
        .value
        .toLowerCase()
        .trim();

    let recomendacoesEncontradas = 0;

    historias.forEach(function (historia) {

        const tipo = historia.dataset.type;
        const texto = historia.textContent.toLowerCase();

        const correspondeTipo =
            filtroAtual === "ambos" || tipo === filtroAtual;

        const correspondePesquisa =
            texto.includes(pesquisa);

        const mostrar =
            correspondeTipo && correspondePesquisa;

        historia.style.display = mostrar ? "" : "none";

        if (
            mostrar &&
            historia.closest("#lista-recomendados")
        ) {
            recomendacoesEncontradas++;
        }

    });

    const mensagemVazia =
        document.getElementById("mensagem-vazia");

    mensagemVazia.style.display =
        recomendacoesEncontradas === 0 ? "block" : "none";
}


// Clique nos filtros
botoesFiltro.forEach(function (botao) {

    botao.addEventListener("click", function () {

        botoesFiltro.forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        filtroAtual = botao.dataset.filtro;

        filtrarHistorias();

    });

});


// =================================
// CAMPO DE PESQUISA
// =================================

const campoPesquisa =
    document.getElementById("campo-pesquisa");

campoPesquisa.addEventListener("input", function () {
    filtrarHistorias();
});


// =================================
// BOTÃO DE TEMA
// =================================

botaoTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-escuro");

    const modoEscuro =
        document.body.classList.contains("modo-escuro");

    if (modoEscuro) {

        localStorage.setItem("tema", "escuro");

        botaoTema.innerHTML =
            '<i data-lucide="sun" class="icone-tema"></i>';

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo claro"
        );

    } else {

        localStorage.setItem("tema", "claro");

        botaoTema.innerHTML =
            '<i data-lucide="moon" class="icone-tema"></i>';

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo escuro"
        );

    }

    lucide.createIcons();

});


/* ================================= */
/* ABRIR LIVROS E FANFICS */
/* ================================= */

const todosOsCards = document.querySelectorAll(".card-historia");

todosOsCards.forEach(function (card) {

    card.style.cursor = "pointer";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");

    function abrirHistoria() {

        const titulo = card.querySelector(".informacoes h3").textContent;

        const tipo = card.querySelector(".tipo").textContent;

        const informacao = card.querySelector(".informacoes p").textContent;

        const capa = card.querySelector(".capa");

        let autor = "Autor(a) independente";
        let descricao = informacao;

        if (informacao.startsWith("Por:")) {
            autor = informacao.replace("Por:", "").trim();
            descricao = "Uma história para descobrir.";
        }

        const classeCapa = Array.from(capa.classList)
            .find(classe => classe.startsWith("capa-"));

        const parametros = new URLSearchParams({
            titulo: titulo,
            tipo: tipo,
            autor: autor,
            descricao: descricao,
            capa: classeCapa,
            origem: "exemplo"
        });

        window.location.href = "leitura.html?" + parametros.toString();
    }

    card.addEventListener("click", abrirHistoria);

    card.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirHistoria();
        }
    });

});


// =================================
// INICIALIZAÇÃO
// =================================

// Ativa os ícones Lucide
lucide.createIcons();

// Executa os filtros inicialmente
filtrarHistorias();

console.log("LitTune carregado com sucesso!");
