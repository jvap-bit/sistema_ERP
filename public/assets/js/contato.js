function validarFormulario(form) {
    const campos = form.querySelectorAll('input[required], textarea[required], select[required]');
    let valido = true;

    campos.forEach(campo => {
        removerErro(campo);
        if (!campo.value.trim()) {
            mostrarErro(campo, 'Este campo é obrigatório.');
            valido = false;
        } else if (campo.type === 'email' && !validarEmail(campo.value)) {
            mostrarErro(campo, 'Informe um e-mail válido.');
            valido = false;
        }
    });

    return valido;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarErro(campo, msg) {
    campo.style.borderColor = '#e74c3c';
    const erro = document.createElement('small');
    erro.className = 'msg-erro';
    erro.style.cssText = 'color: #e74c3c; font-size: 0.75rem; margin-top: 4px;';
    erro.textContent = msg;
    campo.parentNode.appendChild(erro);
}

function removerErro(campo) {
    campo.style.borderColor = '#ddd';
    const erroAnterior = campo.parentNode.querySelector('.msg-erro');
    if (erroAnterior) erroAnterior.remove();
}

/* FEEDBACK VISUAL AO ENVIAR */
function mostrarSucesso(form) {
    const card = form.closest('.card');
    const mensagem = document.createElement('div');
    mensagem.style.cssText = `
        background: #eafaf1; border-left: 6px solid #27ae60;
        border-radius: 4px; padding: 20px; text-align: center;
        animation: fadeIn 0.4s ease;
    `;
    mensagem.innerHTML = `
        <p style="color: #27ae60; font-size: 1.3rem; font-weight: bold;">✔ Chamado enviado com sucesso!</p>
        <p style="color: #64748b; margin-top: 8px; font-size: 0.9rem;">Nossa equipe entrará em contato em até <strong>2 horas úteis</strong>.</p>
        <button id="btn-novo-chamado" style="margin-top: 16px; padding: 10px 24px; background: #0056b3; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Abrir Novo Chamado
        </button>
    `;

    form.style.display = 'none';
    card.appendChild(mensagem);

    document.getElementById('btn-novo-chamado').addEventListener('click', () => {
        mensagem.remove();
        form.reset();
        form.style.display = 'flex';
    });
}

/* STATUS DOS HUBS — atualização dinâmica de cores */
function iniciarStatusHubs() {
    const linhas = document.querySelectorAll('tbody tr');
    if (!linhas.length) return;

    linhas.forEach(linha => {
        const statusEl = linha.querySelector('span[style*="font-weight"]');
        if (!statusEl) return;

        const capacidadeCell = linha.cells[3];
        if (!capacidadeCell) return;

        const texto = capacidadeCell.textContent;
        const porcentagem = parseInt(texto);

        if (porcentagem >= 80) {
            statusEl.style.color = '#e74c3c';
            statusEl.textContent = '● Capacidade Crítica';
        } else if (porcentagem >= 50) {
            statusEl.style.color = '#e67e22';
            statusEl.textContent = '● Fluxo Intenso';
        } else {
            statusEl.style.color = '#27ae60';
            statusEl.textContent = '● Operação Fluida';
        }
    });
}

/* CONTADOR REGRESSIVO — tempo de resposta estimado */
function iniciarContadorResposta() {
    const alvo = document.querySelector('.card h3');
    if (!alvo || alvo.textContent !== 'Abrir Chamado Técnico / Comercial') return;

    const banner = document.createElement('div');
    banner.style.cssText = `
        background: #0056b3; color: white; text-align: center;
        padding: 10px; border-radius: 6px; margin-bottom: 12px;
        font-size: 0.85rem;
    `;

    const agora = new Date();
    const resposta = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    const hora = resposta.getHours().toString().padStart(2, '0');
    const min = resposta.getMinutes().toString().padStart(2, '0');

    banner.innerHTML = `⏱ Próximo retorno estimado: <strong>até ${hora}:${min}</strong> &nbsp;|&nbsp; Suporte ativo 24/7`;
    alvo.parentNode.insertBefore(banner, alvo.nextSibling);
}

/* MÁSCARA DE TELEFONE */
function aplicarMascaraTelefone() {
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            let v = input.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 10) {
                v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else {
                v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            }
            input.value = v;
        });
    });
}

/* LOAD */
document.addEventListener('DOMContentLoaded', () => {

    iniciarStatusHubs();
    iniciarContadorResposta();
    aplicarMascaraTelefone();

    const form = document.querySelector('form');
    if (form) {
        /* Adiciona required nos campos principais */
        const inputNome = form.querySelector('input[type="text"]');
        const inputEmail = form.querySelector('input[type="email"]');
        const textarea = form.querySelector('textarea');
        if (inputNome) inputNome.setAttribute('required', '');
        if (inputEmail) inputEmail.setAttribute('required', '');
        if (textarea) textarea.setAttribute('required', '');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validarFormulario(form)) {
                mostrarSucesso(form);
            }
        });

        /* Limpa erro ao corrigir campo */
        form.querySelectorAll('input, textarea, select').forEach(campo => {
            campo.addEventListener('input', () => removerErro(campo));
        });
    }

    /* Estilo de animação */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

});
