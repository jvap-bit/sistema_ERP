function carregarComponente(id, arquivo, callback) {
    fetch(arquivo)
        .then(r => r.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
            if (callback) callback();
        })
        .catch(e => console.error('Erro ao carregar componente:', e));
}

document.addEventListener('DOMContentLoaded', () => {
    carregarComponente('header', 'public/components/header.html', function() {
        if (typeof sincronizarToggle === 'function') sincronizarToggle();

        // Marca o link ativo no menu
        const links = document.querySelectorAll('.menu a');
        const paginaAtual = window.location.pathname;
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (paginaAtual.endsWith(href) || paginaAtual.endsWith('/' + href)) {
                link.classList.add('ativo');
            }
        });
    });

    carregarComponente('footer', 'public/components/footer.html');
});