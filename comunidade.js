
/* =====================================
   CONFIGURAÇÕES INICIAIS
===================================== */

const chavePublicacoes = "litTunePublicacoes";

const campoPublicacao = document.getElementById("texto-publicacao");
const categoriaPublicacao = document.getElementById("categoria-publicacao");
const botaoPublicar = document.getElementById("botao-publicar");

const feedPublicacoes = document.getElementById("feed-publicacoes");
const feedVazio = document.getElementById("feed-vazio");

const filtros = document.querySelectorAll(".filtro-comunidade");

let categoriaAtual = "Todos";


/* =====================================
   FUNÇÕES AUXILIARES
===================================== */

// Evita que textos digitados pelos usuários sejam interpretados como HTML.
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => {
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


// Cria um identificador para cada publicação.
function gerarId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}


// Calcula o tempo desde a publicação.
function calcularTempo(data) {
    const diferenca = Date.now() - new Date(data).getTime();

    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) {
        return "Agora";
    }

    if (minutos < 60) {
        return `Há ${minutos} min`;
    }

    if (horas < 24) {
        return `Há ${horas} h`;
    }

    return `Há ${dias} dia(s)`;
}


/* =====================================
   PUBLICAÇÕES INICIAIS
===================================== */

// Aproveita as três publicações que já estão no HTML.
function obterPublicacoesIniciais() {
    const cards = document.querySelectorAll(".publicacao");

    return Array.from(cards).map(card => {
        const nome = card.querySelector(".dados-usuario h3")?.textContent.trim() || "Usuário";

        const avatar = card.querySelector(".avatar-comunidade")?.textContent.trim() || "U";

        const texto = card.querySelector(".texto-post")?.textContent.trim() || "";

        const categoria = card.dataset.categoria || "Geral";

        return {
            id: gerarId(),
            nome: nome,
            avatar: avatar,
            texto: texto,
            categoria: categoria,
            data: new Date().toISOString(),
            curtidas: 0,
            curtido: false,
            comentarios: []
        };
    });
}


/* =====================================
   LOCAL STORAGE
===================================== */

// Recupera as publicações salvas.
function carregarPublicacoes() {
    const dadosSalvos = localStorage.getItem(chavePublicacoes);

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            if (Array.isArray(dados)) {
                return dados;
            }
        } catch (erro) {
            console.error("Erro ao carregar publicações:", erro);
        }
    }

    // Se for a primeira visita, usa os exemplos do HTML.
    const iniciais = obterPublicacoesIniciais();

    localStorage.setItem(chavePublicacoes, JSON.stringify(iniciais));

    return iniciais;
}


let publicacoes = carregarPublicacoes();


// Salva as alterações.
function salvarPublicacoes() {
    localStorage.setItem(chavePublicacoes, JSON.stringify(publicacoes));
}


/* =====================================
   MOSTRAR PUBLICAÇÕES
===================================== */

function mostrarPublicacoes() {

    const publicacoesFiltradas = categoriaAtual === "Todos"
        ? publicacoes
        : publicacoes.filter(publicacao =>
            publicacao.categoria === categoriaAtual
        );

    feedPublicacoes.innerHTML = "";

    if (publicacoesFiltradas.length === 0) {
        feedVazio.hidden = false;
        return;
    }

    feedVazio.hidden = true;

    publicacoesFiltradas.forEach(publicacao => {

        const comentarios = Array.isArray(publicacao.comentarios)
            ? publicacao.comentarios
            : [];

        const card = document.createElement("article");

        card.className = "publicacao";
        card.dataset.id = publicacao.id;

        card.innerHTML = `
            <div class="topo-publicacao">

                <div class="avatar-comunidade">
                    ${escaparHTML(publicacao.avatar)}
                </div>

                <div class="dados-usuario">
                    <h3>${escaparHTML(publicacao.nome)}</h3>
                    <span>${calcularTempo(publicacao.data)}</span>
                </div>

                <span class="categoria-post">
                    ${escaparHTML(publicacao.categoria)}
                </span>

            </div>

            <p class="texto-post">
                ${escaparHTML(publicacao.texto).replace(/\n/g, "<br>")}
            </p>

            <div class="acoes-publicacao">

                <button class="botao-curtir ${publicacao.curtido ? "curtido" : ""}">
                    <i data-lucide="heart"></i>
                    <span>${publicacao.curtidas || 0}</span>
                </button>

                <button class="botao-comentarios">
                    <i data-lucide="message-circle"></i>
                    Comentar (${comentarios.length})
                </button>

            </div>

            <div class="area-comentarios" hidden>

                <div class="lista-comentarios">

                    ${comentarios.map(comentario => `
                        <div class="comentario">
                            <strong>${escaparHTML(comentario.nome)}</strong>
                            <p>${escaparHTML(comentario.texto).replace(/\n/g, "<br>")}</p>
                        </div>
                    `).join("")}

                </div>

                <div class="campo-comentario">

                    <input
                        type="text"
                        class="texto-comentario"
                        placeholder="Escreva um comentário..."
                        maxlength="500"
                    >

                    <button class="enviar-comentario" aria-label="Enviar comentário">
                        <i data-lucide="send"></i>
                    </button>

                </div>

            </div>
        `;

        feedPublicacoes.appendChild(card);
    });

    // Recria os ícones do Lucide.
    if (window.lucide) {
        lucide.createIcons();
    }
}


