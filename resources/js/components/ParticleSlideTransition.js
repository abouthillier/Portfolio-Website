import * as THREE from 'three';
import { gsap } from 'gsap';
import BAS from '../lib/THREE.BAS';

class SlideGeometry extends THREE.BufferGeometry {
    constructor(model) {
        super();
        this.modelGeometry = model;
        this.faceCount = model.attributes.position.count / 3;
        this.bufferPositions();
    }

    bufferPositions() {
        const positionBuffer = new Float32Array(this.faceCount * 9);
        const positions = this.modelGeometry.attributes.position.array;
        
        for (let i = 0; i < this.faceCount; i++) {
            const i3 = i * 3;
            const i9 = i * 9;
            
            // Get vertices for this face
            const a = new THREE.Vector3(
                positions[i3 * 3],
                positions[i3 * 3 + 1],
                positions[i3 * 3 + 2]
            );
            const b = new THREE.Vector3(
                positions[(i3 + 1) * 3],
                positions[(i3 + 1) * 3 + 1],
                positions[(i3 + 1) * 3 + 2]
            );
            const c = new THREE.Vector3(
                positions[(i3 + 2) * 3],
                positions[(i3 + 2) * 3 + 1],
                positions[(i3 + 2) * 3 + 2]
            );
            
            // Calculate centroid
            const centroid = new THREE.Vector3()
                .addVectors(a, b)
                .add(c)
                .multiplyScalar(1/3);
            
            // Store positions relative to centroid
            positionBuffer[i9] = a.x - centroid.x;
            positionBuffer[i9 + 1] = a.y - centroid.y;
            positionBuffer[i9 + 2] = a.z - centroid.z;
            
            positionBuffer[i9 + 3] = b.x - centroid.x;
            positionBuffer[i9 + 4] = b.y - centroid.y;
            positionBuffer[i9 + 5] = b.z - centroid.z;
            
            positionBuffer[i9 + 6] = c.x - centroid.x;
            positionBuffer[i9 + 7] = c.y - centroid.y;
            positionBuffer[i9 + 8] = c.z - centroid.z;
        }
        
        this.setAttribute('position', new THREE.BufferAttribute(positionBuffer, 3));
    }
}

class Slide extends THREE.Mesh {
    constructor(width, height, animationPhase) {
        const plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2);
        BAS.Utils.separateFaces(plane);
        
        const geometry = new SlideGeometry(plane);
        
        const aAnimation = new Float32Array(geometry.attributes.position.count * 2);
        const aStartPosition = new Float32Array(geometry.attributes.position.count * 3);
        const aControl0 = new Float32Array(geometry.attributes.position.count * 3);
        const aControl1 = new Float32Array(geometry.attributes.position.count * 3);
        const aEndPosition = new Float32Array(geometry.attributes.position.count * 3);
        
        const minDuration = 0.8;
        const maxDuration = 1.2;
        const maxDelayX = 0.9;
        const maxDelayY = 0.125;
        const stretch = 0.11;
        
        const totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;
        
        const startPosition = new THREE.Vector3();
        const control0 = new THREE.Vector3();
        const control1 = new THREE.Vector3();
        const endPosition = new THREE.Vector3();
        const tempPoint = new THREE.Vector3();
        
        function getControlPoint0(centroid) {
            const signY = Math.sign(centroid.y);
            tempPoint.x = THREE.MathUtils.randFloat(0.1, 0.3) * 50;
            tempPoint.y = signY * THREE.MathUtils.randFloat(0.1, 0.3) * 70;
            tempPoint.z = THREE.MathUtils.randFloatSpread(20);
            return tempPoint;
        }
        
        function getControlPoint1(centroid) {
            const signY = Math.sign(centroid.y);
            tempPoint.x = THREE.MathUtils.randFloat(0.3, 0.6) * 50;
            tempPoint.y = -signY * THREE.MathUtils.randFloat(0.3, 0.6) * 70;
            tempPoint.z = THREE.MathUtils.randFloatSpread(20);
            return tempPoint;
        }
        
        const positions = plane.attributes.position.array;
        const vertexCount = positions.length / 3;
        
