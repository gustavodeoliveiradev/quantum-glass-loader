/**
 * MAIN - Orquestrador e inicialização
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Disclaimer de segurança
    Disclaimer.render();
    Disclaimer.init();
    
    // 2. Tema
    ThemeManager.init();
    
    // 3. Animações
    AnimationEngine.init();
    
    // 4. Sistemas do loader
    UI.init();
    const particles = new ParticleSystem();
    Progress.init(particles);
    UploadManager.init();
    
    // 5. Áudio (inicializa mas aguarda interação)
    AudioEngine.init();
    
    // Event Listeners
    UI.elements.btnPause.addEventListener('click', () => {
        AudioEngine.playClick();
        Progress.togglePause();
    });
    
    UI.elements.btnError.addEventListener('click', () => {
        AudioEngine.playClick();
        Progress.simulateError();
    });
    
    UI.elements.btnRestart.addEventListener('click', () => {
        AudioEngine.playClick();
        if (UploadManager.file) {
            UploadManager.reset();
        } else {
            Progress.restart();
        }
    });
    
    // Audio toggle
    const audioToggle = document.getElementById('audio-toggle');
    audioToggle.addEventListener('click', () => {
        AudioEngine.resume();
        const isMuted = AudioEngine.toggleMute();
        audioToggle.textContent = isMuted ? '🔇' : '🔊';
        audioToggle.classList.toggle('muted', isMuted);
        audioToggle.classList.toggle('active', !isMuted);
        audioToggle.title = isMuted ? 'Ativar som' : 'Silenciar';
        
        if (!isMuted) {
            AudioEngine.playClick();
            document.getElementById('audio-visualizer').classList.add('active');
        } else {
            document.getElementById('audio-visualizer').classList.remove('active');
        }
    });
    
    // Inicializar áudio na primeira interação
    const initAudioOnInteraction = () => {
        AudioEngine.resume();
        AudioEngine.init();
        document.removeEventListener('click', initAudioOnInteraction);
    };
    document.addEventListener('click', initAudioOnInteraction);
    
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
        if (e.key === 'm' || e.key === 'M') {
            audioToggle.click();
        }
    });
    
    console.log('🚀 Quantum Glass Loader - Day 4: Audio & Advanced Animations');
});