/* =====================================
   CRIAR PUBLICAÇÃO
===================================== */

function publicar() {

    const texto = campoPublicacao.value.trim();
    const categoria = categoriaPublicacao.value;

    if (texto === "") {
        alert("Escreva alguma coisa antes de publicar!");
        campoPublicacao.focus();
        return;
    }

    const novaPublicacao = {
        id: gerarId(),
        nome: "Você",
        avatar: "B",
        texto: texto,
        categoria: categoria,
        data: new Date().toISOString(),
        curtidas: 0,
        curtido: false,
        comentarios: []
    };

    // Coloca a nova publicação no início do feed.
    publicacoes.unshift(novaPublicacao);

    salvarPublicacoes();

    campoPublicacao.value = "";

    // Mostra a publicação recém-criada.
    categoriaAtual = "Todos";

    atualizarFiltros();

    mostrarPublicacoes();
}


botaoPublicar.addEventListener("click", publicar);


/* =====================================
   FILTRAR PUBLICAÇÕES
===================================== */

function atualizarFiltros() {

    filtros.forEach(filtro => {

        filtro.classList.toggle(
            "ativo",
            filtro.dataset.categoria === categoriaAtual
        );

    });
}


filtros.forEach(filtro => {

    filtro.addEventListener("click", () => {

        categoriaAtual = filtro.dataset.categoria;

        atualizarFiltros();

        mostrarPublicacoes();

    });

});


/* =====================================
   CURTIDAS E COMENTÁRIOS
===================================== */

// Usamos um único evento no feed para todos os cards.
feedPublicacoes.addEventListener("click", event => {

    const card = event.target.closest(".publicacao");

    if (!card) {
        return;
    }

    const id = card.dataset.id;

    const publicacao = publicacoes.find(item => item.id === id);

    if (!publicacao) {
        return;
    }


    // CURTIR OU DESCURTIR
    const botaoCurtir = event.target.closest(".botao-curtir");

    if (botaoCurtir) {

        if (publicacao.curtido) {
            publicacao.curtidas--;
            publicacao.curtido = false;
        } else {
            publicacao.curtidas++;
            publicacao.curtido = true;
        }

        salvarPublicacoes();

        mostrarPublicacoes();

        return;
    }


    // ABRIR OU FECHAR COMENTÁRIOS
    const botaoComentarios = event.target.closest(".botao-comentarios");

    if (botaoComentarios) {

        const area = card.querySelector(".area-comentarios");

        area.hidden = !area.hidden;

        return;
    }


    // ENVIAR COMENTÁRIO
    const botaoEnviar = event.target.closest(".enviar-comentario");

    if (botaoEnviar) {

        const campo = card.querySelector(".texto-comentario");

        const texto = campo.value.trim();

        if (texto === "") {
            campo.focus();
            return;
        }

        publicacao.comentarios.push({
            nome: "Você",
            texto: texto,
            data: new Date().toISOString()
        });

        salvarPublicacoes();

        mostrarPublicacoes();

        // Mantém a área de comentários aberta.
        const novoCard = feedPublicacoes.querySelector(
            `[data-id="${id}"]`
        );

        if (novoCard) {
            novoCard.querySelector(".area-comentarios").hidden = false;
        }

    }

});


// Permite enviar comentários apertando Enter.
feedPublicacoes.addEventListener("keydown", event => {

    if (
        event.key === "Enter" &&
        event.target.classList.contains("texto-comentario")
    ) {
        event.preventDefault();

        const card = event.target.closest(".publicacao");

        card.querySelector(".enviar-comentario").click();
    }

});


/* =====================================
   MODO CLARO E ESCURO
===================================== */

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


if (botaoTema) {

    botaoTema.addEventListener("click", () => {

        const modoEscuro = document.body.classList.contains("modo-escuro");

        const novoTema = modoEscuro ? "claro" : "escuro";

        localStorage.setItem("tema", novoTema);

        atualizarTema();

    });

}


/* =====================================
   INICIALIZAÇÃO
===================================== */

mostrarPublicacoes();

atualizarTema();
