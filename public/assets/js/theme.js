// ─── Aplica tema imediatamente para evitar flash branco ───
(function() {
    if (localStorage.getItem('tema') === 'dark') {
        document.documentElement.style.backgroundColor = '#0f172a';
        document.body && document.body.classList.add('dark-mode');
    }
})();

// ─── Função global de alternância (chamada pelo toggle no header) ───
function alternarTema() {
    const toggle = document.getElementById('theme-toggle');
    const label  = document.getElementById('theme-label');
    const isDark = toggle ? toggle.checked : false;

    document.body.classList.toggle('dark-mode', isDark);
    if (label) label.textContent = isDark ? '🌙Escuro' : '☀️Claro';
    localStorage.setItem('tema', isDark ? 'dark' : 'light');
}

// ─── Sincroniza o toggle visual após o header ser injetado ───
function sincronizarToggle() {
    const isDark = localStorage.getItem('tema') === 'dark';
    const toggle = document.getElementById('theme-toggle');
    const label  = document.getElementById('theme-label');

    if (isDark) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');

    if (toggle) toggle.checked = isDark;
    if (label)  label.textContent = isDark ? '🌙Escuro' : '☀️Claro';
}
