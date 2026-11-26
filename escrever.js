
/* ================================= */
/* ELEMENTOS DA PÁGINA */
/* ================================= */

// Botões principais
const botaoCriar = document.getElementById("botao-criar");
const botaoCriarVazio = document.getElementById("botao-criar-vazio");
const botaoFechar = document.getElementById("botao-fechar");
const botaoCancelar = document.getElementById("botao-cancelar");

// Formulário da história
const formularioContainer = document.getElementById("formulario-container");
const formulario = document.getElementById("formulario-historia");
const tituloFormulario = document.getElementById("titulo-formulario");

// Campos da história
const campoTitulo = document.getElementById("titulo-historia");
const campoTipo = document.getElementById("tipo-historia");
const campoGenero = document.getElementById("genero-historia");
const campoSinopse = document.getElementById("sinopse-historia");
const campoStatus = document.getElementById("status-historia");

// Lista de histórias
const gradeProjetos = document.getElementById("grade-projetos");
const semProjetos = document.getElementById("sem-projetos");
const quantidadeHistorias = document.getElementById("quantidade-historias");

// Pesquisa e filtros
const pesquisaHistorias = document.getElementById("pesquisa-historias");
const filtros = document.querySelectorAll(".filtro-escrever");

// Área de capítulos
const areaCapitulos = document.getElementById("area-capitulos");
const listaCapitulosHistoria = document.getElementById("lista-capitulos-historia");
const semCapitulosHistoria = document.getElementById("sem-capitulos-historia");

const botaoAdicionarCapitulo = document.getElementById("botao-adicionar-capitulo");
const editorCapitulo = document.getElementById("editor-capitulo");
const tituloEditorCapitulo = document.getElementById("titulo-editor-capitulo");

const campoTituloCapitulo = document.getElementById("titulo-capitulo-inline");
const campoConteudoCapitulo = document.getElementById("conteudo-capitulo-inline");

const botaoSalvarCapitulo = document.getElementById("salvar-capitulo-inline");
const botaoCancelarCapitulo = document.getElementById("cancelar-capitulo-inline");

// Botão de tema
const botaoTema = document.getElementById("botao-tema");


/* ================================= */
/* VARIÁVEIS */
/* ================================= */

let historias = [];
let filtroAtual = "Todas";
let historiaEditando = null;
let capituloEditando = null;

const CHAVE_HISTORIAS = "historiasLitTune";


/* ================================= */
/* VERIFICAR ELEMENTOS */
/* ================================= */

function verificarElementos() {

    const elementos = [
        botaoCriar,
        botaoCriarVazio,
        botaoFechar,
        botaoCancelar,
        formularioContainer,
        formulario,
        tituloFormulario,
        campoTitulo,
        campoTipo,
        campoGenero,
        campoSinopse,
        campoStatus,
        gradeProjetos,
        semProjetos,
        quantidadeHistorias,
        pesquisaHistorias,
        areaCapitulos,
        listaCapitulosHistoria,
        semCapitulosHistoria,
        botaoAdicionarCapitulo,
        editorCapitulo,
        tituloEditorCapitulo,
        campoTituloCapitulo,
        campoConteudoCapitulo,
        botaoSalvarCapitulo,
        botaoCancelarCapitulo,
        botaoTema
    ];

    if (elementos.some(function (elemento) {
        return !elemento;
    })) {
        console.error("Algum elemento do HTML não foi encontrado. Confira os IDs.");
        return false;
    }

    return true;
}


/* ================================= */
/* CARREGAR HISTÓRIAS */
/* ================================= */

function carregarHistorias() {

    try {

        const dadosSalvos = localStorage.getItem(CHAVE_HISTORIAS);

        historias = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        if (!Array.isArray(historias)) {
            historias = [];
        }

    } catch (erro) {

        historias = [];

        console.error("Erro ao carregar histórias:", erro);
    }

    historias.forEach(function (historia) {

        if (!Array.isArray(historia.capitulos)) {
            historia.capitulos = [];
        }

        historia.capitulos.forEach(function (capitulo) {

            if (!capitulo.id) {
                capitulo.id = Date.now() + Math.random();
            }

        });

    });

    salvarHistorias();
    mostrarHistorias();
}


