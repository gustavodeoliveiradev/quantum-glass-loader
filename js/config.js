/**
 * CONFIG - Constantes centralizadas
 */

const CONFIG = {
    // Geometria do círculo: 2 * PI * 90
    CIRCUMFERENCE: 565.48,
    
    // Etapas do loading com mensagens
    STEPS: [
        { at: 0, label: 'Aguardando', msg: 'Arraste um arquivo para começar' },
        { at: 1, label: 'Enviando', msg: 'Iniciando upload...' },
        { at: 25, label: 'Processando', msg: 'Enviando dados...' },
        { at: 50, label: 'Sincronizando', msg: 'Sincronizando com servidor...' },
        { at: 75, label: 'Finalizando', msg: 'Quase lá...' },
        { at: 100, label: 'Concluído', msg: 'Upload completo!' }
    ],
    
    // Velocidades para simulação realista (fallback)
    SPEEDS: [0.8, 0.4, 1.2, 0.6, 0.9],
    
    // Seletores DOM
    DOM: {
        ringFill: '#ring-fill',
        value: '#progress-value',
        linearBar: '#linear-bar',
        step: '#status-step',
        message: '#status-message',
        glow: '#ring-glow',
        iconSuccess: '#icon-success',
        iconError: '#icon-error',
        container: '.glass-container',
        btnPause: '#btn-pause',
        btnError: '#btn-error',
        btnRestart: '#btn-restart'
    },
    
    // Upload
    UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024,
        ENDPOINT: 'https://httpbin.org/post'
    }
};