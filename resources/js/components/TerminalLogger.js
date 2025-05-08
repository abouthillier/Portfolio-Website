export default class TerminalLogger {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Terminal styling
        this.fontSize = 20;
        this.lineHeight = 24;
        this.padding = 20;
        this.maxLines = 25;
        this.lines = [];
        this.cursorBlink = true;
        this.cursorVisible = true;
        
        // Mouse tracking
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastTimestamp = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.startCursorBlink();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
    }
    
    startCursorBlink() {
        setInterval(() => {
            this.cursorVisible = !this.cursorVisible;
        }, 500);
    }
    
    logMousePosition(x, y) {
        const now = Date.now();
        const time = new Date().toLocaleTimeString();
        const speed = Math.sqrt(
            Math.pow(x - this.lastMouseX, 2) + 
            Math.pow(y - this.lastMouseY, 2)
        ) / (now - this.lastTimestamp) * 1000;
        
        this.lines.push({
            text: `[${time}] Mouse: (${Math.round(x)}, ${Math.round(y)}) Speed: ${speed.toFixed(2)}px/s`,
            timestamp: now
        });
        
        // Keep only the last maxLines
        if (this.lines.length > this.maxLines) {
            this.lines.shift();
        }
        
        this.lastMouseX = x;
        this.lastMouseY = y;
        this.lastTimestamp = now;
    }
    
    logDeviceOrientation(alpha, beta, gamma) {
        const time = new Date().toLocaleTimeString();
        this.lines.push({
            text: `[${time}] Orientation: α=${alpha.toFixed(1)} β=${beta.toFixed(1)} γ=${gamma.toFixed(1)}`,
            timestamp: Date.now()
        });

        // Keep only the last maxLines
        if (this.lines.length > this.maxLines) {
            this.lines.shift();
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // // Draw terminal header
        // this.ctx.fillStyle = '#2d2d2d';
        // this.ctx.fillRect(0, 0, this.canvas.width, this.lineHeight + this.padding);
        // this.ctx.fillStyle = '#00ff00';
        // this.ctx.fillText('Terminal Logger v1.0.0', this.padding, this.lineHeight);
        
        // Draw lines
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        this.lines.forEach((line, index) => {
            const y = (index + 2) * this.lineHeight + this.padding;
            this.ctx.fillText(line.text, this.padding, y);
        });
        
        // Draw cursor if visible
        if (this.cursorVisible) {
            const lastLine = this.lines[this.lines.length - 1];
            if (lastLine) {
                const textWidth = this.ctx.measureText(lastLine.text).width;
                const y = (this.lines.length + 1) * this.lineHeight + this.padding;
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(
                    this.padding + textWidth,
                    y - this.fontSize,
                    2,
                    this.fontSize
                );
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
} 