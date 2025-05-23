import home from './pages/home';
import AnimatedText from './components/AnimatedText';
import { gsap } from "gsap";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import GlitchSlider from './components/GlitchSlider';

// Register all GSAP plugins centrally
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, CustomEase, MorphSVGPlugin);

// Allow transition animations once page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("load", () => {
        document.body.classList.remove("preload");
        
        home.init()

        // Initialize animated text
        new AnimatedText();

        // Initialize GlitchSlider
        new GlitchSlider('.work-history-slider');
    });
});