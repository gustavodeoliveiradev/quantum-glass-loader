/**
 * THEME MANAGER - Sistema de temas Dark/Light
 * Persistência localStorage + detecção sistema
 */

const ThemeManager = {
    STORAGE_KEY: 'quantum-loader-theme',
    
    init() {
        this.loadTheme();
        this.renderToggle();
        this.listenSystem();
    },
    
    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    },
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.updateToggleTooltip(theme);
    },
    
    toggle() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        return next;
    },
    
    loadTheme() {
        // Prioridade: localStorage > sistema > dark (padrão)
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = saved || (systemDark ? 'dark' : 'light');
        this.setTheme(theme);
    },
    
    listenSystem() {
        // Atualiza se o usuário mudar o tema do SO
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    renderToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('data-tooltip', 'Alternar tema');
        toggle.innerHTML = `
            <div class="toggle-track" id="theme-track">
                <div class="toggle-stars"></div>
                <div class="toggle-clouds"></div>
                <div class="toggle-thumb"></div>
            </div>
        `;
        
        document.body.appendChild(toggle);
        
        toggle.querySelector('.toggle-track').addEventListener('click', () => {
            this.toggle();
        });
    },
    
    updateToggleTooltip(theme) {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.setAttribute('data-tooltip', 
                theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'
            );
        }
    }
};