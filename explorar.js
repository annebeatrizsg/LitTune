
/* ================================= */
/* MODO CLARO E ESCURO */
/* ================================= */

const botaoTema = document.getElementById("botao-tema");

function atualizarTema() {
    const temaSalvo = localStorage.getItem("tema");
    const modoEscuro = temaSalvo === "escuro";

    document.body.classList.toggle("modo-escuro", modoEscuro);

    if (botaoTema) {
        botaoTema.innerHTML = modoEscuro
            ? '<i data-lucide="sun" class="icone-tema"></i>'
            : '<i data-lucide="moon" class="icone-tema"></i>';

        botaoTema.setAttribute(
            "aria-label",
            modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"
        );
    }

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

        const correspondeTipo =
            filtroAtual === "ambos" || tipo === filtroAtual;

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
            historiasEncontradas++;
        }
    });

    mensagemVazia.style.display =
        historiasEncontradas === 0 ? "block" : "none";
}


/* ================================= */
/* FILTROS DE LIVROS E FANFICS */
/* ================================= */

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


/* ================================= */
/* FILTROS POR GÊNERO */
/* ================================= */

botoesGenero.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const generoSelecionado = botao.dataset.genero;

        if (generoAtual === generoSelecionado) {

            generoAtual = "todos";

            botao.classList.remove("ativo");

        } else {

            botoesGenero.forEach(function (item) {
                item.classList.remove("ativo");
            });

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
/* SISTEMA DE FAVORITOS */
/* ================================= */

const chaveFavoritos = "litTuneFavoritos";
const chaveDadosFavoritos = "litTuneHistoriasFavoritas";


function carregarFavoritos() {

    try {
        return JSON.parse(
            localStorage.getItem(chaveFavoritos)
        ) || [];

    } catch (erro) {
        return [];
    }
}


function salvarFavoritos(favoritos) {

    localStorage.setItem(
        chaveFavoritos,
        JSON.stringify(favoritos)
    );
}


function atualizarBotaoFavorito(botao, id) {

    const favoritos = carregarFavoritos();

    const estaFavorito = favoritos.includes(id);

    botao.innerHTML = estaFavorito
        ? '<i data-lucide="heart" fill="currentColor"></i>'
        : '<i data-lucide="heart"></i>';

    botao.setAttribute(
        "aria-label",
        estaFavorito
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
    );

    botao.title = estaFavorito
        ? "Remover dos favoritos"
        : "Adicionar aos favoritos";

    if (window.lucide) {
        lucide.createIcons();
    }
}


function criarBotoesFavoritos() {

    historias.forEach(function (card) {

        const capa = card.querySelector(".capa");

        const titulo = card.querySelector("h3").textContent.trim();

        const tipo = card.querySelector(".tipo").textContent.trim();

        const autor = card.querySelector(".info-explorar p")
            .textContent.replace("Por:", "").trim();

        const genero = card.dataset.genero;

        const id = "explorar-" + [titulo, tipo, autor].join("-");

        if (!capa) {
            return;
        }

        // Prepara a capa para receber o botão
        capa.style.position = "relative";

        // Cria o botão de favorito
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "botao-favorito-explorar";

        botao.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 5;
            width: 38px;
            height: 38px;
            border: 1px solid var(--borda);
            border-radius: 50%;
            background: var(--cartao);
            color: var(--caramelo);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
        `;

        botao.addEventListener("mouseenter", function () {
            botao.style.transform = "scale(1.1)";
        });

        botao.addEventListener("mouseleave", function () {
            botao.style.transform = "scale(1)";
        });

        // Impede que clicar no coração abra a história
        botao.addEventListener("click", function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            let favoritos = carregarFavoritos();

            if (favoritos.includes(id)) {

                favoritos = favoritos.filter(
                    item => item !== id
                );

            } else {

                favoritos.push(id);
            }

            salvarFavoritos(favoritos);

            // Salva os dados completos da história
            let dadosSalvos = [];

            try {
                dadosSalvos = JSON.parse(
                    localStorage.getItem(chaveDadosFavoritos)
                ) || [];

            } catch (erro) {
                dadosSalvos = [];
            }

            if (favoritos.includes(id)) {

                const dadosHistoria = {
                    id: id,
                    titulo: titulo,
                    tipo: tipo,
                    autor: autor,
                    sinopse: "Uma história de " + genero +
                        " para descobrir.",
                    genero: genero,
                    origem: "explorar"
                };

                const jaExiste = dadosSalvos.some(
                    historia => historia.id === id
                );

                if (!jaExiste) {
                    dadosSalvos.push(dadosHistoria);
                }

            } else {

                dadosSalvos = dadosSalvos.filter(
                    historia => historia.id !== id
                );
            }

            localStorage.setItem(
                chaveDadosFavoritos,
                JSON.stringify(dadosSalvos)
            );

            atualizarBotaoFavorito(botao, id);
        });

        capa.appendChild(botao);

        atualizarBotaoFavorito(botao, id);
    });
}


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
            card.querySelector(".info-explorar p")
                .textContent.replace("Por:", "").trim();

        const genero =
            card.dataset.genero;

        const capa = card.querySelector(".capa");

        const classeCapa = Array.from(capa.classList)
            .find(classe => classe.startsWith("capa-"));

        const parametros = new URLSearchParams({
            titulo: titulo,
            tipo: tipo,
            autor: autor,
            descricao: "Uma história de " + genero +
                " para descobrir.",
            capa: classeCapa
        });

        window.location.href =
            "leitura.html?" + parametros.toString();
    }

    card.addEventListener("click", abrirHistoria);

    card.addEventListener("keydown", function (evento) {

        // Não abre a história quando o foco está no botão de favorito
        if (evento.target !== card) {
            return;
        }

        if (evento.key === "Enter" || evento.key === " ") {

            evento.preventDefault();

            abrirHistoria();
        }
    });
});


/* ================================= */
/* INICIALIZAÇÃO */
/* ================================= */

criarBotoesFavoritos();

lucide.createIcons();

filtrarHistorias();

console.log("Explorar carregado com sucesso!");
