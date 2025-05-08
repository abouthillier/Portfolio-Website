export default class MatrixConsole {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Matrix characters (including Japanese katakana for authenticity)
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
        
        this.fontSize = 20;
        this.columns = 0;
        this.drops = [];
        
        // Animation speed controls
        this.speed = 0.5; // Lower number = slower animation (0.1 to 1)
        this.dropRate = 0.9; // Higher number = slower drops (0.9 to 0.99)
        this.lastFrameTime = 0;
        this.frameInterval = 50; // Minimum milliseconds between frames
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.init();
    }
    
    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }
    
    animate(currentTime) {
        // Frame rate limiting
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastFrameTime = currentTime;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // Add some variation to the green color
            const opacity = Math.random() * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
            
            this.ctx.fillText(text, x, y);
            
            if (y > this.canvas.height && Math.random() > this.dropRate) {
                this.drops[i] = 0;
            }
            
            this.drops[i] += this.speed;
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
} 