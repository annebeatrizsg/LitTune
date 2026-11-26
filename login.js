
/* ===== LOGIN DE USUÁRIO ===== */

const formularioLogin = document.getElementById("formulario-login");

const emailLogin = document.getElementById("email-login");
const senhaLogin = document.getElementById("senha-login");

const mensagemLogin = document.getElementById("mensagem-login");

const chaveUsuarios = "litTuneUsuarios";
const chaveUsuarioLogado = "litTuneUsuarioLogado";


/* ===== MOSTRAR MENSAGENS ===== */

function mostrarMensagem(texto, tipo) {
    mensagemLogin.textContent = texto;
    mensagemLogin.className = "mensagem-autenticacao " + tipo;
}


/* ===== MOSTRAR OU ESCONDER SENHA ===== */

document.querySelectorAll(".mostrar-senha").forEach(botao => {
    botao.addEventListener("click", () => {
        const campo = document.getElementById(botao.dataset.alvo);

        if (campo.type === "password") {
            campo.type = "text";
            botao.innerHTML = '<i data-lucide="eye-off"></i>';
        } else {
            campo.type = "password";
            botao.innerHTML = '<i data-lucide="eye"></i>';
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    });
});


/* ===== ENTRAR NA CONTA ===== */

formularioLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const email = emailLogin.value.trim().toLowerCase();
    const senha = senhaLogin.value;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
        mostrarMensagem("Preencha todos os campos.", "erro");
        return;
    }

    // Recupera os usuários cadastrados
    let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem(chaveUsuarios)) || [];
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar os usuários.", "erro");
        return;
    }

    // Procura o usuário pelo e-mail
    const usuarioEncontrado = usuarios.find(usuario => {
        return usuario.email === email;
    });

    // Verifica se o e-mail existe
    if (!usuarioEncontrado) {
        mostrarMensagem("E-mail não cadastrado.", "erro");
        return;
    }

    // Verifica se a senha está correta
    if (usuarioEncontrado.senha !== senha) {
        mostrarMensagem("Senha incorreta. Tente novamente.", "erro");
        return;
    }

    // Salva os dados da sessão, sem a senha
    const usuarioLogado = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email
    };

    localStorage.setItem(
        chaveUsuarioLogado,
        JSON.stringify(usuarioLogado)
    );

    mostrarMensagem("Login realizado com sucesso!", "sucesso");

    // Vai para a página inicial
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});


/* ===== ÍCONES ===== */

if (window.lucide) {
    lucide.createIcons();
}
