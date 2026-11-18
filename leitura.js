/* ================================= */
/* MODO CLARO E ESCURO */
/* ================================= */

const botaoTema = document.getElementById("botao-tema");

// Recupera o tema salvo na tela inicial
function atualizarTema() {

    const temaSalvo = localStorage.getItem("tema");

    const modoEscuro = temaSalvo === "escuro";

    document.body.classList.toggle("modo-escuro", modoEscuro);

    if (modoEscuro) {

        botaoTema.innerHTML =
            '<i data-lucide="sun" class="icone-tema"></i>';

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo claro"
        );

    } else {

        botaoTema.innerHTML =
            '<i data-lucide="moon" class="icone-tema"></i>';

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo escuro"
        );

    }

    lucide.createIcons();
}

// Aplica o tema salvo ao abrir a leitura
atualizarTema();

// Permite trocar o tema na página de leitura
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
/* INFORMAÇÕES DO LIVRO */
/* ================================= */

const parametros = new URLSearchParams(window.location.search);

const titulo = parametros.get("titulo") || "Uma nova história";
const tipo = parametros.get("tipo") || "LIVRO";
const autor = parametros.get("autor") || "Autor(a) independente";
const descricao = parametros.get("descricao") || "";
const classeCapa = parametros.get("capa");

document.getElementById("titulo-leitura").textContent = titulo;
document.getElementById("tipo-leitura").textContent = tipo;
document.getElementById("autor-leitura").textContent = "Por: " + autor;
document.getElementById("descricao-leitura").textContent = descricao;

// Mantém a capa correspondente ao cartão
const capaLeitura = document.getElementById("capa-leitura");

const capasPermitidas = [
    "capa-livro",
    "capa-fanfic",
    "capa-romance",
    "capa-fantasia",
    "capa-misterio",
    "capa-aventura"
];

if (capasPermitidas.includes(classeCapa)) {
    capaLeitura.classList.remove("capa-livro");
    capaLeitura.classList.add(classeCapa);
}


/* ================================= */
/* DEDICATÓRIAS ALEATÓRIAS */
/* ================================= */

const dedicatórias = [
    "Para todos aqueles que encontram nos livros um lugar para chamar de lar.",

    "Para quem nunca deixou de acreditar no poder de uma boa história.",

    "Dedico estas páginas aos sonhadores que encontram magia nas pequenas coisas.",

    "Para você, que chegou até aqui. Espero que encontre um pedacinho de si nesta história."
];

const dedicatóriaAleatoria =
    dedicatórias[Math.floor(Math.random() * dedicatórias.length)];

document.getElementById("texto-dedicatoria").textContent =
    dedicatóriaAleatoria;


/* ================================= */
/* CAPÍTULOS ALEATÓRIOS */
/* ================================= */

const capitulos = [

    {
        titulo: "Capítulo 1 — Um novo começo",

        texto: `O dia parecia comum, mas havia algo diferente no ar.

Ela caminhava pelas ruas enquanto observava as pessoas ao seu redor. Pensava em tudo o que havia acontecido e em tudo aquilo que ainda poderia acontecer.

Talvez fosse hora de mudar. Talvez algumas histórias precisassem começar justamente quando menos esperamos.

E, sem perceber, aquele seria apenas o primeiro capítulo de algo muito maior.`
    },

    {
        titulo: "Capítulo 2 — Entre encontros",

        texto: `A chuva começou a cair lentamente.

Ela encontrou abrigo em uma pequena livraria, onde o cheiro dos livros antigos parecia tornar tudo mais tranquilo.

Enquanto procurava algo para ler, seus olhos encontraram outra pessoa.

Um sorriso discreto. Um olhar curioso.

Às vezes, os melhores acontecimentos começam com encontros inesperados.`
    },

    {
        titulo: "Capítulo 3 — O que vem depois",

        texto: `Naquela noite, ela percebeu que nem todas as respostas precisavam ser encontradas imediatamente.

Algumas coisas precisavam de tempo, outras de coragem.

Abriu seu caderno, escreveu algumas palavras e sorriu.

Pela primeira vez em muito tempo, estava animada para descobrir o que aconteceria no dia seguinte.`
    }

];

/* ================================= */
/* NAVEGAÇÃO ENTRE CAPÍTULOS */
/* ================================= */

let capituloAtual = 0;

const seletorCapitulo =
    document.getElementById("capitulo-escolhido");

const botaoAnterior =
    document.getElementById("capitulo-anterior");

const botaoProximo =
    document.getElementById("proximo-capitulo");


// Cria as opções do seletor automaticamente
capitulos.forEach(function (capitulo, indice) {

    const opcao = document.createElement("option");

    opcao.value = indice;
    opcao.textContent = capitulo.titulo;

    seletorCapitulo.appendChild(opcao);

});


// Mostra o capítulo escolhido
function mostrarCapitulo() {

    const capitulo = capitulos[capituloAtual];

    document.getElementById("titulo-capitulo").textContent =
        capitulo.titulo;

    document.getElementById("texto-historia").textContent =
        capitulo.texto;

    // Atualiza o seletor
    seletorCapitulo.value = capituloAtual;

    // Desativa o botão anterior no primeiro capítulo
    botaoAnterior.disabled = capituloAtual === 0;

    // Desativa o próximo no último capítulo
    botaoProximo.disabled =
        capituloAtual === capitulos.length - 1;

}


// Escolher capítulo pelo seletor
seletorCapitulo.addEventListener("change", function () {

    capituloAtual = Number(seletorCapitulo.value);

    mostrarCapitulo();

});


// Voltar ao capítulo anterior
botaoAnterior.addEventListener("click", function () {

    if (capituloAtual > 0) {

        capituloAtual--;

        mostrarCapitulo();

    }

});


// Avançar para o próximo capítulo
botaoProximo.addEventListener("click", function () {

    if (capituloAtual < capitulos.length - 1) {

        capituloAtual++;

        mostrarCapitulo();

    }

});


// Mostra o primeiro capítulo ao abrir a página
mostrarCapitulo();


// Ativa os ícones
lucide.createIcons();

mostrarCapitulo();


/* ================================= */
/* PRÓXIMO CAPÍTULO */
/* ================================= */

document.getElementById("proximo-capitulo").addEventListener("click", function () {

    capituloAtual++;

    if (capituloAtual >= capitulos.length) {
        capituloAtual = 0;
    }

    mostrarCapitulo();

    window.scrollTo({
        top: document.querySelector(".capitulo").offsetTop,
        behavior: "smooth"
    });

});


// Ativa os ícones
lucide.createIcons();
