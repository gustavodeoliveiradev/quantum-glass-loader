/**
 * PERFORMANCE MONITOR - Web Vitals e métricas em tempo real
 * 
 * Para visualizar: clique no botão ⚡ no canto inferior direito
 */

const PerformanceMonitor = {
    metrics: {
        fcp: null,
        lcp: null,
        cls: 0,
        ttfb: null,
        fid: null
    },

    init() {
        this.observeFCP();
        this.observeLCP();
        this.observeCLS();
        this.observeTTFB();
        this.observeFID();
        this.renderPanel();

        console.log('⚡ Performance Monitor ativo - clique no ⚡ para ver métricas');
    },

    observeFCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = Math.round(entry.startTime);
                        this.updatePanel();
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
            console.warn('FCP não suportado:', e);
        }
    },

    observeLCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    this.metrics.lcp = Math.round(lastEntry.startTime);
                    this.updatePanel();
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP não suportado:', e);
        }
    },

    observeCLS() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.metrics.cls += entry.value;
                    }
                }
                this.updatePanel();
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS não suportado:', e);
        }
    },

    observeTTFB() {
        try {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                this.metrics.ttfb = Math.round(nav.responseStart);
                this.updatePanel();
            }
        } catch (e) {
            console.warn('TTFB não suportado:', e);
        }
    },

    observeFID() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
                    this.updatePanel();
                }
            });
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID não suportado:', e);
        }
    },

    getRating(value, type) {
        const thresholds = {
            fcp: { good: 1800, poor: 3000 },
            lcp: { good: 2500, poor: 4000 },
            cls: { good: 0.1, poor: 0.25 },
            ttfb: { good: 800, poor: 1800 },
            fid: { good: 100, poor: 300 }
        };

        const t = thresholds[type];
        if (!t || value === null) return 'good';

        if (value <= t.good) return 'good';
        if (value <= t.poor) return 'needs-improvement';
        return 'poor';
    },

    formatValue(value, type) {
        if (value === null) return '...';
        if (type === 'cls') return value.toFixed(3);
        return value + 'ms';
    },

    renderPanel() {
        // Criar painel
        const panel = document.createElement('div');
        panel.className = 'perf-panel';
        panel.id = 'perf-panel';
        panel.innerHTML = `
            <div class="perf-title">Performance</div>
            <div class="perf-metric">
                <span class="perf-label">FCP</span>
                <span class="perf-value" id="perf-fcp">...</span>
            </div>
            <div class="perf-metric">
                <span class="perf-label">LCP</span>
                <span class="perf-value" id="perf-lcp">...</span>
            </div>
            <div class="perf-metric">
                <span class="perf-label">CLS</span>
                <span class="perf-value" id="perf-cls">...</span>
            </div>
            <div class="perf-metric">
                <span class="perf-label">TTFB</span>
                <span class="perf-value" id="perf-ttfb">...</span>
            </div>
            <div class="perf-metric">
                <span class="perf-label">FID</span>
                <span class="perf-value" id="perf-fid">...</span>
            </div>
        `;

        // Criar botão toggle
        const toggle = document.createElement('button');
        toggle.className = 'perf-toggle';
        toggle.id = 'perf-toggle';
        toggle.innerHTML = '⚡';
        toggle.title = 'Mostrar métricas de performance (Web Vitals)';
        toggle.setAttribute('aria-label', 'Toggle performance metrics panel');

        document.body.appendChild(panel);
        document.body.appendChild(toggle);

        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', panel.classList.contains('active'));
        });
    },

    updatePanel() {
        const types = ['fcp', 'lcp', 'cls', 'ttfb', 'fid'];

        types.forEach(type => {
            const el = document.getElementById(`perf-${type}`);
            if (!el) return;

            const value = this.metrics[type];
            el.textContent = this.formatValue(value, type);
            el.className = 'perf-value ' + this.getRating(value, type);
        });
    }
};