        for (let i = 0, i2 = 0, i3 = 0; i < vertexCount; i += 3, i2 += 6, i3 += 9) {
            // Get vertices for this face
            const a = new THREE.Vector3(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );
            const b = new THREE.Vector3(
                positions[(i + 1) * 3],
                positions[(i + 1) * 3 + 1],
                positions[(i + 1) * 3 + 2]
            );
            const c = new THREE.Vector3(
                positions[(i + 2) * 3],
                positions[(i + 2) * 3 + 1],
                positions[(i + 2) * 3 + 2]
            );
            
            // Calculate centroid
            const centroid = new THREE.Vector3()
                .addVectors(a, b)
                .add(c)
                .multiplyScalar(1/3);
            
            const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);
            const delayX = THREE.MathUtils.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
            const delayY = animationPhase === 'in' 
                ? THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY)
                : THREE.MathUtils.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0);
            
            for (let v = 0; v < 6; v += 2) {
                aAnimation[i2 + v] = delayX + delayY + (Math.random() * stretch * duration);
                aAnimation[i2 + v + 1] = duration;
            }
            
            endPosition.copy(centroid);
            startPosition.copy(centroid);
            
            if (animationPhase === 'in') {
                control0.copy(centroid).sub(getControlPoint0(centroid));
                control1.copy(centroid).sub(getControlPoint1(centroid));
            } else {
                control0.copy(centroid).add(getControlPoint0(centroid));
                control1.copy(centroid).add(getControlPoint1(centroid));
            }
            
            for (let v = 0; v < 9; v += 3) {
                aStartPosition[i3 + v] = startPosition.x;
                aStartPosition[i3 + v + 1] = startPosition.y;
                aStartPosition[i3 + v + 2] = startPosition.z;
                
                aControl0[i3 + v] = control0.x;
                aControl0[i3 + v + 1] = control0.y;
                aControl0[i3 + v + 2] = control0.z;
                
                aControl1[i3 + v] = control1.x;
                aControl1[i3 + v + 1] = control1.y;
                aControl1[i3 + v + 2] = control1.z;
                
                aEndPosition[i3 + v] = endPosition.x;
                aEndPosition[i3 + v + 1] = endPosition.y;
                aEndPosition[i3 + v + 2] = endPosition.z;
            }
        }
        
        geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2));
        geometry.setAttribute('aStartPosition', new THREE.BufferAttribute(aStartPosition, 3));
        geometry.setAttribute('aControl0', new THREE.BufferAttribute(aControl0, 3));
        geometry.setAttribute('aControl1', new THREE.BufferAttribute(aControl1, 3));
        geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                map: { value: new THREE.Texture() }
            },
            vertexShader: `
                ${BAS.ShaderChunk.cubic_bezier}
                ${BAS.ShaderChunk.ease_in_out_cubic}
                
                uniform float uTime;
                attribute vec2 aAnimation;
                attribute vec3 aStartPosition;
                attribute vec3 aControl0;
                attribute vec3 aControl1;
                attribute vec3 aEndPosition;
                
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    
                    float tDelay = aAnimation.x;
                    float tDuration = aAnimation.y;
                    float tTime = clamp(uTime - tDelay, 0.0, tDuration);
                    float tProgress = ease(tTime / tDuration);
                    
                    vec3 pos = cubicBezier(
                        aStartPosition,
                        aControl0,
                        aControl1,
                        aEndPosition,
                        tProgress
                    );
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                varying vec2 vUv;
                
                void main() {
                    gl_FragColor = texture2D(map, vUv);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        super(geometry, material);
        
        this.frustumCulled = false;
        this.totalDuration = totalDuration;
    }
    
    setImage(image) {
        this.material.uniforms.map.value.image = image;
        this.material.uniforms.map.value.needsUpdate = true;
        this.material.uniforms.map.value.colorSpace = THREE.SRGBColorSpace;
    }
    
    transition() {
        return gsap.fromTo(this.material.uniforms.uTime, 
            { value: 0 },
            { value: this.totalDuration, duration: 3, ease: "none" }
        );
    }
}

class ParticleSlideTransition {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(80, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.slides = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.texturesLoaded = false;
        this.textureLoader = new THREE.TextureLoader();
        
        this.init();
    }

    init() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 60;
        
        this.createSlides();
        this.animate();
        
        window.addEventListener('resize', () => this.onResize());
    }

    async createSlides() {
        const images = this.container.querySelectorAll('.image-container img');
        const width = 100;
        const height = 60;

        const loadTexture = (src) => {
            return new Promise((resolve, reject) => {
                const texture = new THREE.Texture();
                texture.image = new Image();
                texture.image.crossOrigin = 'Anonymous';
                
                console.log('Loading image:', src);
                
                texture.image.onload = () => {
                    console.log('Image loaded:', texture.image.src);
                    texture.needsUpdate = true;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.format = THREE.RGBAFormat;
                    texture.type = THREE.UnsignedByteType;
                    texture.generateMipmaps = false;
                    texture.colorSpace = THREE.SRGBColorSpace;
                    resolve(texture);
                };
                
                texture.image.onerror = (e) => {
                    console.error('Failed to load image:', texture.image.src, e);
                    reject(e);
                };
                texture.image.src = src;
            });
        };

        try {
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const slide = new Slide(width, height, i === 0 ? 'in' : 'out');
                
                const texture = await loadTexture(img.dataset.src);
                slide.material.uniforms.map.value = texture;
                
                this.scene.add(slide);
                this.slides.push(slide);
            }
            
            this.texturesLoaded = true;
        } catch (error) {
            console.error('Error loading textures:', error);
        }
    }

    transition(direction) {
        if (this.isAnimating || !this.texturesLoaded) return;
        this.isAnimating = true;

        const currentSlide = this.slides[this.currentIndex];
        const nextIndex = direction === 'next' 
            ? (this.currentIndex + 1) % this.slides.length
            : (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        const nextSlide = this.slides[nextIndex];

        const tl = gsap.timeline({
            onComplete: () => {
                this.currentIndex = nextIndex;
                this.isAnimating = false;
            }
        });

        tl.add(currentSlide.transition(), 0);
        tl.add(nextSlide.transition(), 0);
    }

    animate() {
        if (!this.texturesLoaded) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.renderer.setViewport(0, 0, width, height);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setViewport(0, 0, width, height);
    }
}

export default ParticleSlideTransition; 