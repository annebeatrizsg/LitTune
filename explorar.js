
/* ================================= */
/* MODO CLARO E ESCURO */
/* ================================= */

const botaoTema = document.getElementById("botao-tema");

function atualizarTema() {
    const temaSalvo = localStorage.getItem("tema");
    const modoEscuro = temaSalvo === "escuro";

    document.body.classList.toggle("modo-escuro", modoEscuro);

    if (modoEscuro) {
        botaoTema.innerHTML =
            '<i data-lucide="sun" class="icone-tema"></i>';

        botaoTema.setAttribute("aria-label", "Ativar modo claro");
    } else {
        botaoTema.innerHTML =
            '<i data-lucide="moon" class="icone-tema"></i>';

        botaoTema.setAttribute("aria-label", "Ativar modo escuro");
    }

    lucide.createIcons();
}

atualizarTema();

botaoTema.addEventListener("click", function () {
    const modoEscuro =
        document.body.classList.contains("modo-escuro");

    localStorage.setItem("tema", modoEscuro ? "claro" : "escuro");

    atualizarTema();
});


/* ================================= */
/* ELEMENTOS DA PÁGINA */
/* ================================= */

const campoPesquisa = document.getElementById("pesquisa-explorar");

const botoesFiltro = document.querySelectorAll(".filtro-explorar");

const botoesGenero = document.querySelectorAll(".categoria-genero");

const historias = document.querySelectorAll(".card-explorar");

const mensagemVazia =
    document.getElementById("mensagem-vazia-explorar");


/* ================================= */
/* FILTROS E PESQUISA */
/* ================================= */

let filtroAtual = "ambos";
let generoAtual = "todos";

function filtrarHistorias() {

    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    let historiasEncontradas = 0;

    historias.forEach(function (historia) {

        const tipo = historia.dataset.type;

        const genero = historia.dataset.genero;

        const texto = historia.textContent.toLowerCase();

        // Verifica o tipo da história
        const correspondeTipo =
            filtroAtual === "ambos" || tipo === filtroAtual;

        // Verifica o gênero
        const correspondeGenero =
            generoAtual === "todos" || genero === generoAtual;

        // Verifica a pesquisa
        const correspondePesquisa =
            texto.includes(pesquisa);

        // Decide se a história será exibida
        const mostrar =
            correspondeTipo &&
            correspondeGenero &&
            correspondePesquisa;

        historia.style.display = mostrar ? "" : "none";

        if (mostrar) {
            historiasEncontradas++;
        }

    });

    // Mostra uma mensagem se não encontrar histórias
    mensagemVazia.style.display =
        historiasEncontradas === 0 ? "block" : "none";
}


/* ================================= */
/* FILTROS DE LIVROS E FANFICS */
/* ================================= */

botoesFiltro.forEach(function (botao) {

    botao.addEventListener("click", function () {

        // Remove o destaque dos outros botões
        botoesFiltro.forEach(function (item) {
            item.classList.remove("ativo");
        });

        // Destaca o botão selecionado
        botao.classList.add("ativo");

        // Atualiza o filtro
        filtroAtual = botao.dataset.filtro;

        filtrarHistorias();

    });

});


/* ================================= */
/* FILTROS POR GÊNERO */
/* ================================= */

botoesGenero.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const generoSelecionado = botao.dataset.genero;

        // Se clicar novamente no gênero, remove o filtro
        if (generoAtual === generoSelecionado) {

            generoAtual = "todos";

            botao.classList.remove("ativo");

        } else {

            // Remove o destaque dos outros gêneros
            botoesGenero.forEach(function (item) {
                item.classList.remove("ativo");
            });

            // Seleciona o novo gênero
            generoAtual = generoSelecionado;

            botao.classList.add("ativo");

        }

        filtrarHistorias();

    });

});


/* ================================= */
/* CAMPO DE PESQUISA */
/* ================================= */

campoPesquisa.addEventListener("input", function () {
    filtrarHistorias();
});


/* ================================= */
/* ABRIR HISTÓRIAS */
/* ================================= */

historias.forEach(function (card) {

    card.style.cursor = "pointer";

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");

    function abrirHistoria() {

        const titulo =
            card.querySelector("h3").textContent;

        const tipo =
            card.querySelector(".tipo").textContent;

        const autor =
            card.querySelector(".info-explorar p").textContent
                .replace("Por:", "").trim();

        const genero =
            card.dataset.genero;

        const capa = card.querySelector(".capa");

        const classeCapa = Array.from(capa.classList)
            .find(classe => classe.startsWith("capa-"));

        const parametros = new URLSearchParams({
            titulo: titulo,
            tipo: tipo,
            autor: autor,
            descricao: "Uma história de " + genero + " para descobrir.",
            capa: classeCapa
        });

        window.location.href =
            "leitura.html?" + parametros.toString();

    }

    card.addEventListener("click", abrirHistoria);

    card.addEventListener("keydown", function (evento) {

        if (evento.key === "Enter" || evento.key === " ") {

            evento.preventDefault();

            abrirHistoria();

        }

    });

});


/* ================================= */
/* INICIALIZAÇÃO */
/* ================================= */

lucide.createIcons();

filtrarHistorias();

console.log("Explorar carregado com sucesso!");
