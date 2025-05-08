import "./partials/navigation.js";
import ParticleEffect from './components/ParticleEffect';
import Tabs from './components/Tabs';
import ProximityGlow from './components/ProximityGlow';
import Text3DEffect from './components/Text3DEffect';
import ContactForm from './components/ContactForm';
import gsap from "gsap";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
import MatrixConsole from './components/MatrixConsole';
import TerminalLogger from './components/TerminalLogger';
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// Allow transition animations once page is fully loaded
window.addEventListener("load", () => {
    document.body.classList.remove("preload");
});

// Initialize particle effect
const particleContainer = document.getElementById('particle-container');
if (particleContainer) {
    new ParticleEffect(particleContainer, {
        nodeCount: 40,
        lineDistance: 200,
        useLogos: false,
        logoSize: 40
    });
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

    // Initialize 3D text effect
    document.querySelectorAll('.work-category.motion').forEach(category => {
        new Text3DEffect(category);
    });

    // Initialize typewriter effect
    document.querySelectorAll('.work-category.web-dev').forEach(category => {
 
        // Create terminal container
        const terminalContainer = document.querySelector('.terminal-container');
        
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
    });
    document.querySelectorAll('.work-category.data').forEach(category => {
        const matrixContainer = document.querySelector('.matrix-container');
        
        const matrixConsole = new MatrixConsole(matrixContainer);
        
        category.addEventListener('mouseenter', () => {
            matrixContainer.classList.add('opacity-100');
        });

        category.addEventListener('mouseleave', () => {
            matrixContainer.classList.remove('opacity-100');
        });
    });
    document.querySelectorAll('.work-category.video').forEach(category => {
                
        const video = document.querySelector('video');
        category.addEventListener('mouseenter', () => {
            video.classList.add('opacity-100');
        });
        category.addEventListener('mouseleave', () => {
            video.classList.remove('opacity-100');
        });

        // Find the title element and wrap it in a flex container
        const titleElement = category.querySelector('h3, h2, h1');
        if (titleElement) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center';
            titleElement.parentNode.insertBefore(wrapper, titleElement);
            wrapper.appendChild(titleElement);
            wrapper.appendChild(playIcon);

            // Add hover effect
            category.addEventListener('mouseenter', () => {
                playIcon.classList.remove('opacity-0');
                playIcon.classList.add('opacity-100');
            });

            category.addEventListener('mouseleave', () => {
                playIcon.classList.remove('opacity-100');
                playIcon.classList.add('opacity-0');
            });
        }
    });

});

function resizeShootingStarSVG() {
    const svg = document.getElementById('shooting-star-svg');
    if (svg) {
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
    }
}
function generateZigZagPath() {
    const svg = document.getElementById('shooting-star-svg');
    const path = document.getElementById('star-path');
    if (!svg || !path) return;
    
    // Get SVG dimensions
    const width = svg.clientWidth || window.innerWidth;
    const height = svg.clientHeight || window.innerHeight;
    
    // Number of vertical steps (sections)
    const steps = 6;
    const margin = 80; // margin from left/right
    const minY = 60;
    const maxY = height - 60;
    
    // Generate points
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const y = minY + ((maxY - minY) / steps) * i;
        // Alternate left/right, with some randomness
        const x = (i % 2 === 0)
        ? margin + Math.random() * (width * 0.25)
        : width - margin - Math.random() * (width * 0.25);
        points.push({ x, y });
    }
    
    // Build a smooth path using cubic Bezier curves
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        // Control points for smoothness
        const cpx1 = prev.x + (curr.x - prev.x) / 2;
        const cpy1 = prev.y;
        const cpx2 = prev.x + (curr.x - prev.x) / 2;
        const cpy2 = curr.y;
        d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    
    path.setAttribute('d', d);
}

// window.addEventListener('resize', () => {
//     resizeShootingStarSVG();
//     generateZigZagPath();
// });
// window.addEventListener('DOMContentLoaded', () => {
//     resizeShootingStarSVG();
//     generateZigZagPath();
//     // Shooting star GSAP MotionPath effect
//     const path = document.getElementById("star-path");
//     const star = document.getElementById("star-group");
    
//     if (path && star) {
//         gsap.set(star, { xPercent: -50, yPercent: -50 }); // Center the group on the path
    
//         gsap.to(star, {
//             motionPath: {
//                 path: path,
//                 align: path,
//                 alignOrigin: [0.5, 0.5],
//                 autoRotate: true
//             },
//             ease: "power1.inOut",
//             scrollTrigger: {
//                 trigger: "body",
//                 start: "top top",
//                 end: "bottom bottom",
//                 scrub: 10
//             }
//         });
//     }
// });
