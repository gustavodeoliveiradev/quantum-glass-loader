/**
 * MAIN - Orquestrador e inicialização
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. UI PRIMEIRO
    UI.init();

    // 2. Sistemas que dependem de DOM
    ThemeManager.init();
    AnimationEngine.init();

    // 3. Partículas e Progress
    const particles = new ParticleSystem();
    Progress.init(particles);

    // 4. Upload
    UploadManager.init();

    // 5. Áudio
    AudioEngine.init();

    // 6. Disclaimer
    Disclaimer.render();
    Disclaimer.init();

    // 7. Performance Monitor
    if (typeof PerformanceMonitor !== 'undefined') {
        try {
            PerformanceMonitor.init();
        } catch (e) {
            console.warn('PerformanceMonitor indisponível:', e);
        }
    }

    // 8. PWA Manager (por último, não bloqueia nada)
    if (typeof PWAManager !== 'undefined') {
        try {
            PWAManager.init();
        } catch (e) {
            console.warn('PWAManager indisponível:', e);
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
            if (audioToggle) audioToggle.click();
        }
    });

    console.log('🚀 Quantum Glass Loader - Day 6: PWA Complete!');
});
