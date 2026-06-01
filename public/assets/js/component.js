function carregarComponente(id, arquivo, callback) {
    fetch(arquivo)
        .then(r => r.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
            if (callback) callback();
        })
        .catch(e => console.error('Erro ao carregar componente:', e));
}

// Todas as páginas têm <base> apontando para a raiz do repositório,
// então os caminhos são sempre relativos à raiz — sem lógica condicional.
document.addEventListener('DOMContentLoaded', () => {
    carregarComponente('header', 'public/components/header.html', function() {
        if (typeof sincronizarToggle === 'function') sincronizarToggle();

        // Marca o link ativo no menu
        const links = document.querySelectorAll('.menu a');
        const paginaAtual = window.location.pathname.split('/').pop();
        links.forEach(link => {
            if (link.getAttribute('href') === paginaAtual) {
                link.classList.add('ativo');
            }
        });
    });

    carregarComponente('footer', 'public/components/footer.html');
});
