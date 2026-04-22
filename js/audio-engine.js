/**
 * AUDIO ENGINE - Web Audio API para feedback sonoro imersivo
 * 
 * Política: áudio só inicia após interação do usuário (autoplay policy)
 */

const AudioEngine = {
    ctx: null,
    masterGain: null,
    isMuted: false,
    isInitialized: false,
    droneOsc: null,
    droneGain: null,
    
    /**
     * Inicializa o contexto de áudio (deve ser chamado após interação)
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3; // Volume master
            this.masterGain.connect(this.ctx.destination);
            
            this.isInitialized = true;
            console.log('🎵 Audio Engine initialized');
        } catch (e) {
            console.warn('Web Audio API não suportada:', e);
        }
    },
    
    /**
     * Resume contexto (necessário após autoplay policy)
     */
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    
    /**
     * Gera tom de progresso — pitch sobe conforme o percentual
     */
    playProgress(percent) {
        if (!this.ctx || this.isMuted) return;
        
        const freq = 200 + (percent * 8); // 200Hz → 1000Hz
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    
    /**
     * Som de sucesso ao completar
     */
    playSuccess() {
        if (!this.ctx || this.isMuted) return;
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
        const now = this.ctx.currentTime;
        
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.5);
        });
    },
    
    /**
     * Som de erro
     */
    playError() {
        if (!this.ctx || this.isMuted) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    },
    
    /**
     * Click sutil nos botões
     */
    playClick() {
        if (!this.ctx || this.isMuted) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 800;
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },
    
    /**
     * Drone ambiente sutil (toggle)
     */
    toggleDrone(active) {
        if (!this.ctx || this.isMuted) return;
        
        if (active && !this.droneOsc) {
            this.droneOsc = this.ctx.createOscillator();
            this.droneGain = this.ctx.createGain();
            
            this.droneOsc.type = 'sine';
            this.droneOsc.frequency.value = 60; // Sub-bass sutil
            
            this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
            this.droneGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 2);
            
            this.droneOsc.connect(this.droneGain);
            this.droneGain.connect(this.masterGain);
            
            this.droneOsc.start();
        } else if (!active && this.droneOsc) {
            this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
            this.droneOsc.stop(this.ctx.currentTime + 0.5);
            this.droneOsc = null;
            this.droneGain = null;
        }
    },
    
    /**
     * Toggle mute global
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(
                this.isMuted ? 0 : 0.3,
                this.ctx.currentTime + 0.1
            );
        }
        
        if (this.isMuted && this.droneOsc) {
            this.toggleDrone(false);
        }
        
        return this.isMuted;
    },
    
    /**
     * Atualiza visualizador de áudio
     */
    updateVisualizer() {
        const visualizer = document.getElementById('audio-visualizer');
        if (!visualizer || !this.ctx || this.isMuted) return;
        
        const bars = visualizer.querySelectorAll('.audio-bar');
        const analyser = this.ctx.createAnalyser();
        analyser.fftSize = 32;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        bars.forEach((bar, i) => {
            const value = dataArray[i] || 0;
            const height = Math.max(2, (value / 255) * 24);
            bar.style.height = height + 'px';
        });
    }
};