/**
 * ANIMATION ENGINE - Animações avançadas e sincronizadas
 */

const AnimationEngine = {
    ring: null,
    glow: null,
    value: null,
    
    init() {
        this.ring = document.querySelector('.progress-ring-wrapper');
        this.glow = document.getElementById('ring-glow');
        this.value = document.getElementById('progress-value');
    },
    
    /**
     * Pulso sincronizado com áudio
     */
    pulseOnBeat(intensity = 1) {
        if (!this.ring) return;
        
        this.ring.style.transform = `scale(${1 + intensity * 0.02})`;
        setTimeout(() => {
            this.ring.style.transform = 'scale(1)';
        }, 100);
    },
    
    /**
     * Glow que pulsa conforme o progresso
     */
    updateGlowIntensity(percent) {
        if (!this.glow) return;
        
        const intensity = percent / 100;
        const shadowSize = 20 + (intensity * 30);
        const opacity = 0.1 + (intensity * 0.4);
        
        this.glow.style.boxShadow = `0 0 ${shadowSize}px rgba(0, 212, 255, ${opacity})`;
    },
    
    /**
     * Shake sutil no erro
     */
    shakeError() {
        const container = document.querySelector('.glass-container');
        if (!container) return;
        
        container.style.animation = 'none';
        container.offsetHeight; // Trigger reflow
        container.style.animation = 'shake 0.5s ease-in-out';
    },
    
    /**
     * Efeito de "respiração" no container
     */
    breathe(active) {
        const container = document.querySelector('.glass-container');
        if (!container) return;
        
        if (active) {
            container.style.animation = 'breathe 3s ease-in-out infinite';
        } else {
            container.style.animation = 'none';
        }
    }
};

// Adicionar keyframes dinamicamente
const breatheKeyframes = document.createElement('style');
breatheKeyframes.textContent = `
    @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.005); }
    }
`;
document.head.appendChild(breatheKeyframes);