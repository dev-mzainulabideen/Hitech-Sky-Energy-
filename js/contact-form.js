/**
 * Enhanced Contact Form Handler
 * Provides real-time validation, character counters, and improved UX
 */

class ContactFormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.warn(`Form with ID "${formId}" not found`);
            return;
        }
        
        this.storageKey = 'contactFormData';
        this.initializeForm();
        this.setupRealTimeValidation();
        this.setupCharacterCounters();
        this.setupPhoneFormatting();
        this.setupAutoSave();
        this.loadSavedData();
        this.setupFormSubmission();
    }

    /**
     * Initialize form with enhanced features
     */
    initializeForm() {
        // Add loading state to submit button
        this.submitButton = this.form.querySelector('button[type="submit"]');
        if (this.submitButton) {
            this.originalSubmitText = this.submitButton.innerHTML;
        }

        // Add visual feedback classes
        this.form.classList.add('enhanced-contact-form');
        
        // Create form status indicator
        this.createStatusIndicator();
    }

    /**
     * Setup real-time validation for all fields
     */
    setupRealTimeValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            // Validate on input (for immediate feedback)
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) {
                    this.validateField(field);
                }
            });

            // Add visual feedback on focus
            field.addEventListener('focus', () => {
                field.classList.add('field-focused');
            });

            field.addEventListener('blur', () => {
                field.classList.remove('field-focused');
            });
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const isValid = field.checkValidity();
        const fieldContainer = field.closest('.col-md-6, .col-12') || field.parentElement;
        
        // Remove previous validation classes
        field.classList.remove('is-valid', 'is-invalid');
        field.classList.remove('field-focused');
        
        if (field.value.trim() !== '' || field.hasAttribute('required')) {
            if (isValid) {
                field.classList.add('is-valid');
                this.showFieldSuccess(fieldContainer, field);
            } else {
                field.classList.add('is-invalid');
                this.showFieldError(fieldContainer, field);
            }
        }

        // Special validation for email
        if (field.type === 'email' && field.value.trim() !== '') {
            if (!this.isValidEmail(field.value)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                this.showFieldError(fieldContainer, field, 'Please enter a valid email address.');
            }
        }

        // Special validation for phone
        if (field.type === 'tel' && field.value.trim() !== '') {
            if (!this.isValidPhone(field.value)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                this.showFieldError(fieldContainer, field, 'Please enter a valid phone number.');
            } else {
                field.classList.add('is-valid');
                field.classList.remove('is-invalid');
            }
        }

        // Special validation for textarea (message)
        if (field.tagName === 'TEXTAREA' && field.value.trim() !== '') {
            const minLength = parseInt(field.getAttribute('minlength')) || 10;
            if (field.value.trim().length < minLength) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                this.showFieldError(fieldContainer, field, `Message must be at least ${minLength} characters long.`);
            }
        }

        this.updateFormStatus();
    }

    /**
     * Show field success indicator
     */
    showFieldSuccess(container, field) {
        this.removeFieldFeedback(container);
        const successIcon = document.createElement('div');
        successIcon.className = 'field-feedback field-success';
        successIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
        container.appendChild(successIcon);
    }

    /**
     * Show field error indicator
     */
    showFieldError(container, field, customMessage = null) {
        this.removeFieldFeedback(container);
        const errorIcon = document.createElement('div');
        errorIcon.className = 'field-feedback field-error';
        const message = customMessage || field.validationMessage || 'This field is required.';
        errorIcon.innerHTML = `<i class="bi bi-exclamation-circle-fill text-danger"></i>`;
        container.appendChild(errorIcon);
    }

    /**
     * Remove field feedback indicators
     */
    removeFieldFeedback(container) {
        const existingFeedback = container.querySelector('.field-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }

    /**
     * Setup character counters for text fields
     */
    setupCharacterCounters() {
        const textFields = this.form.querySelectorAll('textarea, input[type="text"]');
        
        textFields.forEach(field => {
            const maxLength = field.getAttribute('maxlength') || (field.tagName === 'TEXTAREA' ? 1000 : 100);
            field.setAttribute('maxlength', maxLength);
            
            // Create counter element
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.setAttribute('data-field', field.id);
            counter.innerHTML = `<span class="current-count">0</span> / <span class="max-count">${maxLength}</span>`;
            
            const fieldContainer = field.closest('.col-md-6, .col-12') || field.parentElement;
            fieldContainer.appendChild(counter);
            
            // Update counter on input
            field.addEventListener('input', () => {
                const current = field.value.length;
                const max = parseInt(maxLength);
                const counterElement = fieldContainer.querySelector('.character-counter');
                
                if (counterElement) {
                    counterElement.querySelector('.current-count').textContent = current;
                    
                    // Add warning class if approaching limit
                    if (current > max * 0.9) {
                        counterElement.classList.add('near-limit');
                    } else {
                        counterElement.classList.remove('near-limit');
                    }
                    
                    if (current >= max) {
                        counterElement.classList.add('at-limit');
                    } else {
                        counterElement.classList.remove('at-limit');
                    }
                }
            });
        });
    }

    /**
     * Setup phone number formatting
     */
    setupPhoneFormatting() {
        const phoneField = this.form.querySelector('input[type="tel"]');
        if (!phoneField) return;

        phoneField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            
            // Format as +92 XXX XXXXXXX
            if (value.length > 0) {
                if (value.startsWith('92')) {
                    value = '+' + value;
                } else if (!value.startsWith('+92')) {
                    value = '+92' + value;
                }
                
                // Add spaces for readability
                if (value.length > 3) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                }
                if (value.length > 7) {
                    value = value.slice(0, 7) + ' ' + value.slice(7);
                }
            }
            
            e.target.value = value;
        });
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('input', () => {
                this.saveFormData();
            });
            
            field.addEventListener('change', () => {
                this.saveFormData();
            });
        });
    }

    /**
     * Save form data to localStorage
     */
    saveFormData() {
        const formData = {
            name: this.form.querySelector('#name')?.value || '',
            email: this.form.querySelector('#email')?.value || '',
            phone: this.form.querySelector('#phone')?.value || '',
            subject: this.form.querySelector('#subject')?.value || '',
            message: this.form.querySelector('#message')?.value || '',
            consent: this.form.querySelector('#consent')?.checked || false
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(formData));
        } catch (e) {
            console.warn('Could not save form data:', e);
        }
    }

    /**
     * Load saved form data from localStorage
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                if (formData.name) this.form.querySelector('#name').value = formData.name;
                if (formData.email) this.form.querySelector('#email').value = formData.email;
                if (formData.phone) this.form.querySelector('#phone').value = formData.phone;
                if (formData.subject) this.form.querySelector('#subject').value = formData.subject;
                if (formData.message) this.form.querySelector('#message').value = formData.message;
                if (formData.consent) this.form.querySelector('#consent').checked = formData.consent;
                
                // Show restore notification
                this.showRestoreNotification();
            }
        } catch (e) {
            console.warn('Could not load saved form data:', e);
        }
    }

    /**
     * Show notification that form data was restored
     */
    showRestoreNotification() {
        const notification = document.createElement('div');
        notification.className = 'alert alert-info alert-dismissible fade show form-restore-notification';
        notification.innerHTML = `
            <i class="bi bi-info-circle me-2"></i>
            <strong>Form data restored!</strong> Your previous entries have been loaded.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const formAlert = this.form.querySelector('#formAlert') || this.form;
        formAlert.insertBefore(notification, formAlert.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Clear saved form data
     */
    clearSavedData() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.warn('Could not clear saved form data:', e);
        }
    }

    /**
     * Setup form submission with enhanced feedback
     */
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Validate all fields
            const isValid = this.validateAllFields();

            if (!isValid) {
                if (typeof alertSystem !== 'undefined') {
                    alertSystem.error('Please fill in all required fields correctly.');
                }
                this.form.classList.add('was-validated');
                this.scrollToFirstError();
                return;
            }

            // Show loading state
            this.setLoadingState(true);

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                this.handleFormSuccess();
            }, 1500);
        });
    }

    /**
     * Validate all form fields
     */
    validateAllFields() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        
        fields.forEach(field => {
            this.validateField(field);
            if (!field.checkValidity()) {
                isValid = false;
            }
        });

        // Validate checkbox
        const consentCheckbox = this.form.querySelector('#consent');
        if (consentCheckbox && !consentCheckbox.checked) {
            isValid = false;
            consentCheckbox.classList.add('is-invalid');
        }

        return isValid;
    }

    /**
     * Handle successful form submission
     */
    handleFormSuccess() {
        this.setLoadingState(false);
        
        if (typeof alertSystem !== 'undefined') {
            alertSystem.success('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
        }

        // Clear saved form data
        this.clearSavedData();

        // Reset form
        this.form.reset();
        this.form.classList.remove('was-validated');
        
        // Clear all validation states
        this.form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });

        // Clear character counters
        this.form.querySelectorAll('.character-counter').forEach(counter => {
            counter.querySelector('.current-count').textContent = '0';
            counter.classList.remove('near-limit', 'at-limit');
        });

        // Remove field feedback
        this.form.querySelectorAll('.field-feedback').forEach(feedback => {
            feedback.remove();
        });

        // Update form status
        this.updateFormStatus();

        // Scroll to top of form
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Clear form and saved data
     */
    clearForm() {
        if (confirm('Are you sure you want to clear all form data?')) {
            this.form.reset();
            this.clearSavedData();
            this.form.classList.remove('was-validated');
            
            // Clear all validation states
            this.form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });

            // Clear character counters
            this.form.querySelectorAll('.character-counter').forEach(counter => {
                counter.querySelector('.current-count').textContent = '0';
                counter.classList.remove('near-limit', 'at-limit');
            });

            // Remove field feedback
            this.form.querySelectorAll('.field-feedback').forEach(feedback => {
                feedback.remove();
            });

            // Update form status
            this.updateFormStatus();

            if (typeof alertSystem !== 'undefined') {
                alertSystem.info('Form has been cleared.');
            }
        }
    }

    /**
     * Set loading state on submit button
     */
    setLoadingState(loading) {
        if (!this.submitButton) return;

        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalSubmitText;
            this.submitButton.classList.remove('loading');
        }
    }

    /**
     * Create form status indicator
     */
    createStatusIndicator() {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status-indicator';
        statusDiv.innerHTML = '<i class="bi bi-info-circle me-2"></i><span class="status-text">Fill in all required fields to submit</span>';
        this.form.appendChild(statusDiv);
    }

    /**
     * Update form status indicator
     */
    updateFormStatus() {
        const statusIndicator = this.form.querySelector('.form-status-indicator');
        if (!statusIndicator) return;

        const requiredFields = this.form.querySelectorAll('input[required], textarea[required], select[required], #consent');
        let filledCount = 0;
        let validCount = 0;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                if (field.checked) {
                    filledCount++;
                    validCount++;
                }
            } else {
                if (field.value.trim() !== '') {
                    filledCount++;
                    if (field.checkValidity()) {
                        validCount++;
                    }
                }
            }
        });

        const totalFields = requiredFields.length;
        const statusText = statusIndicator.querySelector('.status-text');
        
        if (validCount === totalFields) {
            statusIndicator.className = 'form-status-indicator status-ready';
            statusText.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>All fields are valid. Ready to submit!';
        } else if (filledCount === totalFields) {
            statusIndicator.className = 'form-status-indicator status-warning';
            statusText.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Please fix ${totalFields - validCount} error(s)`;
        } else {
            statusIndicator.className = 'form-status-indicator status-info';
            statusText.innerHTML = `<i class="bi bi-info-circle me-2"></i>${filledCount} of ${totalFields} required fields completed`;
        }
    }

    /**
     * Scroll to first error field
     */
    scrollToFirstError() {
        const firstError = this.form.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Email validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation
     */
    isValidPhone(phone) {
        // Remove spaces and + for validation
        const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
        // Pakistani phone format: +92XXXXXXXXXXX (12 digits after +92)
        const phoneRegex = /^\+92\d{10}$/;
        return phoneRegex.test(cleanPhone) || cleanPhone.length >= 10;
    }
}

// Initialize contact form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        window.contactFormHandler = new ContactFormHandler('contactForm');
        
        // Setup clear form button
        const clearFormBtn = document.getElementById('clearFormBtn');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => {
                window.contactFormHandler.clearForm();
            });
        }
    }
});

