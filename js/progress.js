/**
 * PROGRESS - Lógica de animação não-linear
 */

const Progress = {
    particles: null,
    
    init(particleSystem) {
        this.particles = particleSystem;
    },
    
    getSpeed(percent) {
        const idx = Math.min(Math.floor(percent / 20), CONFIG.SPEEDS.length - 1);
        return CONFIG.SPEEDS[idx] || 0.5;
    },
    
    getCurrentStep(percent) {
        for (let i = CONFIG.STEPS.length - 1; i >= 0; i--) {
            if (percent >= CONFIG.STEPS[i].at) return i;
        }
        return 0;
    },
    
    loop() {
        if (State.isPaused || State.isError || State.isComplete) return;
        
        const remaining = State.target - State.current;
        const speed = this.getSpeed(State.current) * (0.5 + Math.random() * 0.5);
        
        if (remaining > 0) {
            State.current = Math.min(State.current + speed, State.target);
            
            // Atualizar UI
            UI.updateProgress(State.current);
            
            // Verificar mudança de etapa
            const newStep = this.getCurrentStep(State.current);
            if (newStep !== State.stepIndex) {
                State.stepIndex = newStep;
                UI.updateStep(newStep);
            }
            
            // Completou?
            if (State.current >= 100) {
                this.complete();
                return;
            }
        }
        
        State.animId = requestAnimationFrame(() => this.loop());
    },
    
    complete() {
        State.setComplete();
        UI.updateProgress(100);
        UI.showSuccess();
        
        // Confete!
        const rect = UI.elements.container.getBoundingClientRect();
        this.particles.explode(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
    },
    
    simulateError() {
        State.setError();
        UI.showError();
    },
    
    togglePause() {
        const isPaused = State.pause();
        UI.elements.btnPause.textContent = isPaused ? 'Continuar' : 'Pausar';
        
        if (isPaused) {
            UI.elements.message.textContent = 'Pausado';
            UI.elements.message.classList.remove('typing');
        } else {
            UI.updateStep(State.stepIndex);
            this.loop();
        }
        
        return isPaused;
    },
    
    restart() {
        State.reset();
        UI.reset();
        State.target = 100;
        
        // Pequeno delay para animação de entrada
        setTimeout(() => this.loop(), 300);
    }
};