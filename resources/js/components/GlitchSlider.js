export default class GlitchSlider {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        this.slides = this.container.querySelectorAll('.wh-slide');
        this.prevBtn = this.container.querySelector('.wh-prev');
        this.nextBtn = this.container.querySelector('.wh-next');
        this.current = 0;
        this.init();
    }

    init() {
        this.showSlide(this.current, false);
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
    }

    showSlide(idx, glitch = true) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
            if (i === idx && glitch) {
                slide.classList.remove('glitch');
                void slide.offsetWidth; // force reflow
                slide.classList.add('glitch');
            } else {
                slide.classList.remove('glitch');
            }
        });
    }

    prev() {
        this.current = (this.current - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.current);
    }

    next() {
        this.current = (this.current + 1) % this.slides.length;
        this.showSlide(this.current);
    }
}
