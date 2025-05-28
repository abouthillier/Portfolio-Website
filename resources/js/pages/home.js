import ParticleEffect from '../components/ParticleEffect';
import ProximityGlow from '../components/ProximityGlow';
import ContactForm from '../components/ContactForm';
import gsap from "gsap";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
import MatrixConsole from '../components/MatrixConsole';
import TerminalLogger from '../components/TerminalLogger';
import MotionEffect from '../components/MotionEffect';
import ProximityMorphButton from '../components/ProximityMorphButton';
import { debounce, setupBreakpoints } from '../_utilities';

export const home = {
    isMobile: false,

    init() {
        console.log('Home page initialized');

        // Use callback pattern for breakpoints
        setupBreakpoints((isMobile) => {
            home.isMobile = isMobile;
        });

        this.initProximityGlow();
        this.initHeroSection();
        this.initWorkCategorySection();
        this.initCapabilitiesSection();
        this.initContactForm();
    },
    
    initHeroSection() {
        this.initParticleEffect();
        this.initProximityMorphButton();

        this.initParallaxEffect();
    },

    initParallaxEffect() {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.utils.toArray('.parallax').forEach(layer => {
            const depth = layer.dataset.depth || 0;
            const movement = -(layer.offsetHeight * depth);
            tl.to(layer, {
                y: movement,
                ease: 'none',
            }, 0);
        });

    },

    initWorkCategorySection() {
        this.initWebDevCategoryEffects();
        this.initMotionCategoryEffects();
        this.initDataCategoryEffects();
        this.initVideoCategoryEffects();
    },

    initCapabilitiesSection() {
        this.initParticleEffectCapabilities();
    },

    initProximityGlow() {
        document.querySelectorAll('.glow-button').forEach(button => {
            new ProximityGlow(button);
        });
    },
    
    initProximityMorphButton() {
        const ctaButton = document.getElementById('scroll-cta');
        if (ctaButton) {
            new ProximityMorphButton(ctaButton);
        }
    },

    initParticleEffect() {
        const particleContainer = document.getElementById('particle-container');
        if (particleContainer) {
            new ParticleEffect(particleContainer, {
                nodeCount: 40,
                lineDistance: 200,
                useLogos: false,
                logoSize: 40
            });
        }
    },

    initParticleEffectCapabilities() {
        const particleContainerCapabilities = document.getElementById('particle-container-capabilities');
        if (particleContainerCapabilities) {
            new ParticleEffect(particleContainerCapabilities, {
                nodeCount: 40,
                lineDistance: 200,
                useLogos: true,
                logoSize: 40
            });
        }
    },

    initWebDevCategoryEffects() {

        // Initialize typewriter effect
        document.querySelectorAll('.work-category.web-dev').forEach(category => {
    
            // Create terminal container
            const terminalContainer = document.querySelector('.terminal-container');
            const effectBg = category.querySelector('.effect-bg');
            
            
            if (this.isMobile && effectBg) {
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
    },
    
    initMotionCategoryEffects() {
        document.querySelectorAll('.work-category.motion').forEach(category => {
            const motionContainer = document.querySelector('.motion-container');
            const effectBg = category.querySelector('.effect-bg');
            
            if (this.isMobile && effectBg) {
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
    },

    initDataCategoryEffects() {

        document.querySelectorAll('.work-category.data').forEach(category => {
            const matrixContainer = document.querySelector('.matrix-container');
            const effectBg = category.querySelector('.effect-bg');
    
            if (this.isMobile && effectBg) {
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
    },

    initVideoCategoryEffects() {


        document.querySelectorAll('.work-category.video').forEach(category => {
            const video = document.querySelector('video');
            const effectBg = category.querySelector('.effect-bg');
    
            if (this.isMobile && effectBg) {
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
    },

    initContactForm() {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            new ContactForm(contactSection);
        }
    }
}

export default home;
