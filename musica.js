
/* ===== CONFIGURAÇÕES INICIAIS ===== */

const botaoTema = document.getElementById("botao-tema");

const chavePlaylists = "litTunePlaylists";
const chavePlataformas = "litTunePlataformas";

let playlists = JSON.parse(localStorage.getItem(chavePlaylists)) || [];
let playlistAtual = null;
let musicaAtual = 0;
let audio = new Audio();

let youtubeAtivo = false;
let youtubePausado = false;
let spotifyAtivo = false;

/* ===== MODO CLARO E ESCURO ===== */

function atualizarTema() {
    const modoEscuro = localStorage.getItem("tema") === "escuro";

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
    botaoTema.addEventListener("click", function () {
        const modoEscuro = document.body.classList.contains("modo-escuro");

        localStorage.setItem(
            "tema",
            modoEscuro ? "claro" : "escuro"
        );

        atualizarTema();
    });
}

/* ===== SALVAR PLAYLISTS ===== */

function salvarPlaylists() {
    localStorage.setItem(
        chavePlaylists,
        JSON.stringify(playlists)
    );
}

/* ===== PLAYLISTS INICIAIS ===== */

function carregarPlaylists() {
    if (playlists.length === 0) {
        const cartoes = document.querySelectorAll(".cartao-playlist");

        cartoes.forEach((cartao, indice) => {
            const titulo = cartao.querySelector("h3").textContent;
            const descricao = cartao.querySelector("p").textContent;

            playlists.push({
                id: Date.now() + indice,
                nome: titulo,
                descricao: descricao,
                musicas: []
            });
        });

        salvarPlaylists();
    }

    mostrarPlaylists();
}

/* ===== MOSTRAR PLAYLISTS ===== */

