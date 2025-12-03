
// Interacciones de botones
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Efecto suave al mover el mouse
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const sportsVisual = document.querySelector('.sports-visual');
    if (sportsVisual) {
        sportsVisual.style.transform = `translateY(-50%) translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    }
    
    const planet = document.querySelector('.planet');
    if (planet) {
        planet.style.transform = `translate(${mouseX * -30}px, ${mouseY * -30}px)`;
    }
});

// Animación de scroll suave para los enlaces de navegación
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Efecto de hover en los iconos deportivos
document.querySelectorAll('.sport-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});
