export default class AnimatedText {
    constructor() {
        this.words = [
            'Developer',
            'Designer',
            'Motion Artist',
            'Cinematographer',
            'Problem Solver',
            'Father',
            'Husband',
            'Friend',
            'Explorer'
        ];
        this.currentIndex = 0;
        this.element = document.querySelector('.typing-animation');
        this.isDeleting = false;
        this.text = '';
        this.typeSpeed = 100;
        this.deleteSpeed = 100;
        this.pauseTime = 2000;

        if (this.element) {
            this.animate();
        }
    }

    animate() {
        const currentWord = this.words[this.currentIndex];
        
        if (this.isDeleting) {
            this.text = currentWord.substring(0, this.text.length - 1);
        } else {
            this.text = currentWord.substring(0, this.text.length + 1);
        }

        this.element.textContent = this.text;

        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.text === currentWord) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
        }

        setTimeout(() => this.animate(), speed);
    }
} 