function mostrarPlaylists() {
    const grade = document.querySelector(".grade-playlists");

    if (!grade) return;

    grade.innerHTML = "";

    playlists.forEach((playlist, indice) => {
        const cartao = document.createElement("article");

        cartao.className = "cartao-playlist";

        const classes = [
            "capa-romance",
            "capa-fantasia",
            "capa-calma",
            "capa-misterio"
        ];

        cartao.innerHTML = `
            <div class="capa-playlist ${classes[indice % classes.length]}">
                <i data-lucide="music"></i>
            </div>

            <h3></h3>
            <p></p>
        `;

        cartao.querySelector("h3").textContent = playlist.nome;

        cartao.querySelector("p").textContent =
            `${playlist.musicas.length} música(s)`;

        cartao.addEventListener("click", function () {
            abrirPlaylist(playlist.id);
        });

        grade.appendChild(cartao);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

/* ===== CRIAR PLAYLIST ===== */

const botaoCriar = document.querySelector(".botao-criar-playlist");

if (botaoCriar) {
    botaoCriar.addEventListener("click", function () {
        const nome = prompt("Qual será o nome da sua playlist?");

        if (!nome || !nome.trim()) return;

        const descricao = prompt("Escreva uma pequena descrição:");

        const novaPlaylist = {
            id: Date.now(),
            nome: nome.trim(),
            descricao: descricao ? descricao.trim() : "Minha playlist",
            musicas: []
        };

        playlists.push(novaPlaylist);

        salvarPlaylists();
        mostrarPlaylists();

        alert("Sua playlist foi criada com sucesso! 🤎");
    });
}

/* ===== ABRIR PLAYLIST ===== */

function abrirPlaylist(id) {
    playlistAtual = playlists.find(
        playlist => playlist.id === id
    );

    if (!playlistAtual) return;

    const escolha = prompt(
        `Playlist: ${playlistAtual.nome}\n\n` +
        `Músicas: ${playlistAtual.musicas.length}\n\n` +
        "Digite:\n" +
        "1 - Adicionar música\n" +
        "2 - Reproduzir playlist\n" +
        "3 - Ver músicas"
    );

    if (escolha === "1") {
        adicionarMusica();
    }

    if (escolha === "2") {
        reproduzirPlaylist();
    }

    if (escolha === "3") {
        mostrarMusicas();
    }
}

/* ===== IDENTIFICAR LINKS DO YOUTUBE ===== */

function extrairIdYoutube(link) {
    try {
        const url = new URL(link);
        const host = url.hostname.replace(/^www\./, "");

        if (host === "youtu.be") {
            return url.pathname.slice(1).split("/")[0] || null;
        }

        if (
            host === "youtube.com" ||
            host === "m.youtube.com" ||
            host === "music.youtube.com"
        ) {
            if (url.pathname === "/watch") {
                return url.searchParams.get("v");
            }

            const partes = url.pathname.split("/");

            if (["embed", "shorts", "live"].includes(partes[1])) {
                return partes[2] || null;
            }
        }
    } catch {
        return null;
    }

    return null;
}

/* ===== IDENTIFICAR LINKS DO SPOTIFY ===== */

function extrairSpotify(link) {
    try {
        const url = new URL(link.trim());

        if (
            url.hostname !== "open.spotify.com" &&
            url.hostname !== "www.spotify.com"
        ) {
            return null;
        }

        const partes = url.pathname
            .split("/")
            .filter(Boolean);

        const tipos = [
            "track",
            "album",
            "playlist",
            "artist",
            "episode",
            "show"
        ];

        const indice = partes.findIndex(parte =>
            tipos.includes(parte)
        );

        if (indice === -1 || !partes[indice + 1]) {
            return null;
        }

        const id = partes[indice + 1];

        if (!/^[a-zA-Z0-9]+$/.test(id)) {
            return null;
        }

        return {
            tipo: partes[indice],
            id: id
        };

    } catch {
        return null;
    }
}

/* ===== ADICIONAR MÚSICA ===== */

function adicionarMusica() {
    if (!playlistAtual) return;

    const nome = prompt("Qual é o nome da música?");

    if (!nome || !nome.trim()) return;

    const artista = prompt("Quem é o artista?");

    const link = prompt(
        "Cole o link do YouTube, Spotify ou de um arquivo de áudio:"
    );

    if (!link || !link.trim()) {
        alert("Você precisa informar um endereço.");
        return;
    }

    const youtubeId = extrairIdYoutube(link.trim());
    const spotify = extrairSpotify(link.trim());

    let novaMusica;

    if (youtubeId) {
        novaMusica = {
            nome: nome.trim(),
            artista: artista ? artista.trim() : "Artista desconhecido",
            tipo: "youtube",
            videoId: youtubeId
        };

    } else if (spotify) {
        novaMusica = {
            nome: nome.trim(),
            artista: artista ? artista.trim() : "Artista desconhecido",
            tipo: "spotify",
            spotifyTipo: spotify.tipo,
            spotifyId: spotify.id
        };

    } else {
        try {
            const endereco = new URL(link.trim());

            if (!["http:", "https:"].includes(endereco.protocol)) {
                throw new Error("Endereço inválido");
            }

            novaMusica = {
                nome: nome.trim(),
                artista: artista ? artista.trim() : "Artista desconhecido",
                tipo: "audio",
                arquivo: endereco.href
            };

        } catch {
            alert("O endereço informado não é válido.");
            return;
        }
    }

    playlistAtual.musicas.push(novaMusica);

    salvarPlaylists();
    mostrarPlaylists();

    alert("Música adicionada à playlist! 🎵");
}

/* ===== MOSTRAR MÚSICAS ===== */

function mostrarMusicas() {
    if (!playlistAtual) return;

    if (playlistAtual.musicas.length === 0) {
        alert("Essa playlist ainda não tem músicas.");
        return;
    }

    const lista = playlistAtual.musicas
        .map((musica, indice) =>
            `${indice + 1} - ${musica.nome} (${musica.artista})`
        )
        .join("\n");

    alert(
        `Músicas de ${playlistAtual.nome}:\n\n${lista}`
    );
}

/* ===== PLAYER DE MÚSICA ===== */

function criarPlayer() {
    const player = document.createElement("section");

    player.id = "player-musica";

    player.innerHTML = `
        <div class="informacoes-player">
            <div class="mini-capa-player">
                <i data-lucide="music"></i>
            </div>

            <div class="dados-musica">
                <strong id="nome-musica-player">Nenhuma música</strong>
                <span id="artista-musica-player">Escolha uma playlist</span>
            </div>
        </div>

        <div class="controles-player">
            <div class="botoes-player">
                <button id="musica-anterior" aria-label="Música anterior">
                    <i data-lucide="skip-back"></i>
                </button>

                <button id="botao-play-pause" aria-label="Reproduzir">
                    <i data-lucide="play"></i>
                </button>

                <button id="proxima-musica" aria-label="Próxima música">
                    <i data-lucide="skip-forward"></i>
                </button>
            </div>

            <div class="barra-tempo-player">
                <span id="tempo-atual">0:00</span>

                <input
                    type="range"
                    id="progresso-musica"
                    min="0"
                    max="100"
                    value="0"
                >

                <span id="duracao-musica">0:00</span>
            </div>
        </div>

        <div class="volume-player">
            <i data-lucide="volume-2"></i>

            <input
                type="range"
                id="volume-musica"
                min="0"
                max="1"
                step="0.01"
                value="0.7"
            >
        </div>
    `;

    const videoContainer = document.createElement("div");

    videoContainer.id = "video-youtube-container";
    videoContainer.hidden = true;

    const spotifyContainer = document.createElement("div");

    spotifyContainer.id = "spotify-container";
    spotifyContainer.hidden = true;

    const paginaMusica = document.querySelector(".pagina-musica");

    if (paginaMusica) {
        paginaMusica.appendChild(videoContainer);
        paginaMusica.appendChild(spotifyContainer);
    }

    document.body.appendChild(player);

    if (window.lucide) {
        lucide.createIcons();
    }

    document.body.style.paddingBottom = "115px";

    document.getElementById("botao-play-pause")
        .addEventListener("click", alternarReproducao);

    document.getElementById("musica-anterior")
        .addEventListener("click", musicaAnterior);

    document.getElementById("proxima-musica")
        .addEventListener("click", proximaMusica);

    document.getElementById("volume-musica")
        .addEventListener("input", function () {
            audio.volume = Number(this.value);
        });

    document.getElementById("progresso-musica")
        .addEventListener("input", function () {
            if (audio.duration && !youtubeAtivo && !spotifyAtivo) {
                audio.currentTime =
                    (Number(this.value) / 100) * audio.duration;
            }
        });
}

/* ===== REPRODUZIR PLAYLIST ===== */

function reproduzirPlaylist() {
    if (!playlistAtual || playlistAtual.musicas.length === 0) {
        alert("Adicione músicas à playlist antes de reproduzir.");
        return;
    }

    musicaAtual = 0;
    tocarMusica();
}

/* ===== TOCAR MÚSICA ===== */

function tocarMusica() {
    if (!playlistAtual || playlistAtual.musicas.length === 0) {
        return;
    }

    const musica = playlistAtual.musicas[musicaAtual];

    const videoContainer = document.getElementById(
        "video-youtube-container"
    );

    const spotifyContainer = document.getElementById(
        "spotify-container"
    );

    const player = document.getElementById("player-musica");

    document.getElementById("nome-musica-player").textContent =
        musica.nome;

    document.getElementById("artista-musica-player").textContent =
        musica.artista;

    document.getElementById("tempo-atual").textContent = "0:00";
    document.getElementById("duracao-musica").textContent = "0:00";
    document.getElementById("progresso-musica").value = 0;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    videoContainer.hidden = true;
    videoContainer.innerHTML = "";

    spotifyContainer.hidden = true;
    spotifyContainer.innerHTML = "";

    youtubeAtivo = false;
    youtubePausado = false;
    spotifyAtivo = false;

    player.classList.remove(
        "youtube-ativo",
        "spotify-ativo"
    );

    /* YOUTUBE */

    if (musica.tipo === "youtube") {
        youtubeAtivo = true;

        videoContainer.hidden = false;

        const origem = encodeURIComponent(window.location.origin);

        videoContainer.innerHTML = `
            <iframe
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(musica.videoId)}?autoplay=1&rel=0&enablejsapi=1&origin=${origem}"
                title="Reprodução de ${musica.nome.replace(/"/g, "&quot;")}"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen>
            </iframe>
        `;

        player.classList.add("youtube-ativo");

        atualizarBotaoPlayer();

        return;
    }

    /* SPOTIFY */

    if (musica.tipo === "spotify") {
        spotifyAtivo = true;

        spotifyContainer.hidden = false;

        const altura = musica.spotifyTipo === "track" ? 152 : 352;

        spotifyContainer.innerHTML = `
            <iframe
                src="https://open.spotify.com/embed/${encodeURIComponent(musica.spotifyTipo)}/${encodeURIComponent(musica.spotifyId)}?utm_source=generator"
                width="100%"
                height="${altura}"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy">
            </iframe>
        `;

        player.classList.add("spotify-ativo");

        atualizarBotaoPlayer();

        return;
    }

    /* ARQUIVO DE ÁUDIO */

    audio.src = musica.arquivo;

    audio.volume = Number(
        document.getElementById("volume-musica").value
    );

    audio.play()
        .then(() => atualizarBotaoPlayer())
        .catch(() => {
            alert(
                "Não foi possível reproduzir esse áudio. " +
                "Verifique o endereço e tente novamente."
            );

            atualizarBotaoPlayer();
        });
}

/* ===== PLAY E PAUSA ===== */

function alternarReproducao() {
    if (spotifyAtivo) {
        alert("Use os controles do próprio Spotify para reproduzir ou pausar.");
        return;
    }

    if (youtubeAtivo) {
        const iframe = document.querySelector(
            "#video-youtube-container iframe"
        );

        if (!iframe) return;

        const comando = youtubePausado ? "playVideo" : "pauseVideo";

        iframe.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: comando,
                args: []
            }),
            "https://www.youtube-nocookie.com"
        );

        youtubePausado = !youtubePausado;

        atualizarBotaoPlayer();

        return;
    }

    if (!audio.src) {
        if (playlistAtual && playlistAtual.musicas.length > 0) {
            tocarMusica();
        } else {
            alert("Escolha uma playlist com músicas primeiro.");
        }

        return;
    }

    if (audio.paused) {
        audio.play()
            .then(() => atualizarBotaoPlayer())
            .catch(() => {
                alert("Não foi possível reproduzir o áudio.");
            });
    } else {
        audio.pause();
        atualizarBotaoPlayer();
    }
}