/* ================================= */
/* SALVAR HISTÓRIAS */
/* ================================= */

function salvarHistorias() {

    try {

        localStorage.setItem(
            CHAVE_HISTORIAS,
            JSON.stringify(historias)
        );

    } catch (erro) {

        console.error("Erro ao salvar histórias:", erro);

        alert("Não foi possível salvar. Verifique o armazenamento do navegador.");
    }
}


/* ================================= */
/* ESCAPAR TEXTO HTML */
/* ================================= */

function escaparHTML(texto) {

    return String(texto ?? "").replace(/[&<>"']/g, function (caractere) {

        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caractere];
    });
}


/* ================================= */
/* ABRIR FORMULÁRIO */
/* ================================= */

function abrirFormulario() {

    historiaEditando = null;
    capituloEditando = null;

    formulario.reset();

    tituloFormulario.textContent = "Criar uma história";

    areaCapitulos.classList.remove("aberto");
    editorCapitulo.classList.remove("aberto");

    listaCapitulosHistoria.innerHTML = "";
    semCapitulosHistoria.style.display = "block";

    campoTituloCapitulo.value = "";
    campoConteudoCapitulo.value = "";

    formularioContainer.classList.add("aberto");

    formularioContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    atualizarIcones();
}


/* ================================= */
/* FECHAR FORMULÁRIO */
/* ================================= */

function fecharFormulario() {

    formularioContainer.classList.remove("aberto");

    formulario.reset();

    historiaEditando = null;
    capituloEditando = null;

    areaCapitulos.classList.remove("aberto");
    editorCapitulo.classList.remove("aberto");

    campoTituloCapitulo.value = "";
    campoConteudoCapitulo.value = "";

    atualizarIcones();
}


/* ================================= */
/* BOTÕES DE ABRIR E FECHAR */
/* ================================= */

botaoCriar.addEventListener("click", abrirFormulario);

botaoCriarVazio.addEventListener("click", abrirFormulario);

botaoFechar.addEventListener("click", fecharFormulario);

botaoCancelar.addEventListener("click", fecharFormulario);


/* ================================= */
/* SALVAR OU EDITAR HISTÓRIA */
/* ================================= */

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const tipo = campoTipo.value;
    const genero = campoGenero.value;
    const sinopse = campoSinopse.value.trim();
    const status = campoStatus.value;

    if (!titulo || !genero) {
        alert("Preencha o título e o gênero da história.");
        return;
    }

    if (historiaEditando !== null) {

        const historia = historias.find(function (item) {
            return String(item.id) === String(historiaEditando);
        });

        if (!historia) return;

        historia.titulo = titulo;
        historia.tipo = tipo;
        historia.genero = genero;
        historia.sinopse = sinopse;
        historia.status = status;

    } else {

        const novaHistoria = {
            id: Date.now(),
            titulo: titulo,
            tipo: tipo,
            genero: genero,
            sinopse: sinopse,
            status: status,
            capitulos: []
        };

        historias.push(novaHistoria);
    }

    salvarHistorias();
    mostrarHistorias();
    fecharFormulario();
});


/* ================================= */
/* MOSTRAR HISTÓRIAS */
/* ================================= */

