
/* ===== CADASTRO DE USUÁRIO ===== */

const formularioCadastro = document.getElementById("formulario-cadastro");

const nomeCadastro = document.getElementById("nome-cadastro");
const emailCadastro = document.getElementById("email-cadastro");
const senhaCadastro = document.getElementById("senha-cadastro");
const confirmarSenha = document.getElementById("confirmar-senha");

const mensagemCadastro = document.getElementById("mensagem-cadastro");

const chaveUsuarios = "litTuneUsuarios";
const chaveUsuarioLogado = "litTuneUsuarioLogado";


/* ===== MOSTRAR MENSAGENS ===== */

function mostrarMensagem(texto, tipo) {
    mensagemCadastro.textContent = texto;
    mensagemCadastro.className = "mensagem-autenticacao " + tipo;
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


/* ===== CADASTRAR USUÁRIO ===== */

formularioCadastro.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = nomeCadastro.value.trim();
    const email = emailCadastro.value.trim().toLowerCase();
    const senha = senhaCadastro.value;
    const confirmacao = confirmarSenha.value;

    // Verifica se os campos foram preenchidos
    if (!nome || !email || !senha || !confirmacao) {
        mostrarMensagem("Preencha todos os campos.", "erro");
        return;
    }

    // Verifica o tamanho da senha
    if (senha.length < 6) {
        mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.", "erro");
        return;
    }

    // Verifica se as senhas são iguais
    if (senha !== confirmacao) {
        mostrarMensagem("As senhas não são iguais.", "erro");
        return;
    }

    // Recupera os usuários salvos
    let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem(chaveUsuarios)) || [];
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar os usuários.", "erro");
        return;
    }

    // Verifica se o e-mail já está cadastrado
    const emailExiste = usuarios.some(usuario => usuario.email === email);

    if (emailExiste) {
        mostrarMensagem("Esse e-mail já está cadastrado.", "erro");
        return;
    }

    // Cria o novo usuário
    const novoUsuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        senha: senha
    };

    // Adiciona o usuário à lista
    usuarios.push(novoUsuario);

    // Salva no localStorage
    localStorage.setItem(chaveUsuarios, JSON.stringify(usuarios));

    // Mantém o usuário conectado
    const usuarioLogado = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
    };

    localStorage.setItem(
        chaveUsuarioLogado,
        JSON.stringify(usuarioLogado)
    );

    mostrarMensagem("Cadastro realizado com sucesso!", "sucesso");

    // Vai para a página inicial
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});


/* ===== ÍCONES ===== */

if (window.lucide) {
    lucide.createIcons();
}
