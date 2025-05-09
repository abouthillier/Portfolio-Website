import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

export default class ProximityMorphButton {
    constructor(button, options = {}) {
        this.button = button;
        this.path = button.querySelector('#scroll-cta-path');
        this.arrow = button.querySelector('#scroll-cta-arrow');
        // Default pill shape
        this.defaultPath = options.defaultPath || "M10,30 Q10,10 30,10 L170,10 Q190,10 190,30 Q190,50 170,50 L30,50 Q10,50 10,30 Z";
        // Chevron arrow with tail
        this.arrowPath = options.arrowPath || "M100,120 V40 M80,140 L100,160 L120,140";
        this.targetSelector = options.targetSelector || '#work';
        this.initEvents();
    }

    initEvents() {
        this.button.addEventListener('mouseenter', () => this.morphToArrow());
        this.button.addEventListener('mouseleave', () => this.morphToDefault());
        // this.button.addEventListener('click', (e) => this.handleClick(e));
    }

    morphToArrow() {
        const tl = gsap.timeline();
        tl.to(this.path, {
            duration: 0.5,
            morphSVG: { 
                shape: this.arrowPath,
                type: "rotational",
                origin: "50% 50%, 50% 50%",
                // map: "complexity",
            },
            ease: "power2.inOut"
        });
        tl.to(this.button.querySelector('svg'), {
            duration: 0.5,
            y: 50,
            ease: "power2.in"
        }, 0.1);
    }

    morphToDefault() {
        // if (this.arrow) this.arrow.style.opacity = 0;
        const tl = gsap.timeline();
        tl.to(this.button.querySelector('svg'), {
            duration: 0.5,
            y: 0,
            ease: "power2.in"
        });
        tl.to(this.path, {
            duration: 0.5,
            morphSVG: { 
                shape: this.defaultPath,
                type: "rotational",
                origin: "50% 50%, 50% 50%",
             },
            ease: "power2.inOut"
        }, 0.1);
    }

    handleClick(e) {
        this.morphToArrow();
        setTimeout(() => {
            const target = document.querySelector(this.targetSelector);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(() => this.morphToDefault(), 800);
        }, 500);
    }
} 