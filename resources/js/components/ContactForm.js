class ContactForm {
    constructor(container) {
        this.container = container;
        this.isExpanded = false;
        this.activeField = 0;
        this.totalFields = 4;
        
        // Initialize the form in collapsed state
        this.container.classList.remove('py-24');
        this.container.classList.add('py-12');
        
        // Set initial styles
        this.initializeStyles();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    initializeStyles() {
        const contactInfo = this.container.querySelector('[data-contact-info]');
        const formSection = this.container.querySelector('[data-form-section]');
        const initialButton = this.container.querySelector('[data-initial-button]');
        const fields = this.container.querySelectorAll('[data-form-field]');
        
        // Set initial styles for contact info
        if (contactInfo) {
            contactInfo.style.opacity = '0';
            contactInfo.style.transform = 'translateY(-32px)';
            contactInfo.style.gridTemplateRows = '0fr';
            contactInfo.style.visibility = 'hidden';
            contactInfo.style.height = '0';
        }

        // Set initial styles for form section
        if (formSection) {
            formSection.style.opacity = '0';
            formSection.style.transform = 'translateX(32px)';
            formSection.style.gridTemplateRows = '0fr';
            formSection.style.visibility = 'hidden';
            formSection.style.height = '0';
        }

        // Show initial button
        if (initialButton) {
            initialButton.style.opacity = '1';
            initialButton.style.visibility = 'visible';
            initialButton.style.height = 'auto';
        }

        // Set initial styles for form fields
        fields.forEach(field => {
            field.style.opacity = '0';
            field.style.transform = 'translateX(32px)';
            field.style.gridTemplateRows = '0fr';
            field.style.visibility = 'hidden';
        });
    }

    setupEventListeners() {
        const button = this.container.querySelector('[data-initial-button]');
        this.expandSection();
        if (button) {
            button.addEventListener('click', () => this.expandSection());
        }
        // Form submission
        const form = this.container.querySelector('form');
        const status = this.container.querySelector('#form-status');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (status) {
                    status.textContent = '';
                    status.className = 'text-center mt-4 text-lg';
                }
                // Spam protection: honeypot
                const honeypot = form.querySelector('[name="website"]');
                if (honeypot && honeypot.value) {
                    if (status) {
                        status.textContent = 'Spam detected.';
                        status.classList.add('text-red-500');
                    }
                    return;
                }
                // Client-side validation
                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const message = form.message.value.trim();
                if (!name || !email || !message) {
                    if (status) {
                        status.textContent = 'Please fill in all fields.';
                        status.classList.add('text-red-500');
                    }
                    return;
                }
                // Show loading
                if (status) {
                    status.textContent = 'Sending...';
                    status.classList.add('text-gray-400');
                }
                // Prepare FormData
                const formData = new FormData(form);
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    if (result.success) {
                        form.reset();
                        if (status) {
                            status.textContent = 'Thank you! Your message has been sent.';
                            status.classList.remove('text-gray-400');
                            status.classList.add('text-green-500');
                        }
                    } else {
                        throw new Error(result.error || 'Unknown error');
                    }
                } catch (err) {
                    if (status) {
                        status.textContent = 'Sorry, there was a problem sending your message. Please try again later.';
                        status.classList.remove('text-gray-400');
                        status.classList.add('text-red-500');
                    }
                }
            });
        }
    }

    expandSection() {
        this.isExpanded = true;
        
        // Hide initial button with fade
        const button = this.container.querySelector('[data-initial-button]');
        if (button) {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.display = 'none';
        }

        // Expand section
        this.container.classList.remove('py-12');
        this.container.classList.add('py-24');

        // Show and animate contact info after section expands
        setTimeout(() => {
            const contactInfo = this.container.querySelector('[data-contact-info]');
            if (contactInfo) {
                contactInfo.style.visibility = 'visible';
                contactInfo.style.gridTemplateRows = '1fr';
                contactInfo.style.height = 'auto';

                requestAnimationFrame(() => {
                    contactInfo.style.opacity = '1';
                    contactInfo.style.transform = 'translateY(0)';
                });
            }
        }, 300);

        // Show and animate form section
        setTimeout(() => {
            const formSection = this.container.querySelector('[data-form-section]');
            if (formSection) {
                formSection.style.visibility = 'visible';
                formSection.style.gridTemplateRows = '1fr';
                formSection.style.height = 'auto';
                
                requestAnimationFrame(() => {
                    formSection.style.opacity = '1';
                    formSection.style.transform = 'translateX(0)';
                });
            }
            
            this.animateFields();
        }, 300);
    }

    animateFields() {
        const fields = this.container.querySelectorAll('[data-form-field]');
        
        fields.forEach((field, index) => {
            setTimeout(() => {
                field.style.visibility = 'visible';
                field.style.gridTemplateRows = '1fr';
                field.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    field.style.opacity = '1';
                    field.style.transform = 'translateX(0)';
                });
            }, index * 200);
        });
    }
}

export default ContactForm;