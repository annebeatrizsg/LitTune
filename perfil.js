
/* =====================================
   CONFIGURAÇÕES E ELEMENTOS
===================================== */

const chavePerfil = "litTunePerfil";
const chaveFavoritos = "litTuneFavoritos";
const chaveDadosFavoritos = "litTuneHistoriasFavoritas";

const nomePerfil = document.getElementById("nome-perfil");
const bioPerfil = document.getElementById("bio-perfil");
const interessesPerfil = document.getElementById("interesses-perfil");

const totalLeituras = document.getElementById("total-leituras");
const totalHistorias = document.getElementById("total-historias");
const totalFavoritos = document.getElementById("total-favoritos");
const totalPlaylists = document.getElementById("total-playlists");

const gradeLeituras = document.getElementById("grade-leituras");
const gradeMinhasHistorias = document.getElementById("grade-minhas-historias");
const gradeFavoritos = document.getElementById("grade-favoritos");
const gradePlaylists = document.getElementById("grade-playlists-perfil");

const modalPerfil = document.getElementById("modal-perfil");
const botaoEditar = document.getElementById("editar-perfil");
const botaoFechar = document.getElementById("fechar-modal-perfil");
const botaoCancelar = document.getElementById("cancelar-edicao");
const botaoSalvar = document.getElementById("salvar-perfil");

const campoNome = document.getElementById("editar-nome");
const campoBio = document.getElementById("editar-bio");
const campoInteresses = document.getElementById("editar-interesses");

let historias = [];
let favoritos = [];
let historiasFavoritasExplorar = [];


/* =====================================
   DADOS DO PERFIL
===================================== */

function carregarPerfil() {

    const perfilSalvo = localStorage.getItem(chavePerfil);

    if (perfilSalvo) {
        try {
            const perfil = JSON.parse(perfilSalvo);

            nomePerfil.textContent = perfil.nome || "Meu perfil";

            bioPerfil.textContent =
                perfil.bio || "Compartilhe um pouco sobre você e seu amor por histórias.";

            mostrarInteresses(perfil.interesses || []);

        } catch (erro) {
            console.error("Erro ao carregar perfil:", erro);
        }

    } else {
        nomePerfil.textContent = "Meu perfil";
        bioPerfil.textContent =
            "Compartilhe um pouco sobre você e seu amor por histórias.";

        mostrarInteresses(["Leitura", "Escrita", "Música"]);
    }
}


function mostrarInteresses(interesses) {

    interessesPerfil.innerHTML = "";

    interesses.forEach(interesse => {

        const etiqueta = document.createElement("span");

        etiqueta.textContent = interesse;

        interessesPerfil.appendChild(etiqueta);
    });
}


/* =====================================
   EDITAR PERFIL
===================================== */

function abrirModal() {

    const perfilSalvo = localStorage.getItem(chavePerfil);

    let perfil = {
        nome: "",
        bio: "",
        interesses: ["Leitura", "Escrita", "Música"]
    };

    if (perfilSalvo) {
        try {
            perfil = {
                ...perfil,
                ...JSON.parse(perfilSalvo)
            };
        } catch (erro) {
            console.error("Erro ao abrir perfil:", erro);
        }
    }

    campoNome.value = perfil.nome || "";
    campoBio.value = perfil.bio || "";
    campoInteresses.value = (perfil.interesses || []).join(", ");

    modalPerfil.hidden = false;
}


function fecharModal() {
    modalPerfil.hidden = true;
}


function salvarPerfil() {

    const nome = campoNome.value.trim();
    const bio = campoBio.value.trim();

    const interesses = campoInteresses.value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

    if (nome === "") {
        alert("Digite seu nome antes de salvar.");
        campoNome.focus();
        return;
    }

    const perfil = {
        nome: nome,
        bio: bio,
        interesses: interesses
    };

    localStorage.setItem(chavePerfil, JSON.stringify(perfil));

    carregarPerfil();

    fecharModal();
}


/* =====================================
   CARREGAR HISTÓRIAS CRIADAS
===================================== */

function carregarHistorias() {

    try {
        historias = JSON.parse(
            localStorage.getItem("historiasLitTune")
        ) || [];

    } catch (erro) {
        historias = [];
        console.error("Erro ao carregar histórias:", erro);
    }

    mostrarMinhasHistorias();
    mostrarLeituras();
    atualizarResumo();
}


