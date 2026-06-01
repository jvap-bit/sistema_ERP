/**
 * integracoes.js
 * Lógica interativa da página de Integrações
 */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------
    // Animação de entrada dos cards (Intersection Observer)
    // -------------------------------------------------------
    const cards = document.querySelectorAll('.integracao-card');

    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = (card.dataset.index || 0) * 100;

                setTimeout(() => {
                    card.classList.add('visivel');
                }, delay);

                observador.unobserve(card);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => observador.observe(card));

    // -------------------------------------------------------
    // Botão "Falar com o time técnico"
    // -------------------------------------------------------
    const btnContato = document.getElementById('btnContatoIntegra');

    if (btnContato) {
        btnContato.addEventListener('click', () => {
            window.location.href = 'contato.html';
        });
    }

});
