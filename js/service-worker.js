/**
 * SERVICE WORKER v2 - Cache completo para PWA
 */

const CACHE_NAME = 'quantum-loader-v2';
const ASSETS = [
    '/quantum-glass-loader/',
    '/quantum-glass-loader/index.html',
    '/quantum-glass-loader/css/base.css',
    '/quantum-glass-loader/css/theme-toggle.css',
    '/quantum-glass-loader/css/audio-controls.css',
    '/quantum-glass-loader/css/glass-container.css',
    '/quantum-glass-loader/css/progress-ring.css',
    '/quantum-glass-loader/css/typography.css',
    '/quantum-glass-loader/css/controls.css',
    '/quantum-glass-loader/css/upload-zone.css',
    '/quantum-glass-loader/css/file-list.css',
    '/quantum-glass-loader/css/disclaimer.css',
    '/quantum-glass-loader/css/performance-panel.css',
    '/quantum-glass-loader/css/pwa-install.css',
    '/quantum-glass-loader/css/offline-toast.css',
    '/quantum-glass-loader/js/config.js',
    '/quantum-glass-loader/js/state.js',
    '/quantum-glass-loader/js/theme-manager.js',
    '/quantum-glass-loader/js/disclaimer.js',
    '/quantum-glass-loader/js/audio-engine.js',
    '/quantum-glass-loader/js/animation-engine.js',
    '/quantum-glass-loader/js/particles.js',
    '/quantum-glass-loader/js/api-client.js',
    '/quantum-glass-loader/js/ui-updater.js',
    '/quantum-glass-loader/js/progress.js',
    '/quantum-glass-loader/js/upload-manager.js',
    '/quantum-glass-loader/js/performance-monitor.js',
    '/quantum-glass-loader/js/pwa-manager.js',
    '/quantum-glass-loader/js/main.js',
    '/quantum-glass-loader/manifest.json'
];

// Instalação: cachear tudo
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: cache first, network fallback
self.addEventListener('fetch', (event) => {
    // Ignorar requisições para API externa
    if (event.request.url.includes('httpbin.org')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request)
                    .then(networkResponse => {
                        // Cachear novos assets
                        if (networkResponse.ok && event.request.method === 'GET') {
                            const clone = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, clone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Fallback para offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('/quantum-glass-loader/index.html');
                        }
                    });
            })
    );
});