function mostrarHistorias() {

    gradeProjetos.innerHTML = "";

    const pesquisa = pesquisaHistorias.value.toLowerCase().trim();

    const historiasFiltradas = historias.filter(function (historia) {

        const correspondeStatus =
            filtroAtual === "Todas" || historia.status === filtroAtual;

        const titulo = String(historia.titulo || "").toLowerCase();
        const genero = String(historia.genero || "").toLowerCase();
        const tipo = String(historia.tipo || "").toLowerCase();
        const sinopse = String(historia.sinopse || "").toLowerCase();

        const correspondePesquisa =
            titulo.includes(pesquisa) ||
            genero.includes(pesquisa) ||
            tipo.includes(pesquisa) ||
            sinopse.includes(pesquisa);

        return correspondeStatus && correspondePesquisa;
    });

    // Quantidade total de histórias
    quantidadeHistorias.textContent =
        historias.length === 1
            ? "Você possui 1 história cadastrada."
            : `Você possui ${historias.length} histórias cadastradas.`;

    // Mensagem quando não houver resultados
    if (historiasFiltradas.length === 0) {

        semProjetos.style.display = "block";

        return;
    }

    semProjetos.style.display = "none";

    historiasFiltradas.forEach(function (historia) {

        const cartao = document.createElement("article");

        cartao.className = "cartao-projeto";

        const classeGenero = obterClasseGenero(historia.genero);
        const classeStatus = obterClasseStatus(historia.status);

        const quantidadeCapitulos = Array.isArray(historia.capitulos)
            ? historia.capitulos.length
            : 0;


        // =================================
        // RECUPERAR PROGRESSO DE LEITURA
        // =================================

        const chaveProgresso =
            "progresso-historia-" + historia.id;

        const progressoSalvo =
            localStorage.getItem(chaveProgresso);

        let porcentagem = 0;
        let textoProgresso = "Ainda não começou";

        if (quantidadeCapitulos > 0 && progressoSalvo !== null) {

            const capituloAtual = Number(progressoSalvo);

            if (
                Number.isInteger(capituloAtual) &&
                capituloAtual >= 0 &&
                capituloAtual < quantidadeCapitulos
            ) {

                porcentagem = Math.round(
                    ((capituloAtual + 1) / quantidadeCapitulos) * 100
                );

                textoProgresso =
                    `Capítulo ${capituloAtual + 1} de ${quantidadeCapitulos} · ${porcentagem}% concluído`;
            }
        }


        // =================================
        // CRIAR CARTÃO DA HISTÓRIA
        // =================================

        cartao.innerHTML = `

            <div class="capa-projeto ${classeGenero}">
                ${escaparHTML(historia.titulo)}
            </div>

            <div class="informacoes-projeto">

                <span class="tipo-projeto">
                    ${escaparHTML(historia.tipo)}
                </span>

                <h3>${escaparHTML(historia.titulo)}</h3>

                <span class="genero-projeto">
                    ${escaparHTML(historia.genero)}
                </span>

                <p class="sinopse-projeto">
                    ${escaparHTML(historia.sinopse || "Nenhuma sinopse adicionada.")}
                </p>

                <span class="status-projeto ${classeStatus}">
                    ${escaparHTML(historia.status)}
                </span>

                <p class="quantidade-capitulos-cartao">
                    ${quantidadeCapitulos}
                    ${quantidadeCapitulos === 1 ? "capítulo" : "capítulos"}
                </p>

                ${quantidadeCapitulos > 0 ? `
                    <div class="progresso-projeto">

                        <div class="barra-progresso-projeto">
                            <span style="width: ${porcentagem}%"></span>
                        </div>

                        <small>${textoProgresso}</small>

                    </div>
                ` : ""}

                <div class="acoes-projeto">

                    <button type="button"
                        class="botao-ler"
                        data-acao="ler"
                        data-id="${escaparHTML(historia.id)}">

                        <i data-lucide="book-open"></i>
                        Ler

                    </button>

                    <button type="button"
                        class="botao-editar"
                        data-acao="editar"
                        data-id="${escaparHTML(historia.id)}">

                        <i data-lucide="pencil"></i>
                        Editar

                    </button>

                    <button type="button"
                        class="botao-excluir"
                        data-acao="excluir"
                        data-id="${escaparHTML(historia.id)}"
                        aria-label="Excluir história">

                        <i data-lucide="trash-2"></i>

                    </button>

                </div>

            </div>
        `;

        gradeProjetos.appendChild(cartao);
    });

    atualizarIcones();
}


/* ================================= */
/* CLASSE DO GÊNERO */
/* ================================= */

function obterClasseGenero(genero) {

    const classes = {
        "Romance": "romance",
        "Fantasia": "fantasia",
        "Mistério": "misterio",
        "Terror": "terror",
        "Aventura": "aventura",
        "Drama": "drama",
        "Ação": "acao",
        "Comédia": "comedia",
        "Suspense": "suspense",
        "Ficção científica": "ficcao"
    };

    return classes[genero] || "outro";
}


/* ================================= */
/* CLASSE DO STATUS */
/* ================================= */

function obterClasseStatus(status) {

    if (status === "Publicada") {
        return "publicada";
    }

    if (status === "Rascunho") {
        return "rascunho";
    }

    return "";
}


