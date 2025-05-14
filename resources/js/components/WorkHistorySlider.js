import { gsap } from 'gsap';

export default class WorkHistorySlider {
    constructor() {
        this.container = document.querySelector('.slider-container');
        this.items = document.querySelectorAll('.slider-item');
        this.dots = document.querySelectorAll('.slider-dot');
        this.prevButton = document.querySelector('.prev-slide');
        this.nextButton = document.querySelector('.next-slide');
        
        this.currentIndex = 0;
        this.totalItems = this.items.length;
        
        if (this.container && this.items.length) {
            this.init();
        }
    }

    init() {
        // Set initial positions
        this.setupSlider();
        
        // Add event listeners
        this.prevButton?.addEventListener('click', () => this.slide('prev'));
        this.nextButton?.addEventListener('click', () => this.slide('next'));
        
        // Add dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Set initial active state
        this.updateActiveState();
        this.animateText(this.items[0]);
    }

    setupSlider() {
        // Position all items with initial 3D transforms
        this.items.forEach((item, index) => {
            const imageContainer = item.querySelector('.image-container');
            const textContent = item.querySelector('.text-content');
            
            // Wrap each word in a span
            if (textContent) {
                const text = textContent.textContent;
                const words = text.split(' ');
                textContent.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
            }

            gsap.set(item, {
                opacity: index === 0 ? 1 : 0,
                scale: index === 0 ? 1 : 0.95,
                zIndex: index === 0 ? 999 : this.totalItems + 2 - index
            });

            if (imageContainer) {
                gsap.set(imageContainer, {
                    x: `${index * 100}%`,
                    rotateY: index === 0 ? 0 : this.getRandomRotation(),
                    z: index === 0 ? 0 : -100
                });
            }
        });
    }

    getRandomRotation() {
        return Math.floor(Math.random() * 21) - 10;
    }

    slide(direction) {
        const newIndex = direction === 'next' 
            ? (this.currentIndex + 1) % this.totalItems
            : (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        
        this.goToSlide(newIndex);
    }

    animateText(item) {
        const words = item.querySelectorAll('.word');
        words.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * 50); // 50ms delay between each word
        });
    }

    goToSlide(index) {
        const direction = index > this.currentIndex ? 1 : -1;
        const currentItem = this.items[this.currentIndex];
        const nextItem = this.items[index];
        
        // Animate current slide out
        gsap.to(currentItem, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut"
        });

        const currentImage = currentItem.querySelector('.image-container');
        if (currentImage) {
            gsap.to(currentImage, {
                x: `${-direction * 100}%`,
                rotateY: this.getRandomRotation(),
                z: -100,
                duration: 0.4,
                ease: "power2.inOut"
            });
        }

        // Animate new slide in
        gsap.to(nextItem, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.inOut"
        });

        const nextImage = nextItem.querySelector('.image-container');
        if (nextImage) {
            gsap.to(nextImage, {
                x: '0%',
                rotateY: 0,
                z: 0,
                duration: 0.4,
                ease: "power2.inOut"
            });
        }

        // Update z-index for proper stacking
        this.items.forEach((item, i) => {
            gsap.set(item, {
                zIndex: i === index ? 999 : this.totalItems + 2 - i
            });
        });

        // Animate text word by word
        this.animateText(nextItem);

        // Update current index
        this.currentIndex = index;
        this.updateActiveState();
    }

    updateActiveState() {
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('bg-cyan-400', index === this.currentIndex);
            dot.classList.toggle('bg-gray-600', index !== this.currentIndex);
        });
    }
} 