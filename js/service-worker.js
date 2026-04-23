/**
 * SERVICE WORKER - Cache de assets para performance e offline
 */

const CACHE_NAME = 'quantum-loader-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/theme-toggle.css',
    '/css/audio-controls.css',
    '/css/glass-container.css',
    '/css/progress-ring.css',
    '/css/typography.css',
    '/css/controls.css',
    '/css/upload-zone.css',
    '/css/file-list.css',
    '/css/disclaimer.css',
    '/css/performance-panel.css',
    '/js/config.js',
    '/js/state.js',
    '/js/theme-manager.js',
    '/js/disclaimer.js',
    '/js/audio-engine.js',
    '/js/animation-engine.js',
    '/js/particles.js',
    '/js/api-client.js',
    '/js/ui-updater.js',
    '/js/progress.js',
    '/js/upload-manager.js',
    '/js/performance-monitor.js',
    '/js/main.js'
];

// Instalação: cachear assets
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
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});