/* ================================= */
/* ABRIR, EDITAR E EXCLUIR HISTÓRIAS */
/* ================================= */

gradeProjetos.addEventListener("click", function (evento) {

    const botao = evento.target.closest("button[data-acao]");

    if (!botao) return;

    const id = botao.dataset.id;

    const historia = historias.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!historia) return;

    // ABRIR MODO LEITURA
    if (botao.dataset.acao === "ler") {

        window.location.href =
            "leitura.html?id=" + encodeURIComponent(historia.id);

        return;
    }

    // EDITAR HISTÓRIA
    if (botao.dataset.acao === "editar") {

        historiaEditando = historia.id;
        capituloEditando = null;

        tituloFormulario.textContent = "Editar história";

        campoTitulo.value = historia.titulo;
        campoTipo.value = historia.tipo;
        campoGenero.value = historia.genero;
        campoSinopse.value = historia.sinopse || "";
        campoStatus.value = historia.status;

        areaCapitulos.classList.add("aberto");

        mostrarCapitulosDaHistoria(historia);

        editorCapitulo.classList.remove("aberto");

        campoTituloCapitulo.value = "";
        campoConteudoCapitulo.value = "";

        formularioContainer.classList.add("aberto");

        formularioContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        atualizarIcones();
    }

    // EXCLUIR HISTÓRIA
    if (botao.dataset.acao === "excluir") {

        const confirmar = confirm(
            `Deseja realmente excluir a história "${historia.titulo}" e seus capítulos?`
        );

        if (confirmar) {

            historias = historias.filter(function (item) {
                return String(item.id) !== String(id);
            });

            if (String(historiaEditando) === String(id)) {
                fecharFormulario();
            }

            salvarHistorias();
            mostrarHistorias();
        }
    }
});


/* ================================= */
/* FILTRAR HISTÓRIAS */
/* ================================= */

filtros.forEach(function (botao) {

    botao.addEventListener("click", function () {

        filtros.forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        filtroAtual = botao.dataset.status;

        mostrarHistorias();
    });
});


/* ================================= */
/* PESQUISAR HISTÓRIAS */
/* ================================= */

pesquisaHistorias.addEventListener("input", mostrarHistorias);


/* ================================= */
/* MOSTRAR CAPÍTULOS */
/* ================================= */

function mostrarCapitulosDaHistoria(historia) {

    listaCapitulosHistoria.innerHTML = "";

    if (!Array.isArray(historia.capitulos)) {
        historia.capitulos = [];
    }

    if (historia.capitulos.length === 0) {

        semCapitulosHistoria.style.display = "block";

        atualizarIcones();

        return;
    }

    semCapitulosHistoria.style.display = "none";

    historia.capitulos.forEach(function (capitulo, indice) {

        const item = document.createElement("div");

        item.className = "capitulo-item";

        item.innerHTML = `

            <h4>
                Capítulo ${indice + 1} — ${escaparHTML(capitulo.titulo)}
            </h4>

            <div class="acoes-capitulo-inline">

                <button type="button"
                    data-acao-capitulo="editar"
                    data-id="${escaparHTML(capitulo.id)}"
                    aria-label="Editar capítulo">

                    <i data-lucide="pencil"></i>

                </button>

                <button type="button"
                    data-acao-capitulo="excluir"
                    data-id="${escaparHTML(capitulo.id)}"
                    aria-label="Excluir capítulo">

                    <i data-lucide="trash-2"></i>

                </button>

            </div>
        `;

        listaCapitulosHistoria.appendChild(item);
    });

    atualizarIcones();
}


/* ================================= */
/* ABRIR EDITOR DE NOVO CAPÍTULO */
/* ================================= */

