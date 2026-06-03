// ─── Inicialização ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Verifica login
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) {
        window.location.href = '../public/pages/login.html';
        return;
    }
    const el = document.getElementById('usuario');
    if (el) el.textContent = `Bem-vindo, ${usuario}`;

    // Aplica tema salvo
    sincronizarTemaApp();
});

// ─── Sincroniza toggle visual com o tema salvo ───────────────
function sincronizarTemaApp() {
    const isDark = localStorage.getItem('tema') === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    const toggle = document.getElementById('theme-toggle');
    const label  = document.getElementById('theme-label');
    if (toggle) toggle.checked = isDark;
    if (label)  label.textContent = isDark ? '🌙Escuro' : '☀️Claro';
}

// ─── Alterna tema (chamado pelo toggle) ──────────────────────
function alternarTema() {
    const toggle = document.getElementById('theme-toggle');
    const label  = document.getElementById('theme-label');
    const isDark = toggle ? toggle.checked : false;
    document.body.classList.toggle('dark-mode', isDark);
    if (label) label.textContent = isDark ? '🌙Escuro' : '☀️Claro';
    localStorage.setItem('tema', isDark ? 'dark' : 'light');
}

// ─── Logout ──────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('usuarioLogado');
    const BASE_URL = window.location.origin +'/sistema_ERP/';
        window.location.href = BASE_URL + 'app/app.html';
}

// ─── Módulos não implementados ───────────────────────────────
function abrirModulo(nome) {
    alert(`Módulo "${nome}" em desenvolvimento.\nEm breve disponível!`);
}
