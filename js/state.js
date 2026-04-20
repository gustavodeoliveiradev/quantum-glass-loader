/**
 * STATE - Gerenciamento de estado centralizado
 */

const State = {
    current: 0,
    target: 0,
    isPaused: false,
    isError: false,
    isComplete: false,
    stepIndex: 0,
    animId: null,
    
    reset() {
        this.current = 0;
        this.target = 0;
        this.isPaused = false;
        this.isError = false;
        this.isComplete = false;
        this.stepIndex = 0;
        this.animId = null;
    },
    
    pause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    },
    
    setError() {
        this.isError = true;
        cancelAnimationFrame(this.animId);
    },
    
    setComplete() {
        this.isComplete = true;
        cancelAnimationFrame(this.animId);
    }
};