/**
 * MAIN - Orquestrador e inicialização
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Disclaimer de segurança primeiro
    Disclaimer.render();
    Disclaimer.init();
    
    // 2. Tema
    ThemeManager.init();
    
    // 3. Sistemas do loader
    UI.init();
    const particles = new ParticleSystem();
    Progress.init(particles);
    UploadManager.init();
    
    // Event Listeners
    UI.elements.btnPause.addEventListener('click', () => Progress.togglePause());
    UI.elements.btnError.addEventListener('click', () => Progress.simulateError());
    UI.elements.btnRestart.addEventListener('click', () => {
        if (UploadManager.file) {
            UploadManager.reset();
        } else {
            Progress.restart();
        }
    });
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !State.isComplete && !State.isError) {
            Progress.togglePause();
        }
        if ((e.key === 'r' || e.key === 'R') && (State.isComplete || State.isError)) {
            if (UploadManager.file) {
                UploadManager.reset();
            } else {
                Progress.restart();
            }
        }
        if (e.key === 't' || e.key === 'T') {
            ThemeManager.toggle();
        }
    });
    
    console.log('🚀 Quantum Glass Loader - Day 3: Real Upload Active');
});