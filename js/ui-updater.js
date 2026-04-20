/**
 * UI UPDATER - Atualizações DOM centralizadas
 */

const UI = {
    elements: {},
    
    init() {
        Object.keys(CONFIG.DOM).forEach(key => {
            this.elements[key] = document.querySelector(CONFIG.DOM[key]);
        });
        
        // Setup inicial SVG
        this.elements.ringFill.style.strokeDasharray = CONFIG.CIRCUMFERENCE;
    },
    
    updateProgress(percent) {
        // Círculo SVG
        const offset = CONFIG.CIRCUMFERENCE - (percent / 100) * CONFIG.CIRCUMFERENCE;
        this.elements.ringFill.style.strokeDashoffset = offset;
        
        // Valor numérico (com bounce se mudou)
        const currentVal = parseInt(this.elements.value.textContent);
        const newVal = Math.floor(percent);
        
        if (currentVal !== newVal) {
            this.elements.value.textContent = newVal + '%';
            this.elements.value.classList.add('bounce');
            setTimeout(() => this.elements.value.classList.remove('bounce'), 200);
        }
        
        // Barra linear
        this.elements.linearBar.style.width = percent + '%';
        
        // Glow central
        this.elements.glow.classList.toggle('active', percent > 0 && percent < 100);
        
        // Acessibilidade
        this.elements.container.setAttribute('aria-valuenow', newVal);
    },
    
    updateStep(index) {
        const step = CONFIG.STEPS[index];
        if (!step) return;
        
        this.elements.step.textContent = step.label;
        this.elements.step.classList.add('active');
        
        // Efeito digitação
        this.typeText(step.msg);
    },
    
    typeText(text) {
        const el = this.elements.message;
        el.classList.add('typing');
        el.textContent = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 25 + Math.random() * 40);
            } else {
                el.classList.remove('typing');
            }
        };
        type();
    },
    
    showSuccess() {
        this.elements.value.style.opacity = '0';
        this.elements.iconSuccess.classList.add('show');
        this.elements.glow.classList.remove('active');
        this.elements.container.classList.add('success');
        
        // Esconder/mostrar botões
        this.elements.btnPause.hidden = true;
        this.elements.btnError.hidden = true;
        this.elements.btnRestart.hidden = false;
    },
    
    showError() {
        this.elements.value.style.color = 'var(--error)';
        this.elements.ringFill.style.stroke = 'var(--error)';
        this.elements.iconError.classList.add('show');
        this.elements.glow.classList.remove('active');
        this.elements.container.classList.add('error');
        this.elements.step.style.color = 'var(--error)';
        this.elements.step.textContent = 'Erro';
        this.elements.message.textContent = 'Falha na conexão. Tente novamente.';
        this.elements.message.classList.remove('typing');
        
        this.elements.btnPause.hidden = true;
        this.elements.btnError.hidden = true;
        this.elements.btnRestart.hidden = false;
    },
    
    reset() {
        // Reset visual completo
        this.elements.value.style.opacity = '1';
        this.elements.value.style.color = '';
        this.elements.value.textContent = '0%';
        this.elements.ringFill.style.stroke = 'url(#gradient)';
        this.elements.iconSuccess.classList.remove('show');
        this.elements.iconError.classList.remove('show');
        this.elements.container.classList.remove('success', 'error');
        this.elements.step.style.color = '';
        this.elements.step.classList.remove('active');
        this.elements.glow.classList.remove('active');
        
        // Reset barras
        this.elements.ringFill.style.strokeDashoffset = CONFIG.CIRCUMFERENCE;
        this.elements.linearBar.style.width = '0%';
        
        // Botões
        this.elements.btnPause.hidden = false;
        this.elements.btnPause.textContent = 'Pausar';
        this.elements.btnError.hidden = false;
        this.elements.btnRestart.hidden = true;
    }
};