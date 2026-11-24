
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

    atualizarIcones();
}

function atualizarIcones() {

    if (window.lucide) {
        lucide.createIcons();
    }

}

atualizarTema();

botaoTema.addEventListener("click", function () {

    const modoEscuro =
        document.body.classList.contains("modo-escuro");

    localStorage.setItem(
        "tema",
        modoEscuro ? "claro" : "escuro"
    );

    atualizarTema();

});


/* ================================= */
/* ELEMENTOS DA PÁGINA */
/* ================================= */

const elementoTitulo = document.getElementById("titulo-leitura");
const elementoTipo = document.getElementById("tipo-leitura");
const elementoAutor = document.getElementById("autor-leitura");
const elementoDescricao = document.getElementById("descricao-leitura");

const elementoCapa = document.getElementById("capa-leitura");

const elementoDedicatria = document.getElementById("texto-dedicatoria");

const seletorCapitulo = document.getElementById("capitulo-escolhido");
const elementoTituloCapitulo = document.getElementById("titulo-capitulo");
const elementoTextoHistoria = document.getElementById("texto-historia");

const botaoAnterior = document.getElementById("capitulo-anterior");
const botaoProximo = document.getElementById("proximo-capitulo");

// ELEMENTOS DO PROGRESSO

const areaProgresso = document.getElementById("progresso-leitura");
const barraProgresso = document.getElementById("barra-progresso-preenchida");
const porcentagemProgresso = document.getElementById("porcentagem-progresso");
const textoProgresso = document.getElementById("texto-progresso");


/* ================================= */
/* IDENTIFICAR A ORIGEM DA HISTÓRIA */
/* ================================= */

const parametros = new URLSearchParams(window.location.search);

const idHistoria = parametros.get("id");
const origem = parametros.get("origem");

// IDENTIFICAR O PROGRESSO DE CADA HISTÓRIA

const chaveProgresso = idHistoria
    ? "progresso-historia-" + idHistoria
    : "progresso-exemplo-" + [
        parametros.get("titulo"),
        parametros.get("tipo"),
        parametros.get("autor")
    ].join("-");


/* ================================= */
/* CAPÍTULOS DOS LIVROS DE EXEMPLO */
/* ================================= */

// Estes capítulos continuam disponíveis para
// os livros e fanfics que aparecem na página inicial.

const capitulosExemplo = [

    {
        titulo: "Um novo começo",

        conteudo: `O dia parecia comum, mas havia algo diferente no ar.

Ela caminhava pelas ruas enquanto observava as pessoas ao seu redor. Pensava em tudo o que havia acontecido e em tudo aquilo que ainda poderia acontecer.

Talvez fosse hora de mudar. Talvez algumas histórias precisassem começar justamente quando menos esperamos.

E, sem perceber, aquele seria apenas o primeiro capítulo de algo muito maior.`
    },

    {
        titulo: "Entre encontros",

        conteudo: `A chuva começou a cair lentamente.

Ela encontrou abrigo em uma pequena livraria, onde o cheiro dos livros antigos parecia tornar tudo mais tranquilo.

Enquanto procurava algo para ler, seus olhos encontraram outra pessoa.

Um sorriso discreto. Um olhar curioso.

Às vezes, os melhores acontecimentos começam com encontros inesperados.`
    },

    {
        titulo: "O que vem depois",

        conteudo: `Naquela noite, ela percebeu que nem todas as respostas precisavam ser encontradas imediatamente.

Algumas coisas precisavam de tempo, outras de coragem.

Abriu seu caderno, escreveu algumas palavras e sorriu.

Pela primeira vez em muito tempo, estava animada para descobrir o que aconteceria no dia seguinte.`
    }

];


/* ================================= */
/* DEDICATÓRIAS */
/* ================================= */

const dedicatórias = [

    "Para todos aqueles que encontram nos livros um lugar para chamar de lar.",

    "Para quem nunca deixou de acreditar no poder de uma boa história.",

    "Dedico estas páginas aos sonhadores que encontram magia nas pequenas coisas.",

    "Para você, que chegou até aqui. Espero que encontre um pedacinho de si nesta história."

];