botaoAdicionarCapitulo.addEventListener("click", function () {

    if (historiaEditando === null) {

        alert("Salve a história primeiro. Depois, clique em Editar para adicionar capítulos.");

        return;
    }

    capituloEditando = null;

    campoTituloCapitulo.value = "";
    campoConteudoCapitulo.value = "";

    tituloEditorCapitulo.textContent = "Novo capítulo";

    editorCapitulo.classList.add("aberto");

    editorCapitulo.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* ================================= */
/* SALVAR CAPÍTULO */
/* ================================= */

botaoSalvarCapitulo.addEventListener("click", function () {

    if (historiaEditando === null) {

        alert("Salve a história antes de adicionar capítulos.");

        return;
    }

    const historia = historias.find(function (item) {
        return String(item.id) === String(historiaEditando);
    });

    if (!historia) return;

    const titulo = campoTituloCapitulo.value.trim();
    const conteudo = campoConteudoCapitulo.value.trim();

    if (!titulo || !conteudo) {

        alert("Preencha o título e o conteúdo do capítulo.");

        return;
    }

    if (!Array.isArray(historia.capitulos)) {
        historia.capitulos = [];
    }

    if (capituloEditando !== null) {

        // EDITAR CAPÍTULO EXISTENTE
        const capitulo = historia.capitulos.find(function (item) {
            return String(item.id) === String(capituloEditando);
        });

        if (capitulo) {

            capitulo.titulo = titulo;
            capitulo.conteudo = conteudo;

        }

    } else {

        // ADICIONAR NOVO CAPÍTULO
        historia.capitulos.push({

            id: Date.now() + Math.random(),
            titulo: titulo,
            conteudo: conteudo

        });
    }

    salvarHistorias();

    mostrarCapitulosDaHistoria(historia);
    mostrarHistorias();

    editorCapitulo.classList.remove("aberto");

    campoTituloCapitulo.value = "";
    campoConteudoCapitulo.value = "";

    capituloEditando = null;

});


/* ================================= */
/* CANCELAR EDIÇÃO DE CAPÍTULO */
/* ================================= */

botaoCancelarCapitulo.addEventListener("click", function () {

    editorCapitulo.classList.remove("aberto");

    campoTituloCapitulo.value = "";
    campoConteudoCapitulo.value = "";

    capituloEditando = null;
});


/* ================================= */
/* EDITAR E EXCLUIR CAPÍTULOS */
/* ================================= */

listaCapitulosHistoria.addEventListener("click", function (evento) {

    const botao = evento.target.closest("button[data-acao-capitulo]");

    if (!botao || historiaEditando === null) return;

    const historia = historias.find(function (item) {
        return String(item.id) === String(historiaEditando);
    });

    if (!historia) return;

    const id = botao.dataset.id;

    const capitulo = historia.capitulos.find(function (item) {
        return String(item.id) === String(id);
    });

    if (!capitulo) return;


    // EDITAR CAPÍTULO
    if (botao.dataset.acaoCapitulo === "editar") {

        capituloEditando = capitulo.id;

        campoTituloCapitulo.value = capitulo.titulo;
        campoConteudoCapitulo.value = capitulo.conteudo;

        tituloEditorCapitulo.textContent = "Editar capítulo";

        editorCapitulo.classList.add("aberto");

        editorCapitulo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    // EXCLUIR CAPÍTULO
    if (botao.dataset.acaoCapitulo === "excluir") {

        const confirmar = confirm(
            `Deseja excluir o capítulo "${capitulo.titulo}"?`
        );

        if (confirmar) {

            historia.capitulos = historia.capitulos.filter(function (item) {
                return String(item.id) !== String(id);
            });

            salvarHistorias();

            mostrarCapitulosDaHistoria(historia);
            mostrarHistorias();

            editorCapitulo.classList.remove("aberto");

            campoTituloCapitulo.value = "";
            campoConteudoCapitulo.value = "";

            capituloEditando = null;
        }
    }
});


/* ================================= */
/* MODO CLARO E ESCURO */
/* ================================= */

function aplicarTema() {

    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "escuro") {
        document.body.classList.add("modo-escuro");
    } else {
        document.body.classList.remove("modo-escuro");
    }

    atualizarIcones();
}

botaoTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-escuro");

    const temaAtual = document.body.classList.contains("modo-escuro")
        ? "escuro"
        : "claro";

    localStorage.setItem("tema", temaAtual);

    atualizarIcones();
});


/* ================================= */
/* ATUALIZAR ÍCONES */
/* ================================= */

function atualizarIcones() {

    if (window.lucide) {
        lucide.createIcons();
    }
}


/* ================================= */
/* INICIAR PÁGINA */
/* ================================= */

if (verificarElementos()) {

    aplicarTema();

    carregarHistorias();

    atualizarIcones();

}