/* ===== ATUALIZAR BOTÃO DO PLAYER ===== */

function atualizarBotaoPlayer() {
    const botao = document.getElementById("botao-play-pause");

    if (!botao) return;

    let pausado;

    if (youtubeAtivo) {
        pausado = youtubePausado;
    } else if (spotifyAtivo) {
        pausado = true;
    } else {
        pausado = audio.paused;
    }

    botao.innerHTML = pausado
        ? '<i data-lucide="play"></i>'
        : '<i data-lucide="pause"></i>';

    botao.setAttribute(
        "aria-label",
        pausado ? "Reproduzir" : "Pausar"
    );

    if (window.lucide) {
        lucide.createIcons();
    }
}

/* ===== PRÓXIMA MÚSICA ===== */

function proximaMusica() {
    if (!playlistAtual || playlistAtual.musicas.length === 0) return;

    audio.pause();

    musicaAtual++;

    if (musicaAtual >= playlistAtual.musicas.length) {
        musicaAtual = 0;
    }

    tocarMusica();
}

/* ===== MÚSICA ANTERIOR ===== */

function musicaAnterior() {
    if (!playlistAtual || playlistAtual.musicas.length === 0) return;

    audio.pause();

    musicaAtual--;

    if (musicaAtual < 0) {
        musicaAtual = playlistAtual.musicas.length - 1;
    }

    tocarMusica();
}