elementoDedicatria.textContent =
    dedicatórias[Math.floor(Math.random() * dedicatórias.length)];


/* ================================= */
/* ENCONTRAR A HISTÓRIA */
/* ================================= */

let historiaAtual = null;
let capitulos = [];


// CASO 1: HISTÓRIA CRIADA PELO USUÁRIO

if (idHistoria) {

    let historiasSalvas = [];

    try {

        const dados = localStorage.getItem("historiasLitTune");

        historiasSalvas = dados ? JSON.parse(dados) : [];

        if (!Array.isArray(historiasSalvas)) {
            historiasSalvas = [];
        }

    } catch (erro) {

        console.error("Erro ao carregar histórias:", erro);

        historiasSalvas = [];

    }

    historiaAtual = historiasSalvas.find(function (historia) {

        return String(historia.id) === String(idHistoria);

    });

    if (historiaAtual) {

        capitulos = Array.isArray(historiaAtual.capitulos)
            ? historiaAtual.capitulos
            : [];

    }

}


// CASO 2: LIVRO DE EXEMPLO DA PÁGINA INICIAL

else if (origem === "exemplo") {

    historiaAtual = {

        titulo: parametros.get("titulo") || "Uma nova história",

        tipo: parametros.get("tipo") || "LIVRO",

        autor: parametros.get("autor") || "Autor(a) independente",

        sinopse: parametros.get("descricao") || "",

        genero: "",

        capitulos: capitulosExemplo

    };

    capitulos = capitulosExemplo;

}


/* ================================= */
/* MOSTRAR INFORMAÇÕES DA HISTÓRIA */
/* ================================= */

