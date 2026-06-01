document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.func-item');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => obs.observe(item));
});