/* ===== TEMPO DA MÚSICA ===== */

function formatarTempo(segundos) {
    if (!Number.isFinite(segundos)) return "0:00";

    const minutos = Math.floor(segundos / 60);
    const restante = Math.floor(segundos % 60);

    return `${minutos}:${String(restante).padStart(2, "0")}`;
}

audio.addEventListener("timeupdate", function () {
    const progresso = document.getElementById("progresso-musica");

    if (!progresso || !audio.duration || youtubeAtivo || spotifyAtivo) {
        return;
    }

    progresso.value = (audio.currentTime / audio.duration) * 100;

    document.getElementById("tempo-atual").textContent =
        formatarTempo(audio.currentTime);
});

audio.addEventListener("loadedmetadata", function () {
    if (youtubeAtivo || spotifyAtivo) return;

    document.getElementById("duracao-musica").textContent =
        formatarTempo(audio.duration);
});

audio.addEventListener("ended", proximaMusica);

audio.addEventListener("pause", function () {
    if (!youtubeAtivo && !spotifyAtivo) {
        atualizarBotaoPlayer();
    }
});

audio.addEventListener("play", function () {
    if (!youtubeAtivo && !spotifyAtivo) {
        atualizarBotaoPlayer();
    }
});

/* ===== CONECTAR SPOTIFY E YOUTUBE ===== */

