/**
 * PARTICLES - Sistema de confete isolado
 */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    explode(x, y) {
        const colors = ['#00d4ff', '#7b2cbf', '#00ff88', '#ffffff'];
        
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 1) * 12,
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2 + Math.random() * 4,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8
            });
        }
        
        this.animate();
    }
    
    animate() {
        if (this.particles.length === 0) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4;
            p.rot += p.rotSpeed;
            p.life -= p.decay;
            
            if (p.life <= 0) return false;
            
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rot * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            this.ctx.restore();
            
            return true;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}