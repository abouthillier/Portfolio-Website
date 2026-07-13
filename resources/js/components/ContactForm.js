class ContactForm {
    constructor(container) {
        this.container = container;
        this.isExpanded = false;

        this.container.classList.remove('py-24');
        this.container.classList.add('py-12');

        this.initializeStyles();
        this.setupEventListeners();
    }

    initializeStyles() {
        const contactInfo = this.container.querySelector('[data-contact-info]');
        const formSection = this.container.querySelector('[data-form-section]');
        const fields = this.container.querySelectorAll('[data-form-field]');

        if (contactInfo) {
            contactInfo.style.opacity = '0';
            contactInfo.style.transform = 'translateY(-32px)';
            contactInfo.style.gridTemplateRows = '0fr';
            contactInfo.style.visibility = 'hidden';
            contactInfo.style.height = '0';
        }

        if (formSection) {
            formSection.style.opacity = '0';
            formSection.style.transform = 'translateX(32px)';
            formSection.style.gridTemplateRows = '0fr';
            formSection.style.visibility = 'hidden';
            formSection.style.height = '0';
        }

        fields.forEach(field => {
            field.style.opacity = '0';
            field.style.transform = 'translateX(32px)';
            field.style.gridTemplateRows = '0fr';
            field.style.visibility = 'hidden';
        });
    }

    setupEventListeners() {
        this.expandSection();

        const form = this.container.querySelector('form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    }

    async handleSubmit(e, form) {
        e.preventDefault();

        const status = this.container.querySelector('#form-status');
        const submitButton = form.querySelector('[data-submit-button]');
        const submitLabel = form.querySelector('[data-submit-label]');

        this.clearFieldErrors(form);
        this.setStatus(status, '');

        if (submitButton) {
            submitButton.disabled = true;
        }
        if (submitLabel) {
            submitLabel.textContent = 'Sending…';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json',
                },
            });

            let result = {};
            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (response.status === 429) {
                this.setStatus(status, 'Too many attempts. Please wait a minute and try again.', 'error');
                return;
            }

            if (result.success) {
                form.reset();
                this.setFormStartedAt(form);
                this.resetTurnstile(form);
                this.setStatus(status, 'Thank you! Your message has been sent.', 'success');
                return;
            }

            if (result.error && typeof result.error === 'object') {
                this.showFieldErrors(form, result.error);
                const firstError = Object.values(result.error)[0];
                if (firstError) {
                    this.setStatus(status, firstError, 'error');
                }
                return;
            }

            if (result.errors) {
                const errorMessages = Array.isArray(result.errors)
                    ? result.errors.join(' ')
                    : Object.values(result.errors).flat().join(' ');
                this.setStatus(status, errorMessages, 'error');
                return;
            }

            throw new Error(result.error || 'Unknown error');
        } catch {
            this.setStatus(status, 'Sorry, there was a problem sending your message. Please try again later.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
            if (submitLabel) {
                submitLabel.textContent = 'Send Message';
            }
        }
    }

    setStatus(statusEl, message, type = '') {
        if (!statusEl) {
            return;
        }

        statusEl.textContent = message;
        statusEl.className = 'rounded-xl border px-5 py-4 text-sm';

        if (!message) {
            statusEl.classList.add('hidden');
            return;
        }

        statusEl.classList.remove('hidden');

        if (type === 'success') {
            statusEl.classList.add('border-cyan-500/40', 'bg-cyan-500/10', 'text-cyan-100');
        } else if (type === 'error') {
            statusEl.classList.add('border-red-500/40', 'bg-red-500/10', 'text-red-200');
        }
    }

    clearFieldErrors(form) {
        form.querySelectorAll('[data-field-error]').forEach(el => {
            el.textContent = '';
            el.classList.add('hidden');
            el.classList.remove('text-red-400');
        });
    }

    showFieldErrors(form, errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const errorEl = form.querySelector(`[data-field-error="${field}"]`);
            if (!errorEl) {
                return;
            }

            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            errorEl.classList.add('text-red-400');
        });
    }

    setFormStartedAt(form) {
        const startedAt = form.querySelector('[data-form-started-at]');
        if (startedAt) {
            startedAt.value = String(Math.floor(Date.now() / 1000));
        }
    }

    resetTurnstile(form) {
        if (typeof window.turnstile === 'undefined') {
            return;
        }

        form.querySelectorAll('.cf-turnstile').forEach(widget => {
            window.turnstile.reset(widget);
        });
    }

    expandSection() {
        this.isExpanded = true;
        this.container.classList.remove('py-12');
        this.container.classList.add('py-24');

        const form = this.container.querySelector('form');
        if (form) {
            this.setFormStartedAt(form);
        }

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
