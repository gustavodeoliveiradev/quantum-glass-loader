/**
 * BACKGROUND PARTICLES - Partículas flutuantes sutis
 */

const BackgroundParticles = {
    container: null,
    particleCount: 20,

    init() {
        this.container = document.createElement('div');
        this.container.className = 'bg-particles';
        document.body.insertBefore(this.container, document.body.firstChild);

        this.createParticles();
    },

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';

            // Posição e animação aleatórias
            const left = Math.random() * 100;
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * -20;
            const size = 2 + Math.random() * 4;

            particle.style.left = left + '%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';

            this.container.appendChild(particle);
        }
    }
};