function carregarPlataformas() {
    const plataformas =
        JSON.parse(localStorage.getItem(chavePlataformas)) || {};

    const botoes = document.querySelectorAll(
        ".cartao-plataforma button"
    );

    botoes.forEach(botao => {
        const cartao = botao.closest(".cartao-plataforma");
        const nome = cartao.querySelector("h3").textContent;
        const endereco = plataformas[nome];

        if (endereco) {
            botao.textContent = "Abrir";
        }

        botao.addEventListener("click", function () {
            const plataformasSalvas =
                JSON.parse(localStorage.getItem(chavePlataformas)) || {};

            if (plataformasSalvas[nome]) {
                window.open(
                    plataformasSalvas[nome],
                    "_blank",
                    "noopener,noreferrer"
                );

                return;
            }

            const link = prompt(
                `Cole o link da sua playlist ou perfil do ${nome}:`
            );

            if (!link) return;

            try {
                const url = new URL(link.trim());

                const ehSpotify =
                    url.hostname === "spotify.com" ||
                    url.hostname.endsWith(".spotify.com");

                const ehYoutube =
                    url.hostname === "youtube.com" ||
                    url.hostname.endsWith(".youtube.com") ||
                    url.hostname === "youtu.be";

                if (
                    url.protocol !== "https:" ||
                    (nome === "Spotify" && !ehSpotify) ||
                    (nome === "YouTube" && !ehYoutube)
                ) {
                    throw new Error("Link inválido");
                }

                plataformasSalvas[nome] = url.href;

                localStorage.setItem(
                    chavePlataformas,
                    JSON.stringify(plataformasSalvas)
                );

                botao.textContent = "Abrir";

                alert(`${nome} conectado com sucesso! 🤎`);

            } catch {
                alert(
                    "Esse link não parece ser válido para essa plataforma."
                );
            }
        });
    });
}

/* ===== BOTÃO DESTAQUE ===== */

const botaoDestaque = document.querySelector(".botao-reproduzir");

if (botaoDestaque) {
    botaoDestaque.addEventListener("click", function () {
        if (playlists.length === 0) {
            alert("Crie uma playlist primeiro!");
            return;
        }

        playlistAtual = playlists[0];

        reproduzirPlaylist();
    });
}

/* ===== ABRIR PLAYLIST VINDO DO PERFIL ===== */

function abrirPlaylistDoPerfil() {
    const parametros = new URLSearchParams(window.location.search);
    const idRecebido = parametros.get("playlist");

    if (!idRecebido) return;

    const idPlaylist = Number(idRecebido);

    if (!Number.isSafeInteger(idPlaylist)) {
        alert("Não foi possível identificar essa playlist.");
        return;
    }

    const playlistEncontrada = playlists.find(
        playlist => playlist.id === idPlaylist
    );

    if (!playlistEncontrada) {
        alert("Essa playlist não foi encontrada.");
        return;
    }

    // Abre a playlist selecionada após carregar a página.
    abrirPlaylist(playlistEncontrada.id);

    // Remove o parâmetro da URL para evitar abrir novamente ao atualizar.
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}

/* ===== INICIALIZAÇÃO ===== */

carregarPlaylists();
criarPlayer();
carregarPlataformas();
atualizarTema();
abrirPlaylistDoPerfil();

console.log("LitTune Música carregado com sucesso! 🎵");
