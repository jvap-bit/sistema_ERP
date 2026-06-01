/**
 * planos.js
 * Toggle Mensal/Anual e redirecionamento dos botões
 */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------
    // Toggle Mensal / Anual
    // -------------------------------------------------------
    const toggleBtn   = document.getElementById('toggleCobranca');
    const labelMensal = document.getElementById('labelMensal');
    const labelAnual  = document.getElementById('labelAnual');
    const valoresEl   = document.querySelectorAll('.valor[data-mensal]');

    let modoAnual = false;

    function formatarPreco(valor) {
        return 'R$ ' + Number(valor).toLocaleString('pt-BR');
    }

    function atualizarPrecos() {
        valoresEl.forEach(el => {
            el.classList.add('trocando');
            setTimeout(() => {
                el.textContent = formatarPreco(modoAnual ? el.dataset.anual : el.dataset.mensal);
                el.classList.remove('trocando');
            }, 200);
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            modoAnual = !modoAnual;
            toggleBtn.classList.toggle('ativo', modoAnual);
            labelMensal.classList.toggle('ativo', !modoAnual);
            labelAnual.classList.toggle('ativo', modoAnual);
            atualizarPrecos();
        });
    }

    // -------------------------------------------------------
    // Botões dos planos
    // -------------------------------------------------------
    document.querySelectorAll('.btn-plano').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.plano === 'Enterprise') {
                window.location.href = 'contato.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    });

});
