/**
 * CONFIG - Constantes centralizadas
 */

const CONFIG = {
    // Geometria do círculo: 2 * PI * 90
    CIRCUMFERENCE: 565.48,
    
    // Etapas do loading com mensagens
    STEPS: [
        { at: 0, label: 'Inicializando', msg: 'Preparando ambiente...' },
        { at: 15, label: 'Conectando', msg: 'Estabelecendo conexão segura...' },
        { at: 35, label: 'Processando', msg: 'Otimizando recursos visuais...' },
        { at: 60, label: 'Sincronizando', msg: 'Sincronizando dados...' },
        { at: 80, label: 'Finalizando', msg: 'Aplicando configurações...' },
        { at: 100, label: 'Concluído', msg: 'Pronto! Bem-vindo.' }
    ],
    
    // Velocidades para simulação realista (não-linear)
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
    }
};