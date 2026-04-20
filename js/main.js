/**
 * MAIN - Orquestrador e inicialização
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema primeiro (antes de qualquer render)
    ThemeManager.init();
    
    // Inicializar sistemas do loader
    UI.init();
    const particles = new ParticleSystem();
    Progress.init(particles);
    
    // Event Listeners
    UI.elements.btnPause.addEventListener('click', () => Progress.togglePause());
    UI.elements.btnError.addEventListener('click', () => Progress.simulateError());
    UI.elements.btnRestart.addEventListener('click', () => Progress.restart());
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !State.isComplete && !State.isError) {
            Progress.togglePause();
        }
        if ((e.key === 'r' || e.key === 'R') && (State.isComplete || State.isError)) {
            Progress.restart();
        }
        // Atalho para tema: T
        if (e.key === 't' || e.key === 'T') {
            ThemeManager.toggle();
        }
    });
    
    // Iniciar loading
    State.target = 100;
    setTimeout(() => Progress.loop(), 500);
    
    console.log('🚀 Quantum Glass Loader - Day 2: Theme System Active');
});