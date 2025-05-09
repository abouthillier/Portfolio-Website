import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

export default class ProximityMorphButton {
    constructor(button) {
        this.button = button;
        this.path = button.querySelector('#scroll-cta-path');
        this.arrow = button.querySelector('#scroll-cta-arrow');
        // Default pill shape
        this.defaultPath = "M10,30 Q10,10 30,10 L170,10 Q190,10 190,30 Q190,50 170,50 L30,50 Q10,50 10,30 Z";
        // Chevron arrow with tail
        this.arrowPath = "M100,40 V00 M80,40 L100,60 L120,40";
        this.targetSelector = '#work';
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
            y: 60,
            ease: "power2.in"
        }, 0.1);
    }

    morphToDefault() {
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