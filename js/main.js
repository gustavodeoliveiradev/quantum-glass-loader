/**
 * MAIN - Orquestrador e inicialização
 * 
 * ORDEM DE INICIALIZAÇÃO (crítico para não quebrar):
 * 1. DOM elements (UI.init)
 * 2. Sistemas que dependem de DOM (ThemeManager, AnimationEngine)
 * 3. Sistemas independentes (AudioEngine, Particles)
 * 4. PerformanceMonitor (por último, não interfere em nada)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. UI PRIMEIRO - todos os elementos DOM devem existir
    UI.init();

    // 2. Tema (depende de DOM)
    ThemeManager.init();

    // 3. Animações (depende de DOM)
    AnimationEngine.init();

    // 4. Partículas (independente)
    const particles = new ParticleSystem();

    // 5. Progress (depende de particles)
    Progress.init(particles);

    // 6. Upload (depende de UI e Progress)
    UploadManager.init();

    // 7. Áudio (independente, mas aguarda interação)
    AudioEngine.init();

    // 8. Disclaimer (por último, não bloqueia nada)
    Disclaimer.render();
    Disclaimer.init();

    // 9. Performance Monitor (não interfere no funcionamento)
    if (typeof PerformanceMonitor !== 'undefined') {
        try {
            PerformanceMonitor.init();
        } catch (e) {
            console.warn('PerformanceMonitor não disponível:', e);
        }
    }

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
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            AudioEngine.resume();
            const isMuted = AudioEngine.toggleMute();
            audioToggle.textContent = isMuted ? '🔇' : '🔊';
            audioToggle.classList.toggle('muted', isMuted);
            audioToggle.classList.toggle('active', !isMuted);
            audioToggle.title = isMuted ? 'Ativar som' : 'Silenciar';

            if (!isMuted) {
                AudioEngine.playClick();
                const visualizer = document.getElementById('audio-visualizer');
                if (visualizer) visualizer.classList.add('active');
            } else {
                const visualizer = document.getElementById('audio-visualizer');
                if (visualizer) visualizer.classList.remove('active');
            }
        });
    }

    // Inicializar áudio na primeira interação do usuário
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
            if (audioToggle) audioToggle.click();
        }
    });

    console.log('🚀 Quantum Glass Loader - Day 5: Performance & Mobile Ready');
});
