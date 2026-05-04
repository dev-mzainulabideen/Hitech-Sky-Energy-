/**
 * Main JavaScript for Hitech Sky Energy Website
 * Handles interactive features, animations, and form submissions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation active state
    initializeNavigation();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize form handlers
    initializeForms();
    
    // Initialize newsletter forms
    initializeNewsletterForms();
    
    // Add smooth scroll behavior for anchor links
    initializeSmoothScroll();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
});

/**
 * Initialize navigation active state based on current page
 */
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.modern-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            link.classList.remove('active');
            
            // Set active state
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && link.getAttribute('data-page') === 'home') ||
                (currentPage === 'about.html' && link.getAttribute('data-page') === 'about')) {
                link.classList.add('active');
            }
        }
    });
}

/**
 * Initialize scroll animations for elements with modern effects
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.classList.add('visible');
                entry.target.classList.add('animated');
                
                // Add staggered animation to children
                const children = entry.target.querySelectorAll('.animate-on-scroll, .card, .gallery-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections, cards, and elements with animate-on-scroll class
    document.querySelectorAll('section, .card, .animate-on-scroll, .gallery-card, .team-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Animate sections on load
    document.querySelectorAll('section').forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('visible');
        }, index * 200);
    });
}

/**
 * Initialize form handlers
 */
function initializeForms() {
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                // Form is valid - show success message
                if (typeof alertSystem !== 'undefined') {
                    alertSystem.success('Thank you! Your message has been sent successfully. We will get back to you soon.');
                    this.reset();
                    this.classList.remove('was-validated');
                }
            } else {
                // Form is invalid - show error message
                if (typeof alertSystem !== 'undefined') {
                    alertSystem.error('Please fill in all required fields correctly.');
                }
                this.classList.add('was-validated');
            }
        });
    }
}

/**
 * Initialize newsletter forms
 */
function initializeNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput?.value;
            
            if (email && isValidEmail(email)) {
                if (typeof alertSystem !== 'undefined') {
                    alertSystem.success('Thank you for subscribing to our newsletter!');
                }
                emailInput.value = '';
            } else {
                if (typeof alertSystem !== 'undefined') {
                    alertSystem.warning('Please enter a valid email address.');
                }
            }
        });
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize smooth scroll for anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Initialize navbar scroll effect
 */
function initializeNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Utility: Show loading state on buttons
 */
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}
