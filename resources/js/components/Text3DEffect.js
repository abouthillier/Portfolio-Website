import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default class Text3DEffect {
    constructor(element) {
        this.element = element;
        this.text = element.querySelector('h2').textContent;
        this.init();
    }

    async init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Get container dimensions
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        const aspect = width / height;
        
        console.log('Container dimensions:', { width, height, aspect });
        
        // Create and position camera
        this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
        // Position camera
        this.camera.position.set(25, 0, 50);
        this.camera.lookAt(25, 0, 0);
        
        console.log('Camera position:', this.camera.position);
        console.log('Camera FOV:', this.camera.fov);
        console.log('Camera aspect:', this.camera.aspect);

        // Create renderer with pixel ratio
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true 
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height, false);
        
        // Clear any existing canvas
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        
        this.element.appendChild(this.renderer.domElement);
        
        console.log('Renderer pixel ratio:', window.devicePixelRatio);
        console.log('Canvas dimensions:', {
            width: this.renderer.domElement.width,
            height: this.renderer.domElement.height
        });

        // Set canvas style explicitly
        const canvas = this.renderer.domElement;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';

        // Load font
        const fontLoader = new FontLoader();
        const font = await fontLoader.loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');

        // Create text geometry with adjusted size based on container
        const textSize = Math.min(width, height) * 0.005;
        console.log('Text size:', textSize);
        
        const geometry = new TextGeometry(this.text, {
            font: font,
            size: 5,
            depth: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.15,
            bevelSegments: 5
        });

        // Center the geometry
        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        console.log('Text geometry width:', textWidth);
    
        geometry.center();
        // // Move text further left
        // const leftOffset = -textWidth/2;
        // geometry.translate(leftOffset - 8, 0, 0);

        // Create material with metallic look
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x666666,
            shininess: 100,
            flatShading: false
        });

        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        console.log('Mesh position:', this.mesh.position);

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const frontLight = new THREE.DirectionalLight(0xffffff, 1);
        frontLight.position.set(0, 0, 1);
        this.scene.add(frontLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(0, 0, -1);
        this.scene.add(backLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
        topLight.position.set(0, 1, 0);
        this.scene.add(topLight);

        // Add event listeners
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));

        // Initial render to verify setup
        this.renderer.render(this.scene, this.camera);
        console.log('Initial render complete');

        // Start animation
        this.animate();
    }

    onResize() {
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height, false);
        console.log('Resize:', { width, height, aspect: this.camera.aspect });
    }

    onMouseMove(event) {
        const rect = this.element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Reduced rotation amount for more subtle effect
        this.mesh.rotation.y = x * 0.2;
        this.mesh.rotation.x = y * 0.2;
    }

    onMouseLeave() {
        this.mesh.rotation.set(0, 0, 0);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
} 