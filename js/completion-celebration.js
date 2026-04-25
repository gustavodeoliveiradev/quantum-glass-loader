/**
 * COMPLETION CELEBRATION - Tela especial de conclusão do projeto
 */

const CompletionCelebration = {
    shown: false,

    init() {
        // Verificar se é a primeira vez que o loader completa nesta sessão
        const hasShown = sessionStorage.getItem('quantum-completion-shown');
        if (!hasShown) {
            this.listenForCompletion();
        }
    },

    listenForCompletion() {
        // Observar quando o loader completa
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList && 
                    mutation.target.classList.contains('success') &&
                    !this.shown) {
                    this.show();
                }
            });
        });

        const container = document.querySelector('.glass-container');
        if (container) {
            observer.observe(container, { attributes: true, attributeFilter: ['class'] });
        }
    },

    show() {
        this.shown = true;
        sessionStorage.setItem('quantum-completion-shown', 'true');

        // Contar dias do projeto (simulado - em produção viria da API do GitHub)
        const stats = {
            days: 7,
            commits: 15,
            files: 25
        };

        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        overlay.id = 'completion-overlay';
        overlay.innerHTML = `
            <div class="completion-card">
                <div class="completion-icon">🎉</div>
                <div class="completion-title">Projeto Completo!</div>
                <div class="completion-subtitle">
                    Você acompanhou 7 dias de desenvolvimento do<br>
                    <strong>Quantum Glass Loader</strong>
                </div>
                <div class="completion-stats">
                    <div class="completion-stat">
                        <div class="completion-stat-value">${stats.days}</div>
                        <div class="completion-stat-label">Dias</div>
                    </div>
                    <div class="completion-stat">
                        <div class="completion-stat-value">${stats.commits}</div>
                        <div class="completion-stat-label">Commits</div>
                    </div>
                    <div class="completion-stat">
                        <div class="completion-stat-value">${stats.files}</div>
                        <div class="completion-stat-label">Arquivos</div>
                    </div>
                </div>
                <button class="completion-btn" onclick="CompletionCelebration.hide()">
                    Continuar Explorando 🚀
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Trigger reflow
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Confete extra!
        setTimeout(() => {
            const rect = overlay.querySelector('.completion-card').getBoundingClientRect();
            if (window.particles) {
                window.particles.explode(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
            }
        }, 600);
    },

    hide() {
        const overlay = document.getElementById('completion-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }
    }
};