/* =====================================
   CRIAR CARTÃO DE HISTÓRIA
===================================== */

function criarCartaoHistoria(historia, mostrarBotaoFavorito = true) {

    const cartao = document.createElement("article");

    cartao.className = "cartao-historia-perfil";

    const titulo = historia.titulo || "História sem título";
    const tipo = historia.tipo || "Livro";
    const autor = historia.autor || historia.nomeAutor || "Você";
    const descricao = historia.sinopse || historia.descricao || "";

    const id = String(historia.id);

    const estaFavorito = favoritos.includes(id);

    cartao.style.cssText = `
        padding: 20px;
        background-color: var(--cartao);
        border: 1px solid var(--borda);
        border-radius: 13px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
    `;

    const tituloElemento = document.createElement("h3");
    tituloElemento.textContent = titulo;
    tituloElemento.style.cssText = `
        color: var(--texto);
        font-family: Georgia, serif;
        font-size: 19px;
        margin: 0;
    `;

    const tipoElemento = document.createElement("span");
    tipoElemento.textContent = tipo;
    tipoElemento.style.cssText = `
        color: var(--caramelo);
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;

    const autorElemento = document.createElement("small");
    autorElemento.textContent = "Por: " + autor;
    autorElemento.style.color = "var(--texto-secundario)";

    const descricaoElemento = document.createElement("p");
    descricaoElemento.textContent = descricao || "Sem descrição disponível.";
    descricaoElemento.style.cssText = `
        color: var(--texto-secundario);
        font-size: 13px;
        line-height: 1.5;
        margin: 0;
    `;

    const botoes = document.createElement("div");
    botoes.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: auto;
        padding-top: 8px;
    `;

    const botaoAbrir = document.createElement("button");
    botaoAbrir.textContent = "Abrir história";
    botaoAbrir.style.cssText = `
        padding: 9px 13px;
        background-color: var(--marrom);
        color: white;
        border: none;
        border-radius: 7px;
        cursor: pointer;
        font-size: 12px;
    `;

    botaoAbrir.addEventListener("click", () => {

        if (historia.origem === "explorar") {

            const parametros = new URLSearchParams({
                titulo: titulo,
                tipo: tipo,
                autor: autor,
                descricao: descricao,
                capa: historia.capa || "capa-livro",
                origem: "exemplo"
            });

            window.location.href =
                "leitura.html?" + parametros.toString();

        } else {

            window.location.href =
                "leitura.html?id=" + encodeURIComponent(id);
        }
    });

    botoes.appendChild(botaoAbrir);

    if (mostrarBotaoFavorito) {

        const botaoFavorito = document.createElement("button");

        botaoFavorito.textContent = estaFavorito
            ? "♥ Favorito"
            : "♡ Favoritar";

        botaoFavorito.style.cssText = `
            padding: 9px 13px;
            background-color: var(--fundo);
            color: var(--texto);
            border: 1px solid var(--borda);
            border-radius: 7px;
            cursor: pointer;
            font-size: 12px;
        `;

        botaoFavorito.addEventListener("click", () => {

            alternarFavorito(id);

            mostrarMinhasHistorias();
            mostrarFavoritos();
            atualizarResumo();
        });

        botoes.appendChild(botaoFavorito);
    }

    cartao.appendChild(tipoElemento);
    cartao.appendChild(tituloElemento);
    cartao.appendChild(autorElemento);
    cartao.appendChild(descricaoElemento);
    cartao.appendChild(botoes);

    return cartao;
}


/* =====================================
   MINHAS HISTÓRIAS
===================================== */

function mostrarMinhasHistorias() {

    gradeMinhasHistorias.innerHTML = "";

    if (historias.length === 0) {

        mostrarMensagemVazia(
            gradeMinhasHistorias,
            "feather",
            "Você ainda não criou nenhuma história."
        );

        return;
    }

    historias.forEach(historia => {

        const cartao = criarCartaoHistoria(historia);

        gradeMinhasHistorias.appendChild(cartao);
    });
}


/* =====================================
   SISTEMA DE FAVORITOS
===================================== */

