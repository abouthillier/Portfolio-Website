// resources/js/components/ParticleEffect.js

export default class ParticleEffect {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.nodes = [];
        this.mouse = { x: null, y: null, radius: 120 };
        this.nodeCount = 80;
        this.lineDistance = 140;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.onMouseLeave());

        this.initNodes();
        this.animate();
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    initNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 2 + Math.random() * 2
            });
        }
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    onMouseLeave() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw lines
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.lineDistance) {
                    this.ctx.strokeStyle = 'rgba(0,255,255,0.15)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (let node of this.nodes) {
            // Interactivity: highlight nodes near mouse
            let glow = false;
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    glow = true;
                    // Optionally, move node away from cursor
                    node.x += dx / dist * 0.75;
                    node.y += dy / dist * 0.75;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * (glow ? 1.7 : 1), 0, Math.PI * 2);
            this.ctx.fillStyle = glow ? 'rgba(0,255,255,0.9)' : 'rgba(0,255,255,0.3)';
            this.ctx.shadowColor = glow ? 'cyan' : 'transparent';
            this.ctx.shadowBlur = glow ? 10 : 0;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Move nodes
        for (let node of this.nodes) {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        }

        requestAnimationFrame(() => this.animate());
    }
}