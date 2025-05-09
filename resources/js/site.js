import ParticleEffect from './components/ParticleEffect';
import Tabs from './components/Tabs';
import ProximityGlow from './components/ProximityGlow';
import ContactForm from './components/ContactForm';
import gsap from "gsap";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
import MatrixConsole from './components/MatrixConsole';
import TerminalLogger from './components/TerminalLogger';
import MotionEffect from './components/MotionEffect';
import ProximityMorphButton from './components/ProximityMorphButton';
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// Allow transition animations once page is fully loaded
window.addEventListener("load", () => {
    document.body.classList.remove("preload");
});

function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}

// Initialize particle effect
const particleContainer = document.getElementById('particle-container');
if (particleContainer) {
    const particleEffect = new ParticleEffect(particleContainer, {
        nodeCount: 40,
        lineDistance: 200,
        useLogos: false,
        logoSize: 40
    });
    // Forward click events to underlying elements (e.g., CTA button)
    const canvas = particleContainer.querySelector('canvas');
    if (canvas) {
        canvas.addEventListener('click', function(e) {
            // Temporarily disable pointer events to get the underlying element
            canvas.style.pointerEvents = 'none';
            const elem = document.elementFromPoint(e.clientX, e.clientY);
            canvas.style.pointerEvents = 'auto';
            if (elem && typeof elem.click === 'function') {
                elem.click();
            }
        });
    }
}

const particleContainerCapabilities = document.getElementById('particle-container-capabilities');
if (particleContainerCapabilities) {
    new ParticleEffect(particleContainerCapabilities, {
        nodeCount: 40,
        lineDistance: 200,
        useLogos: true,
        logoSize: 40
    });
}

// Initialize tabs
const tabsContainer = document.querySelector('[role="tablist"]')?.closest('section');
if (tabsContainer) {
    new Tabs(tabsContainer);
}

// Initialize contact form
const contactSection = document.getElementById('contact-section');
if (contactSection) {
    new ContactForm(contactSection);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize proximity glow on all buttons with the glow-button class
    document.querySelectorAll('.glow-button').forEach(button => {
        new ProximityGlow(button);
    });

    document.querySelectorAll('.work-category.motion').forEach(category => {
        const motionContainer = document.querySelector('.motion-container');
        const effectBg = category.querySelector('.effect-bg');
        
        if (isMobile() && effectBg) {
            const mobileEffect = new MotionEffect(effectBg, 4);
            mobileEffect.start();
        } else {

            const motionEffect = new MotionEffect(motionContainer, 15);

            category.addEventListener('mouseenter', () => {
                motionContainer.classList.add('opacity-100');
                motionEffect.start();
            });

            category.addEventListener('mouseleave', () => {
                motionContainer.classList.remove('opacity-100');
                motionEffect.stop();
            });
        }
    });

    // Initialize typewriter effect
    document.querySelectorAll('.work-category.web-dev').forEach(category => {
 
        // Create terminal container
        const terminalContainer = document.querySelector('.terminal-container');
        const effectBg = category.querySelector('.effect-bg');
        
        
        if (isMobile() && effectBg) {
            const mobileLogger = new TerminalLogger(effectBg);
            window.addEventListener('deviceorientation', (event) => {
                mobileLogger.logDeviceOrientation(event.alpha, event.beta, event.gamma);
            });
            
        } else {
            
            const terminalLogger = new TerminalLogger(terminalContainer);
            // Start animation on hover
            category.addEventListener('mouseenter', () => {
                terminalContainer.classList.add('opacity-100');
            });

            // Reset text when mouse leaves
            category.addEventListener('mouseleave', () => {
                terminalContainer.classList.remove('opacity-100');
            });

            // Track mouse movement
            category.addEventListener('mousemove', (e) => {
                const rect = category.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                terminalLogger.logMousePosition(x, y);
            });
        }
    });
    document.querySelectorAll('.work-category.data').forEach(category => {
        const matrixContainer = document.querySelector('.matrix-container');
        const effectBg = category.querySelector('.effect-bg');

        if (isMobile() && effectBg) {
            const mobileMatrix = new MatrixConsole(effectBg);
        } else {
            const matrixConsole = new MatrixConsole(matrixContainer);
            
            category.addEventListener('mouseenter', () => {
                matrixContainer.classList.add('opacity-100');
            });

            category.addEventListener('mouseleave', () => {
                matrixContainer.classList.remove('opacity-100');
            });
        }
    });
    document.querySelectorAll('.work-category.video').forEach(category => {
        const video = document.querySelector('video');
        const effectBg = category.querySelector('.effect-bg');

        if (isMobile() && effectBg) {
            // Clone video and append to effect background
            const clonedVideo = video.cloneNode(true);
            clonedVideo.classList.remove('opacity-0');
            clonedVideo.classList.add('opacity-100');
            effectBg.appendChild(clonedVideo);
        } else {
            category.addEventListener('mouseenter', () => {
                video.classList.add('opacity-100');
            });
            category.addEventListener('mouseleave', () => {
                video.classList.remove('opacity-100');
            });
        }
    });

    // Initialize ProximityMorphButton for hero CTA
    const ctaButton = document.getElementById('scroll-cta');
    if (ctaButton) {
        new ProximityMorphButton(ctaButton, {
            defaultPath: "M10,30 Q10,10 30,10 L170,10 Q190,10 190,30 Q190,50 170,50 L30,50 Q10,50 10,30 Z",
            arrowPath: "M100,20 V40 M80,40 L100,60 L120,40",
            targetSelector: '#work'
        });
    }
});