if (!historiaAtual) {

    elementoTitulo.textContent = "História não encontrada";

    elementoTipo.textContent = "";

    elementoAutor.textContent = "";

    elementoDescricao.textContent =
        "Não foi possível encontrar esta história. Volte à página anterior e tente novamente.";

    elementoTituloCapitulo.textContent = "";

    elementoTextoHistoria.textContent = "";

    seletorCapitulo.innerHTML = "";

    botaoAnterior.disabled = true;
    botaoProximo.disabled = true;

    // Esconder progresso se a história não existir
    areaProgresso.style.display = "none";

} else {

    elementoTitulo.textContent = historiaAtual.titulo;

    elementoTipo.textContent = historiaAtual.tipo || "LIVRO";

    elementoAutor.textContent =
        "Por: " + (historiaAtual.autor || "Autor(a) independente");

    elementoDescricao.textContent =
        historiaAtual.sinopse || "Uma história para descobrir.";


    /* ================================= */
    /* CAPA DA HISTÓRIA */
    /* ================================= */

    const classeCapa = parametros.get("capa");

    const capasPermitidas = [
        "capa-livro",
        "capa-fanfic",
        "capa-romance",
        "capa-fantasia",
        "capa-misterio",
        "capa-aventura"
    ];

    elementoCapa.classList.remove(...capasPermitidas);

    if (capasPermitidas.includes(classeCapa)) {

        elementoCapa.classList.add(classeCapa);

    } else if (
        String(historiaAtual.tipo).toLowerCase() === "fanfic"
    ) {

        elementoCapa.classList.add("capa-fanfic");

    } else {

        elementoCapa.classList.add("capa-livro");

    }


    /* ================================= */
    /* VERIFICAR CAPÍTULOS */
    /* ================================= */

    if (capitulos.length === 0) {

        seletorCapitulo.innerHTML = "";

        const opcao = document.createElement("option");

        opcao.value = "";
        opcao.textContent = "Nenhum capítulo disponível";

        seletorCapitulo.appendChild(opcao);

        elementoTituloCapitulo.textContent = "Sem capítulos";

        elementoTextoHistoria.textContent =
            "Esta história ainda não possui capítulos. Volte à página de escrita e adicione seu primeiro capítulo.";

        botaoAnterior.disabled = true;
        botaoProximo.disabled = true;

        // Esconder progresso quando não houver capítulos
        areaProgresso.style.display = "none";

    } else {

        // Mostrar progresso
        areaProgresso.style.display = "block";

        // Recuperar o último capítulo acessado
        let capituloAtual = 0;

        try {

            const progressoSalvo =
                localStorage.getItem(chaveProgresso);

            if (progressoSalvo !== null) {

                const indiceSalvo = Number(progressoSalvo);

                if (
                    Number.isInteger(indiceSalvo) &&
                    indiceSalvo >= 0 &&
                    indiceSalvo < capitulos.length
                ) {

                    capituloAtual = indiceSalvo;

                }

            }

        } catch (erro) {

            console.error("Erro ao recuperar progresso:", erro);

        }


        /* ================================= */
        /* CRIAR OPÇÕES DO SELETOR */
        /* ================================= */

        seletorCapitulo.innerHTML = "";

        capitulos.forEach(function (capitulo, indice) {

            const opcao = document.createElement("option");

            opcao.value = indice;

            opcao.textContent =
                "Capítulo " + (indice + 1) +
                " — " + (capitulo.titulo || "Sem título");

            seletorCapitulo.appendChild(opcao);

        });


        /* ================================= */
        /* MOSTRAR CAPÍTULO */
        /* ================================= */

        function mostrarCapitulo() {

            const capitulo = capitulos[capituloAtual];

            if (!capitulo) return;

            elementoTituloCapitulo.textContent =
                "Capítulo " + (capituloAtual + 1) +
                " — " + (capitulo.titulo || "Sem título");

            // Aceita os capítulos salvos pelo usuário
            // e também os capítulos de exemplo.
            elementoTextoHistoria.textContent =
                capitulo.conteudo || capitulo.texto || "Este capítulo não possui conteúdo.";

            elementoTextoHistoria.style.whiteSpace = "pre-wrap";

            seletorCapitulo.value = capituloAtual;

            botaoAnterior.disabled = capituloAtual === 0;

            botaoProximo.disabled =
                capituloAtual === capitulos.length - 1;


            /* ================================= */
            /* ATUALIZAR PROGRESSO DE LEITURA */
            /* ================================= */

            const totalCapitulos = capitulos.length;

            const quantidadeLida = capituloAtual + 1;

            const porcentagem = Math.round(
                (quantidadeLida / totalCapitulos) * 100
            );

            porcentagemProgresso.textContent = porcentagem + "%";

            textoProgresso.textContent =
                quantidadeLida + " de " + totalCapitulos + " capítulos";

            barraProgresso.style.width = porcentagem + "%";


            // Salvar o último capítulo acessado
            try {

                localStorage.setItem(
                    chaveProgresso,
                    capituloAtual
                );

            } catch (erro) {

                console.error("Erro ao salvar progresso:", erro);

            }

        }


        /* ================================= */
        /* ESCOLHER CAPÍTULO */
        /* ================================= */

        seletorCapitulo.addEventListener("change", function () {

            capituloAtual = Number(seletorCapitulo.value);

            mostrarCapitulo();

        });


        /* ================================= */
        /* CAPÍTULO ANTERIOR */
        /* ================================= */

        botaoAnterior.addEventListener("click", function () {

            if (capituloAtual > 0) {

                capituloAtual--;

                mostrarCapitulo();

                document.querySelector(".capitulo").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });


        /* ================================= */
        /* PRÓXIMO CAPÍTULO */
        /* ================================= */

        botaoProximo.addEventListener("click", function () {

            if (capituloAtual < capitulos.length - 1) {

                capituloAtual++;

                mostrarCapitulo();

                document.querySelector(".capitulo").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });


        // Abre o último capítulo acessado
        mostrarCapitulo();

    }

}


/* ================================= */
/* FINALIZAÇÃO */
/* ================================= */

atualizarIcones();


/* ================================= */
/* PERSONALIZAÇÃO DA LEITURA */
/* ================================= */

const botaoDiminuirFonte =
    document.getElementById("diminuir-fonte");

const botaoAumentarFonte =
    document.getElementById("aumentar-fonte");

const textoTamanhoFonte =
    document.getElementById("tamanho-fonte");

const seletorEspacamento =
    document.getElementById("espacamento-leitura");

const seletorFundo =
    document.getElementById("fundo-leitura");

const areaCapitulo =
    document.querySelector(".capitulo");

const textoCapitulo =
    document.getElementById("texto-historia");


// Preferências iniciais
const preferenciasPadrao = {
    fonte: 18,
    espacamento: "1.5",
    fundo: "bege"
};


// Recuperar preferências salvas
let preferenciasLeitura;

try {

    const preferenciasSalvas =
        localStorage.getItem("preferenciasLeitura");

    preferenciasLeitura = preferenciasSalvas
        ? JSON.parse(preferenciasSalvas)
        : { ...preferenciasPadrao };

} catch (erro) {

    preferenciasLeitura = { ...preferenciasPadrao };

}


// Verificar os valores salvos
if (
    !Number.isFinite(preferenciasLeitura.fonte) ||
    preferenciasLeitura.fonte < 14 ||
    preferenciasLeitura.fonte > 26
) {

    preferenciasLeitura.fonte = 18;

}

if (!["1.5", "1.8", "2"].includes(String(preferenciasLeitura.espacamento))) {

    preferenciasLeitura.espacamento = "1.5";

}

if (!["claro", "bege", "escuro"].includes(preferenciasLeitura.fundo)) {

    preferenciasLeitura.fundo = "bege";

}


// Salvar preferências
function salvarPreferenciasLeitura() {

    localStorage.setItem(
        "preferenciasLeitura",
        JSON.stringify(preferenciasLeitura)
    );

}


// Aplicar preferências
function aplicarPreferenciasLeitura() {

    // Tamanho da fonte
    textoCapitulo.style.fontSize =
        preferenciasLeitura.fonte + "px";

    textoTamanhoFonte.textContent =
        preferenciasLeitura.fonte + "px";


    // Espaçamento entre linhas
    textoCapitulo.style.lineHeight =
        preferenciasLeitura.espacamento;

    seletorEspacamento.value =
        preferenciasLeitura.espacamento;


    // Cor de fundo
    areaCapitulo.classList.remove(
        "fundo-claro",
        "fundo-bege",
        "fundo-escuro"
    );

    areaCapitulo.classList.add(
        "fundo-" + preferenciasLeitura.fundo
    );

    seletorFundo.value =
        preferenciasLeitura.fundo;


    // Desativar botões nos limites
    botaoDiminuirFonte.disabled =
        preferenciasLeitura.fonte <= 14;

    botaoAumentarFonte.disabled =
        preferenciasLeitura.fonte >= 26;

}


// Diminuir fonte
botaoDiminuirFonte.addEventListener("click", function () {

    if (preferenciasLeitura.fonte > 14) {

        preferenciasLeitura.fonte -= 2;

        aplicarPreferenciasLeitura();
        salvarPreferenciasLeitura();

    }

});


// Aumentar fonte
botaoAumentarFonte.addEventListener("click", function () {

    if (preferenciasLeitura.fonte < 26) {

        preferenciasLeitura.fonte += 2;

        aplicarPreferenciasLeitura();
        salvarPreferenciasLeitura();

    }

});


// Alterar espaçamento
seletorEspacamento.addEventListener("change", function () {

    preferenciasLeitura.espacamento =
        seletorEspacamento.value;

    aplicarPreferenciasLeitura();
    salvarPreferenciasLeitura();

});


// Alterar fundo
seletorFundo.addEventListener("change", function () {

    preferenciasLeitura.fundo =
        seletorFundo.value;

    aplicarPreferenciasLeitura();
    salvarPreferenciasLeitura();

});


// Aplicar configurações ao abrir o leitor
aplicarPreferenciasLeitura();
