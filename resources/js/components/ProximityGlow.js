class ProximityGlow {
    constructor(container) {
        this.container = container;
        this.config = {
            proximity: 40,
            spread: 80,
            blur: 20,
            opacity: 0
        };
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Add CSS custom properties to the container
        this.container.style.setProperty('--active', '0.15');
        this.container.style.setProperty('--start', '0');
        this.container.style.setProperty('--spread', this.config.spread);
        this.container.style.setProperty('--blur', this.config.blur);
        
        // Get the button's border radius from its class
        const isRoundedFull = this.container.classList.contains('rounded-full');
        const isRounded3xl = this.container.classList.contains('rounded-xl');
        
        // Set border radius based on button class
        if (isRoundedFull) {
            this.container.style.setProperty('--border-radius', '9999px');
        } else if (isRounded3xl) {
            this.container.style.setProperty('--border-radius', '1.5rem');
        } else {
            this.container.style.setProperty('--border-radius', '0.5rem');
        }
        
        // Add the gradient definition
        this.container.style.setProperty('--gradient', 'conic-gradient(from 180deg at 50% 70%,hsla(0,0%,98%,1) 0deg,#eec32d 72.0000010728836deg,#ec4b4b 144.0000021457672deg,#709ab9 216.00000858306885deg,#4dffbf 288.0000042915344deg,hsla(0,0%,98%,1) 1turn)');
        
        // // Add the glows container
        // const glows = document.createElement('div');
        // glows.className = 'proximity-glow';
        // this.container.parentElement.prepend(glows);
    }

    update(event) {
        const bounds = this.container.getBoundingClientRect();
        
        // Check if pointer is within proximity
        if (
            event?.x > bounds.left - this.config.proximity &&
            event?.x < bounds.left + bounds.width + this.config.proximity &&
            event?.y > bounds.top - this.config.proximity &&
            event?.y < bounds.top + bounds.height + this.config.proximity
        ) {
            this.container.style.setProperty('--active', '1');
        } else {
            this.container.style.setProperty('--active', this.config.opacity.toString());
        }
        
        // Calculate angle
        const center = [
            bounds.left + bounds.width * 0.5,
            bounds.top + bounds.height * 0.5
        ];
        let angle = Math.atan2(event?.y - center[1], event?.x - center[0]) * 180 / Math.PI;
        angle = angle < 0 ? angle + 360 : angle;
        this.container.style.setProperty('--start', angle + 90);
    }

    setupEventListeners() {
        document.addEventListener('pointermove', (e) => this.update(e));
    }
}

export default ProximityGlow; 