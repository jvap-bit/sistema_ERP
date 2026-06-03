function mostrarMensagem(texto, tipo) {
    const el = document.getElementById('mensagem');
    if (!el) return;
    el.textContent = texto;
    el.className = tipo === 'sucesso' ? 'sucesso' : 'erro';
    setTimeout(() => { el.textContent = ''; el.className = ''; }, 4000);
}

function cadastrar() {
    const gmail = document.getElementById('cadEmail').value.trim();
    const senha = document.getElementById('cadSenha').value;

    if (!gmail || !senha) {
        mostrarMensagem('Preencha todos os campos.', 'erro');
        return;
    }
    if (senha.length < 6) {
        mostrarMensagem('A senha deve ter ao menos 6 caracteres.', 'erro');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
    if (usuarios[gmail]) {
        mostrarMensagem('Este e-mail já está cadastrado.', 'erro');
        return;
    }

    usuarios[gmail] = senha;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarMensagem('Conta criada com sucesso! Faça login.', 'sucesso');

    document.getElementById('cadEmail').value = '';
    document.getElementById('cadSenha').value = '';
}

function fazerLogin() {
    const gmail = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    if (!gmail || !senha) {
        mostrarMensagem('Preencha e-mail e senha.', 'erro');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
    if (usuarios[gmail] && usuarios[gmail] === senha) {
        localStorage.setItem('usuarioLogado', gmail);
        const BASE_URL = window.location.origin +'/sistema_ERP/';
        window.location.href = BASE_URL + 'app/app.html';
    } else {
        mostrarMensagem('E-mail ou senha incorretos.', 'erro');
    }
}
