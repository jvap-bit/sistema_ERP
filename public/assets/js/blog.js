function animarKPI(elemento, valorFinal, sufixo = '') {
    let valor = 0;
    const duracao = 1500;
    const passos = 60;
    const incremento = valorFinal / passos;
    const intervalo = duracao / passos;

    const timer = setInterval(() => {
        valor += incremento;
        if (valor >= valorFinal) {
            valor = valorFinal;
            clearInterval(timer);
        }
        elemento.innerText = formatarNumero(valor) + sufixo;
    }, intervalo);
}

function formatarNumero(n) {
    const inteiro = Math.floor(n);
    if (inteiro >= 1000) {
        return inteiro.toLocaleString('pt-BR');
    }
    return inteiro;
}

/* FADE IN AO ROLAR */
function revelarScroll() {
    const elementos = document.querySelectorAll('.fade-in');
    elementos.forEach(el => {
        const topo = el.getBoundingClientRect().top;
        if (topo < window.innerHeight - 80) {
            el.classList.add('visivel');
        }
    });
}

/* FILTRO DE ARTIGOS POR CATEGORIA */
function iniciarFiltros() {
    const botoes = document.querySelectorAll('[data-filtro]');
    const artigos = document.querySelectorAll('[data-categoria]');

    if (!botoes.length) return;

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const filtro = btn.dataset.filtro;

            botoes.forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');

            artigos.forEach(art => {
                if (filtro === 'todos' || art.dataset.categoria === filtro) {
                    art.style.display = '';
                    art.classList.add('fade-in', 'visivel');
                } else {
                    art.style.display = 'none';
                }
            });
        });
    });
}

/* GRÁFICO DE PIZZA */
function iniciarGraficoPizza() {
    const pizza = document.querySelector('.chart-pizza');
    if (!pizza) return;

    const segmentos = [
        { label: 'Logística Industrial (B2B)', valor: '45%', cor: '#06b6d4' },
        { label: 'Distribuição E-commerce (B2C)', valor: '30%', cor: '#0056b3' },
        { label: 'Logística Reversa', valor: '25%', cor: '#06b6d4' },
    ];

    const tooltip = document.createElement('div');
    tooltip.id = 'pizza-tooltip';
    tooltip.style.cssText = `
        position: fixed; background: #0056b3; color: white;
        padding: 8px 14px; border-radius: 6px; font-size: 0.8rem;
        pointer-events: none; display: none; z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);

    pizza.addEventListener('mousemove', (e) => {
        const rect = pizza.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angulo = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        const grau = (angulo + 360) % 360;

        let segmento;
        if (grau < 162) segmento = segmentos[0];
        else if (grau < 270) segmento = segmentos[1];
        else segmento = segmentos[2];

        tooltip.textContent = `${segmento.label}: ${segmento.valor}`;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });

    pizza.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

/* BARRA DE PROGRESSO DE LEITURA */
function iniciarProgressoLeitura() {
    const barra = document.createElement('div');
    barra.id = 'progresso-leitura';
    barra.style.cssText = `
        position: fixed; top: 0; left: 0; height: 4px;
        background: linear-gradient(90deg, #06b6d4, #27ae60);
        width: 0%; z-index: 10000; transition: width 0.1s ease;
    `;
    document.body.prepend(barra);

    window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        const progresso = (window.scrollY / total) * 100;
        barra.style.width = Math.min(progresso, 100) + '%';
    });
}

/* LOAD */
document.addEventListener('DOMContentLoaded', () => {

    iniciarProgressoLeitura();
    iniciarFiltros();
    iniciarGraficoPizza();
    revelarScroll();

    /* Anima KPIs se existirem */
    const kpis = [
        { id: 'kpi-otif',   valor: 998, sufixo: '%' },
        { id: 'kpi-frota',  valor: 1150, sufixo: '' },
    ];

    kpis.forEach(({ id, valor, sufixo }) => {
        const el = document.getElementById(id);
        if (el) animarKPI(el, valor, sufixo);
    });

    window.addEventListener('scroll', revelarScroll);
});
