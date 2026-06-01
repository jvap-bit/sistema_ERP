function animarContador(id, valorFinal) {

    const el = document.getElementById(id);
    let valor = 0;

    const intervalo = setInterval(() => {

        valor += Math.ceil(valorFinal / 60);

        if (valor >= valorFinal) {
            valor = valorFinal;
            clearInterval(intervalo);
        }

        el.innerText = valor + "+";

    }, 30);
}

/* ANIMAÇÃO AO ROLAR */
function revelarScroll(){
    const elementos = document.querySelectorAll('.fade');

    elementos.forEach(el=>{
        const topo = el.getBoundingClientRect().top;

        if(topo < window.innerHeight - 80){
            el.classList.add('show');
        }
    });
}

window.addEventListener('scroll', revelarScroll);

/* LOAD */
document.addEventListener("DOMContentLoaded", () => {

    revelarScroll();

    animarContador("qtd-clientes",150);
    animarContador("qtd-estados",26);
    animarContador("qtd-projetos",500);

});