function carregarFavoritos() {

    try {
        favoritos = JSON.parse(
            localStorage.getItem(chaveFavoritos)
        ) || [];

    } catch (erro) {
        favoritos = [];
    }

    try {
        historiasFavoritasExplorar = JSON.parse(
            localStorage.getItem(chaveDadosFavoritos)
        ) || [];

    } catch (erro) {
        historiasFavoritasExplorar = [];
    }

    // Mantém apenas as histórias que continuam favoritada
    historiasFavoritasExplorar =
        historiasFavoritasExplorar.filter(historia =>
            favoritos.includes(String(historia.id))
        );
}


function salvarFavoritos() {

    localStorage.setItem(
        chaveFavoritos,
        JSON.stringify(favoritos)
    );

    localStorage.setItem(
        chaveDadosFavoritos,
        JSON.stringify(historiasFavoritasExplorar)
    );
}


function alternarFavorito(id) {

    if (favoritos.includes(id)) {

        favoritos = favoritos.filter(
            favorito => favorito !== id
        );

        historiasFavoritasExplorar =
            historiasFavoritasExplorar.filter(
                historia => String(historia.id) !== id
            );

    } else {

        favoritos.push(id);
    }

    salvarFavoritos();
}


function mostrarFavoritos() {

    gradeFavoritos.innerHTML = "";

    const favoritosCriados = historias.filter(historia =>
        favoritos.includes(String(historia.id))
    );

    const favoritosExplorar = historiasFavoritasExplorar.filter(historia =>
        favoritos.includes(String(historia.id))
    );

    const todosFavoritos = [
        ...favoritosCriados,
        ...favoritosExplorar
    ];

    if (todosFavoritos.length === 0) {

        mostrarMensagemVazia(
            gradeFavoritos,
            "heart",
            "Você ainda não favoritou nenhuma história."
        );

        return;
    }

    todosFavoritos.forEach(historia => {

        const cartao = criarCartaoHistoria(historia);

        gradeFavoritos.appendChild(cartao);
    });
}


/* =====================================
   MINHAS LEITURAS
===================================== */

function mostrarLeituras() {

    gradeLeituras.innerHTML = "";

    const historiasLidas = historias.filter(historia => {

        const chave = "progresso-historia-" + historia.id;

        const progresso = localStorage.getItem(chave);

        return progresso !== null;
    });

    if (historiasLidas.length === 0) {

        mostrarMensagemVazia(
            gradeLeituras,
            "book-open",
            "Suas leituras aparecerão aqui quando você começar uma história."
        );

        return;
    }

    historiasLidas.forEach(historia => {

        const cartao = criarCartaoHistoria(historia, false);

        const chave = "progresso-historia-" + historia.id;

        const capituloAtual = Number(
            localStorage.getItem(chave)
        );

        const quantidadeCapitulos = Array.isArray(historia.capitulos)
            ? historia.capitulos.length
            : 0;

        if (
            quantidadeCapitulos > 0 &&
            Number.isInteger(capituloAtual) &&
            capituloAtual >= 0 &&
            capituloAtual < quantidadeCapitulos
        ) {

            const progresso = Math.round(
                ((capituloAtual + 1) / quantidadeCapitulos) * 100
            );

            const textoProgresso = document.createElement("small");

            textoProgresso.textContent =
                `Capítulo ${capituloAtual + 1} de ${quantidadeCapitulos} · ${progresso}%`;

            textoProgresso.style.color = "var(--texto-secundario)";

            cartao.appendChild(textoProgresso);
        }

        gradeLeituras.appendChild(cartao);
    });
}

/* =====================================
   PLAYLISTS
===================================== */

