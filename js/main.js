/**
 * MAIN - Orquestrador e inicialização
 * Quantum Glass Loader - Day 7 (Final)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. UI PRIMEIRO
    UI.init();

    // 2. Sistemas que dependem de DOM
    ThemeManager.init();
    AnimationEngine.init();

    // 3. Efeitos visuais
    if (typeof CursorEffects !== 'undefined') {
        CursorEffects.init();
    }
    if (typeof BackgroundParticles !== 'undefined') {
        BackgroundParticles.init();
    }

    // 4. Partículas e Progress
    const particles = new ParticleSystem();
    window.particles = particles; // Global para acesso do celebration
    Progress.init(particles);

    // 5. Upload
    UploadManager.init();

    // 6. Áudio
    AudioEngine.init();

    // 7. Disclaimer
    Disclaimer.render();
    Disclaimer.init();

    // 8. Performance Monitor
    if (typeof PerformanceMonitor !== 'undefined') {
        try {
            PerformanceMonitor.init();
        } catch (e) {
            console.warn('PerformanceMonitor indisponível');
        }
    }

    // 9. PWA Manager
    if (typeof PWAManager !== 'undefined') {
        try {
            PWAManager.init();
        } catch (e) {
            console.warn('PWAManager indisponível');
        }
    }

    // 10. Completion Celebration (por último)
    if (typeof CompletionCelebration !== 'undefined') {
        CompletionCelebration.init();
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

    console.log('🚀 Quantum Glass Loader v1.0 - 7 Days Complete!');
});
