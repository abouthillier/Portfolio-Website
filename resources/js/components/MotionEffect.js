import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

const EASES = [
  "power1.inOut", "power2.inOut", "power3.inOut", "power4.inOut",
  "power1.in", "power2.in", "power3.in", "power4.in",
  "power1.out", "power2.out", "power3.out", "power4.out",
  "sine.inOut", "sine.in", "sine.out",
  "expo.inOut", "expo.in", "expo.out",
  "circ.inOut", "circ.in", "circ.out",
  "back.inOut(1.7)", "back.in(1.7)", "back.out(1.7)",
  "elastic.inOut(1,0.3)", "elastic.in(1,0.3)", "elastic.out(1,0.3)",
  "bounce.inOut", "bounce.in", "bounce.out",
  "steps(5)", "steps(10)",
  "rough({ template: 'power1.inOut', strength: 1, points: 20, taper: 'none', randomize: true, clamp: false })"
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default class MotionEffect {
  constructor(container, count = 4) {
    this.container = container;
    this.count = count;
    this.svgs = [];
    this.intervals = [];
    this.floatAnims = [];
    this.init();
  }

  init() {
    // Clear previous
    this.container.innerHTML = "";
    this.svgs = [];
    this.intervals = [];
    this.floatAnims = [];

    for (let i = 0; i < this.count; i++) {
      // Create wrapper for transform
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = `${randomBetween(0, 100)}%`;
      wrapper.style.top = `${randomBetween(0, 100)}%`;
      wrapper.style.transform = `
        scale(${randomBetween(0.4, 1.5)})
        rotate(${randomBetween(-30, 30)}deg)
      `;
      wrapper.style.pointerEvents = "none";

      // Create SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "180");
      svg.setAttribute("height", "180");
      svg.setAttribute("viewBox", "0 0 300 300");

      // Dashed lines
      const line1 = document.createElementNS(svg.namespaceURI, "line");
      line1.setAttribute("x1", "40"); line1.setAttribute("y1", "60");
      line1.setAttribute("x2", "260"); line1.setAttribute("y2", "60");
      line1.setAttribute("stroke", "#b3b3b3");
      line1.setAttribute("stroke-width", "3");
      line1.setAttribute("stroke-dasharray", "8 8");
      svg.appendChild(line1);

      const line2 = document.createElementNS(svg.namespaceURI, "line");
      line2.setAttribute("x1", "40"); line2.setAttribute("y1", "240");
      line2.setAttribute("x2", "260"); line2.setAttribute("y2", "240");
      line2.setAttribute("stroke", "#b3b3b3");
      line2.setAttribute("stroke-width", "3");
      line2.setAttribute("stroke-dasharray", "8 8");
      svg.appendChild(line2);

      // Easing path
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("stroke", "#fffad1");
      path.setAttribute("stroke-width", "6");
      path.setAttribute("fill", "none");

      // Pick an initial ease and set the path's d attribute
      const ease = EASES[Math.floor(Math.random() * EASES.length)];
      try {
        const initialPath = CustomEase.getSVGData(ease, { width: 220, height: 180, x: 40, y: 60 });
        if (initialPath) {
          path.setAttribute("d", initialPath);
        } else {
          // Fallback to a simple path if CustomEase fails
          path.setAttribute("d", "M40,60 L260,240");
        }
      } catch (error) {
        console.warn("CustomEase initialization failed, using fallback path:", error);
        path.setAttribute("d", "M40,60 L260,240");
      }

      svg.appendChild(path);

      // Handles (optional: you can randomize or style these further)
      const handle1 = document.createElementNS(svg.namespaceURI, "circle");
      handle1.setAttribute("cx", "40"); handle1.setAttribute("cy", "60");
      handle1.setAttribute("r", "12");
      handle1.setAttribute("fill", "rgb(0,255,255)");
      handle1.setAttribute("stroke", "#fff");
      handle1.setAttribute("stroke-width", "3");
      svg.appendChild(handle1);

      const handle2 = document.createElementNS(svg.namespaceURI, "rect");
      handle2.setAttribute("x", "248"); handle2.setAttribute("y", "48");
      handle2.setAttribute("width", "24"); handle2.setAttribute("height", "24");
      handle2.setAttribute("rx", "6");
      handle2.setAttribute("fill", "rgb(0,255,255)");
      handle2.setAttribute("stroke", "#fff");
      handle2.setAttribute("stroke-width", "3");
      svg.appendChild(handle2);

      const handle3 = document.createElementNS(svg.namespaceURI, "rect");
      handle3.setAttribute("x", "28"); handle3.setAttribute("y", "228");
      handle3.setAttribute("width", "24"); handle3.setAttribute("height", "24");
      handle3.setAttribute("rx", "6");
      handle3.setAttribute("fill", "rgb(0,255,0)");
      handle3.setAttribute("stroke", "#fff");
      handle3.setAttribute("stroke-width", "3");
      svg.appendChild(handle3);

      const handle4 = document.createElementNS(svg.namespaceURI, "circle");
      handle4.setAttribute("cx", "260"); handle4.setAttribute("cy", "240");
      handle4.setAttribute("r", "12");
      handle4.setAttribute("fill", "rgb(0,255,0)");
      handle4.setAttribute("stroke", "#fff");
      handle4.setAttribute("stroke-width", "3");
      svg.appendChild(handle4);

      wrapper.appendChild(svg);
      this.container.appendChild(wrapper);

      // Store for later
      this.svgs.push({ wrapper, svg, path, ease });
    }
  }

  setPathToEase(path, ease) {
    // Validate ease parameter
    if (!ease || typeof ease !== 'string' || !EASES.includes(ease)) {
      console.warn("Invalid ease parameter:", ease);
      // Use a default ease if the provided one is invalid
      ease = "power2.inOut";
    }

    try {
      const easePath = CustomEase.getSVGData(ease, { width: 220, height: 180, x: 40, y: 60 });
      if (!easePath || typeof easePath !== "string" || !easePath.startsWith("M")) {
        console.warn("Invalid path data for ease:", ease);
        return;
      }
      gsap.to(path, {
        duration: 1.2,
        morphSVG: { shape: easePath },
        ease: "power2.inOut"
      });
    } catch (error) {
      console.warn("Failed to set path to ease:", error);
    }
  }

  start() {
    // Randomize position of each SVG wrapper on each start
    this.svgs.forEach((obj) => {
      obj.wrapper.style.left = `${randomBetween(0, 100)}%`;
      obj.wrapper.style.top = `${randomBetween(0, 100)}%`;
    });
    // Floating and morphing for each SVG
    this.svgs.forEach((obj, idx) => {
      // Floating animation
      const floatAnim = gsap.to(obj.wrapper, {
        y: "+=20",
        yoyo: true,
        repeat: -1,
        duration: randomBetween(3, 6),
        ease: "sine.inOut"
      });
      this.floatAnims.push(floatAnim);

      // Curve morphing
      const interval = setInterval(() => {
        // Ensure we get a valid ease from the array
        const randomIndex = Math.floor(Math.random() * EASES.length);
        const newEase = EASES[randomIndex];
        if (newEase) {
          this.setPathToEase(obj.path, newEase);
        }
      }, randomBetween(1800, 3500));
      this.intervals.push(interval);
    });
  }

  stop() {
    // Stop floating
    this.floatAnims.forEach(anim => anim.kill());
    this.floatAnims = [];
    // Stop morphing
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];
  }
}
