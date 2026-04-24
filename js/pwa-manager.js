/**
 * PWA MANAGER - Gerenciamento de PWA: install, offline, updates
 */

const PWAManager = {
    deferredPrompt: null,
    isInstalled: false,

    init() {
        this.listenInstallPrompt();
        this.listenNetworkStatus();
        this.listenServiceWorker();
        this.checkInstalled();
    },

    /**
     * Captura o evento beforeinstallprompt
     */
    listenInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallBanner();
            this.deferredPrompt = null;
            console.log('🎉 PWA instalado com sucesso!');
        });
    },

    /**
     * Monitora status da rede
     */
    listenNetworkStatus() {
        const updateStatus = () => {
            const isOnline = navigator.onLine;
            this.showNetworkToast(isOnline);

            if (!isOnline) {
                console.log('📴 Modo offline ativado');
            }
        };

        window.addEventListener('online', () => updateStatus());
        window.addEventListener('offline', () => updateStatus());
    },

    /**
     * Escuta por updates do Service Worker
     */
    listenServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                this.showUpdateToast();
            });
        }
    },

    /**
     * Verifica se já está instalado
     */
    checkInstalled() {
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
        }
    },

    /**
     * Mostra banner de instalação
     */
    showInstallBanner() {
        if (this.isInstalled || !this.deferredPrompt) return;

        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-install-content">
                <div class="pwa-install-icon">🚀</div>
                <div class="pwa-install-text">
                    <div class="pwa-install-title">Instalar Quantum Glass Loader</div>
                    <div class="pwa-install-subtitle">Acesse offline direto da sua tela inicial</div>
                </div>
            </div>
            <div class="pwa-install-actions">
                <button class="pwa-install-btn dismiss" id="pwa-dismiss">Agora não</button>
                <button class="pwa-install-btn install" id="pwa-install">Instalar</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Trigger reflow para animação
        requestAnimationFrame(() => {
            banner.classList.add('show');
        });

        // Event listeners
        document.getElementById('pwa-install').addEventListener('click', () => {
            this.installApp();
        });

        document.getElementById('pwa-dismiss').addEventListener('click', () => {
            this.hideInstallBanner();
        });
    },

    /**
     * Esconde banner
     */
    hideInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 400);
        }
    },

    /**
     * Dispara instalação
     */
    async installApp() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ Usuário aceitou instalação');
        } else {
            console.log('❌ Usuário recusou instalação');
        }

        this.deferredPrompt = null;
        this.hideInstallBanner();
    },

    /**
     * Mostra toast de rede
     */
    showNetworkToast(isOnline) {
        // Remover toast anterior
        const existing = document.getElementById('offline-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `offline-toast ${isOnline ? 'online' : 'offline'}`;
        toast.id = 'offline-toast';
        toast.innerHTML = `
            <span class="offline-toast-icon">${isOnline ? '🟢' : '🔴'}</span>
            <span class="offline-toast-text">${isOnline ? 'Você está online!' : 'Modo offline ativado'}</span>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-hide após 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    },

    /**
     * Mostra toast de update disponível
     */
    showUpdateToast() {
        const toast = document.createElement('div');
        toast.className = 'offline-toast online';
        toast.style.borderColor = 'var(--primary)';
        toast.innerHTML = `
            <span class="offline-toast-icon">🔄</span>
            <span class="offline-toast-text">Nova versão disponível! Recarregando...</span>
        `;

        document.body.appendChild(toast);
        toast.classList.add('show');

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
};
