/* ============================================
   DEPOIMENTOS.JS — ERP-Version1.4
   Funcionalidades interativas dos Depoimentos
   ============================================ */

/* ANIMAÇÃO DE ENTRADA DOS CARDS AO ROLAR */
function revelarCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        const topo = card.getBoundingClientRect().top;
        if (topo < window.innerHeight - 60) {
            setTimeout(() => card.classList.add('visivel'), i * 120);
        }
    });
}

/* FILTRO POR NÚMERO DE ESTRELAS */
function iniciarFiltros() {
    const filtros = document.getElementById('filtros-depoimentos');
    if (!filtros) return;

    filtros.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-estrelas]');
        if (!btn) return;

        filtros.querySelectorAll('button').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');

        const filtro = btn.dataset.estrelas;
        document.querySelectorAll('.card').forEach(card => {
            if (filtro === 'todos') {
                card.style.display = '';
            } else {
                const estrelas = card.querySelector('.estrelas');
                const qtd = estrelas ? (estrelas.textContent.match(/★/g) || []).length : 0;
                card.style.display = String(qtd) === filtro ? '' : 'none';
            }
        });
    });
}

/* CONTADOR DE AVALIAÇÕES */
function renderizarResumo() {
    const resumo = document.getElementById('resumo-avaliacoes');
    if (!resumo) return;

    const cards = document.querySelectorAll('.card');
    let total = 0;
    let soma = 0;

    cards.forEach(card => {
        const estrelas = card.querySelector('.estrelas');
        if (estrelas) {
            const qtd = (estrelas.textContent.match(/★/g) || []).length;
            soma += qtd;
            total++;
        }
    });

    const media = total ? (soma / total).toFixed(1) : '—';
    resumo.innerHTML = `
        <span style="font-size:2rem;font-weight:800;color:#f59e0b;">${media}</span>
        <span style="font-size:0.85rem;color:#64748b;margin-left:6px;">/ 5,0 &nbsp;·&nbsp; ${total} avaliações</span>
    `;
}

/* BOTÃO "VER MAIS" PARA DEPOIMENTOS EXTRAS */
function iniciarVerMais() {
    const btn = document.getElementById('btn-ver-mais');
    if (!btn) return;

    const extras = document.querySelectorAll('.card.extra');
    extras.forEach(c => c.style.display = 'none');

    btn.addEventListener('click', () => {
        const ocultos = [...extras].some(c => c.style.display === 'none');
        extras.forEach(c => { c.style.display = ocultos ? '' : 'none'; });
        btn.textContent = ocultos ? 'Ver menos ▲' : 'Ver mais depoimentos ▼';
        if (ocultos) revelarCards();
    });
}

/* LOAD */
document.addEventListener('DOMContentLoaded', () => {
    revelarCards();
    iniciarFiltros();
    renderizarResumo();
    iniciarVerMais();
    window.addEventListener('scroll', revelarCards);
});
