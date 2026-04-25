/**
 * CURSOR EFFECTS - Cursor customizado com glow e trail
 */

const CursorEffects = {
    cursor: null,
    trails: [],
    mouseX: 0,
    mouseY: 0,
    isTouch: false,

    init() {
        // Detectar se é touch device
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        if (this.isTouch) return;

        this.createCursor();
        this.createTrails(5);
        this.bindEvents();
        this.animate();
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Ativar após pequeno delay
        setTimeout(() => this.cursor.classList.add('active'), 100);
    },

    createTrails(count) {
        for (let i = 0; i < count; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                delay: i * 0.05
            });
        }

        setTimeout(() => {
            this.trails.forEach(t => t.element.classList.add('active'));
        }, 100);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Detectar hover em elementos interativos
        const interactiveElements = document.querySelectorAll('button, .upload-zone, .toggle-track, .perf-toggle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (this.cursor) this.cursor.classList.remove('hover');
            });
        });
    },

    animate() {
        if (this.isTouch) return;

        // Atualizar cursor principal
        if (this.cursor) {
            this.cursor.style.left = this.mouseX - 10 + 'px';
            this.cursor.style.top = this.mouseY - 10 + 'px';
        }

        // Atualizar trails com delay
        this.trails.forEach((trail, index) => {
            const targetX = this.mouseX - 4;
            const targetY = this.mouseY - 4;

            trail.x += (targetX - trail.x) * (0.3 - index * 0.05);
            trail.y += (targetY - trail.y) * (0.3 - index * 0.05);

            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
};
