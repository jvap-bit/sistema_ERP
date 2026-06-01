/* ============================================
   FAQ.JS — ERP-Version1.4
   Funcionalidades interativas do FAQ
   Origem: script.js do projeto_apresentacao
   ============================================ */

/* ACORDEÃO — abre/fecha respostas */
function iniciarAcordeao() {
    const perguntas = document.querySelectorAll('.faq-question');

    perguntas.forEach(pergunta => {
        pergunta.addEventListener('click', () => {
            const item    = pergunta.closest('.faq-item');
            const resposta = pergunta.nextElementSibling;
            const aberto  = item.classList.contains('aberto');

            /* Fecha todos antes de abrir o clicado */
            document.querySelectorAll('.faq-item.aberto').forEach(i => {
                i.classList.remove('aberto');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!aberto) {
                item.classList.add('aberto');
                resposta.style.maxHeight = resposta.scrollHeight + 'px';
            }
        });
    });
}

/* BUSCA EM TEMPO REAL */
function iniciarBusca() {
    const input = document.getElementById('busca-faq');
    if (!input) return;

    input.addEventListener('input', () => {
        const termo = input.value.toLowerCase().trim();

        document.querySelectorAll('.faq-item').forEach(item => {
            const pergunta = item.querySelector('.faq-question').textContent.toLowerCase();
            const resposta = item.querySelector('.faq-answer').textContent.toLowerCase();
            const encontrou = pergunta.includes(termo) || resposta.includes(termo);
            item.classList.toggle('oculto', !encontrou);
        });

        /* Mensagem "nenhum resultado" */
        let aviso = document.getElementById('faq-sem-resultado');
        const visiveis = [...document.querySelectorAll('.faq-item')].filter(i => !i.classList.contains('oculto'));

        if (visiveis.length === 0) {
            if (!aviso) {
                aviso = document.createElement('p');
                aviso.id = 'faq-sem-resultado';
                aviso.textContent = 'Nenhuma pergunta encontrada para "' + input.value + '".';
                aviso.style.cssText = 'text-align:center;color:#94a3b8;padding:24px 0;';
                document.querySelector('.container').appendChild(aviso);
            }
        } else if (aviso) {
            aviso.remove();
        }
    });
}

/* ABRIR PRIMEIRO ITEM POR PADRÃO */
function abrirPrimeiro() {
    const primeiro = document.querySelector('.faq-item');
    if (!primeiro) return;
    const resposta = primeiro.querySelector('.faq-answer');
    primeiro.classList.add('aberto');
    resposta.style.maxHeight = resposta.scrollHeight + 'px';
}

/* LOAD */
document.addEventListener('DOMContentLoaded', () => {
    iniciarAcordeao();
    iniciarBusca();
    abrirPrimeiro();
});
