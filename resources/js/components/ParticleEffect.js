// resources/js/components/ParticleEffect.js

export default class ParticleEffect {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.nodes = [];
        this.mouse = { x: null, y: null, radius: 120 };
        this.nodeCount = options.nodeCount || 80;
        this.lineDistance = options.lineDistance || 140;
        this.useLogos = options.useLogos || false;
        this.logoSize = options.logoSize || 32;
        this.logos = [];
        this.logoImages = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('mouseleave', () => this.onMouseLeave());

        if (this.useLogos) {
            this.loadLogos().then(() => {
                this.initNodes();
                this.animate();
            });
        } else {
            this.initNodes();
            this.animate();
        }
    }

    async loadLogos() {
        try {
            // Fetch logo paths from the API
            console.log('Fetching logos from API...');
            const response = await fetch('/api/logos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const logoPaths = await response.json();
            // console.log('API returned logo paths:', logoPaths);

            if (!Array.isArray(logoPaths) || logoPaths.length === 0) {
                throw new Error('No logo paths returned from API');
            }

            // Load each logo image
            const loadPromises = logoPaths.map(path => {
                return new Promise((resolve) => {
                    const img = new Image();
                    
                    img.onload = () => {
                        // console.log(`Successfully loaded logo: ${path}`);
                        this.logoImages.push(img);
                        resolve();
                    };
                    
                    img.onerror = (error) => {
                        console.error(`Failed to load logo: ${path}`, error);
                        resolve(); // Resolve anyway to continue loading other logos
                    };

                    // Set CORS attribute and source
                    img.crossOrigin = "anonymous";
                    // console.log(`Attempting to load: ${path}`);
                    img.src = path;
                });
            });

            // Wait for all images to load (or fail)
            await Promise.all(loadPromises);
            
            // console.log(`Successfully loaded ${this.logoImages.length} logos`);
            
            // If no logos loaded successfully, throw an error
            if (this.logoImages.length === 0) {
                throw new Error('No logos were loaded successfully');
            }
        } catch (error) {
            console.error('Error in loadLogos:', error);
            this.logoImages = [];
        }
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    initNodes() {
        this.nodes = [];
        const nodeCount = this.useLogos ? Math.min(this.nodeCount, this.logoImages.length) : this.nodeCount;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 2 + Math.random() * 2
            };

            if (this.useLogos && this.logoImages.length > 0) {
                node.logo = this.logoImages[i % this.logoImages.length];
            }

            this.nodes.push(node);
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
            let glow = false;
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    glow = true;
                    node.x += dx / dist * 0.75;
                    node.y += dy / dist * 0.75;
                }
            }

            if (this.useLogos && node.logo) {
                // Draw logo with glow effect
                const size = this.logoSize * (glow ? 1.7 : 1);
                this.ctx.save();
                if (glow) {
                    this.ctx.shadowColor = 'cyan';
                    this.ctx.shadowBlur = 1;
                }
                this.ctx.globalAlpha = glow ? 0.9 : 0.3;
                this.ctx.drawImage(
                    node.logo,
                    node.x - size/2,
                    node.y - size/2,
                    size,
                    size
                );
                this.ctx.restore();
            } else {
                // Draw regular particle
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * (glow ? 1.7 : 1), 0, Math.PI * 2);
                this.ctx.fillStyle = glow ? 'rgba(0,255,255,0.9)' : 'rgba(0,255,255,0.3)';
                this.ctx.shadowColor = glow ? 'cyan' : 'transparent';
                this.ctx.shadowBlur = glow ? 10 : 0;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
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