function mostrarPlaylists() {

    gradePlaylists.innerHTML = "";

    let playlists = [];

    try {
        playlists = JSON.parse(
            localStorage.getItem("litTunePlaylists")
        ) || [];

    } catch (erro) {
        console.error("Erro ao carregar playlists:", erro);
    }

    totalPlaylists.textContent = playlists.length;

    if (playlists.length === 0) {

        mostrarMensagemVazia(
            gradePlaylists,
            "headphones",
            "Suas playlists aparecerão aqui quando forem criadas na página Música."
        );

        return;
    }

    playlists.forEach(playlist => {

        const cartao = document.createElement("article");

        cartao.className = "cartao-historia-perfil";

        cartao.style.cssText = `
            padding: 20px;
            background-color: var(--cartao);
            border: 1px solid var(--borda);
            border-radius: 13px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;

        // Abre a playlist na página Música
        cartao.addEventListener("click", () => {
            window.location.href =
                "musica.html?playlist=" + encodeURIComponent(playlist.id);
        });

        // Ícone
        const icone = document.createElement("i");

        icone.setAttribute("data-lucide", "headphones");

        icone.style.cssText = `
            width: 28px;
            height: 28px;
            color: var(--caramelo);
        `;

        // Nome
        const titulo = document.createElement("h3");

        titulo.textContent = playlist.nome || "Playlist sem nome";

        titulo.style.cssText = `
            color: var(--texto);
            font-family: Georgia, serif;
            font-size: 19px;
            margin: 0;
        `;

        // Descrição
        const descricao = document.createElement("p");

        descricao.textContent =
            playlist.descricao || "Minha playlist";

        descricao.style.cssText = `
            color: var(--texto-secundario);
            font-size: 13px;
            margin: 0;
        `;

        // Quantidade de músicas
        const quantidade = document.createElement("small");

        const totalMusicas = Array.isArray(playlist.musicas)
            ? playlist.musicas.length
            : 0;

        quantidade.textContent =
            `${totalMusicas} música(s)`;

        quantidade.style.color = "var(--texto-secundario)";

        // Montar cartão
        cartao.appendChild(icone);
        cartao.appendChild(titulo);
        cartao.appendChild(descricao);
        cartao.appendChild(quantidade);

        gradePlaylists.appendChild(cartao);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

/* =====================================
   RESUMO DO PERFIL
===================================== */

function atualizarResumo() {

    const historiasLidas = historias.filter(historia => {

        const chave = "progresso-historia-" + historia.id;

        return localStorage.getItem(chave) !== null;
    });

    const favoritosCriados = historias.filter(historia =>
        favoritos.includes(String(historia.id))
    );

    const favoritosExplorar = historiasFavoritasExplorar.filter(historia =>
        favoritos.includes(String(historia.id))
    );

    const todosFavoritos = [
        ...favoritosCriados,
        ...favoritosExplorar
    ];

    totalLeituras.textContent = historiasLidas.length;
    totalHistorias.textContent = historias.length;
    totalFavoritos.textContent = todosFavoritos.length;
}


/* =====================================
   MENSAGENS DE ÁREA VAZIA
===================================== */

function mostrarMensagemVazia(elemento, icone, mensagem) {

    const caixa = document.createElement("div");

    caixa.className = "mensagem-vazia";

    const iconeElemento = document.createElement("i");

    iconeElemento.setAttribute("data-lucide", icone);

    const texto = document.createElement("p");

    texto.textContent = mensagem;

    caixa.appendChild(iconeElemento);
    caixa.appendChild(texto);

    elemento.appendChild(caixa);
}


/* =====================================
   MODO CLARO E ESCURO
===================================== */

const botaoTema = document.getElementById("botao-tema");

function atualizarTema() {

    const temaSalvo = localStorage.getItem("tema");

    document.body.classList.toggle(
        "modo-escuro",
        temaSalvo === "escuro"
    );

    if (botaoTema) {

        botaoTema.innerHTML = temaSalvo === "escuro"
            ? '<i data-lucide="sun" class="icone-tema"></i>'
            : '<i data-lucide="moon" class="icone-tema"></i>';
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}


if (botaoTema) {

    botaoTema.addEventListener("click", () => {

        const temaAtual = localStorage.getItem("tema");

        const novoTema = temaAtual === "escuro"
            ? "claro"
            : "escuro";

        localStorage.setItem("tema", novoTema);

        atualizarTema();
    });
}


/* =====================================
   EVENTOS DOS BOTÕES
===================================== */

if (botaoEditar) {
    botaoEditar.addEventListener("click", abrirModal);
}

if (botaoFechar) {
    botaoFechar.addEventListener("click", fecharModal);
}

if (botaoCancelar) {
    botaoCancelar.addEventListener("click", fecharModal);
}

if (botaoSalvar) {
    botaoSalvar.addEventListener("click", salvarPerfil);
}

if (modalPerfil) {

    modalPerfil.addEventListener("click", evento => {

        if (evento.target === modalPerfil) {
            fecharModal();
        }
    });
}


/* =====================================
   INICIALIZAÇÃO
===================================== */

carregarPerfil();

carregarFavoritos();

carregarHistorias();

mostrarFavoritos();

mostrarPlaylists();

atualizarResumo();

atualizarTema();

if (window.lucide) {
    lucide.createIcons();
}
