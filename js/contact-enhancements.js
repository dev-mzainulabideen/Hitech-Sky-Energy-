/**
 * Contact Page Enhancements
 * Handles copy-to-clipboard, map interactions, and other UX improvements
 */

class ContactPageEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupCopyToClipboard();
        this.setupMapFeatures();
        this.setupSmoothAnimations();
    }

    /**
     * Setup copy-to-clipboard functionality for contact info
     */
    setupCopyToClipboard() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const textToCopy = btn.getAttribute('data-copy');
                if (!textToCopy) return;

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    this.showCopySuccess(btn);
                } catch (err) {
                    // Fallback for older browsers
                    this.fallbackCopyToClipboard(textToCopy, btn);
                }
            });
        });
    }

    /**
     * Show copy success feedback
     */
    showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
        button.classList.add('copy-success');
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copy-success');
            button.disabled = false;
        }, 2000);
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopySuccess(button);
            } else {
                this.showCopyError(button);
            }
        } catch (err) {
            this.showCopyError(button);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * Show copy error feedback
     */
    showCopyError(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-x-circle text-danger"></i>';
        button.classList.add('copy-error');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copy-error');
        }, 2000);
    }

    /**
     * Setup map features
     */
    setupMapFeatures() {
        // Fullscreen map button
        const fullscreenBtn = document.getElementById('mapFullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleMapFullscreen();
            });
        }

        // Map hover effects
        const mapCard = document.querySelector('.map-card');
        if (mapCard) {
            mapCard.addEventListener('mouseenter', () => {
                mapCard.classList.add('map-hovered');
            });
            
            mapCard.addEventListener('mouseleave', () => {
                mapCard.classList.remove('map-hovered');
            });
        }

        // Map click to open in new tab
        const mapIframe = document.getElementById('officeMap');
        if (mapIframe) {
            const mapContainer = mapIframe.closest('.map-card');
            if (mapContainer) {
                mapContainer.addEventListener('click', (e) => {
                    // Only if clicking on the map itself, not on buttons
                    if (e.target === mapContainer || e.target.closest('.map-iframe')) {
                        window.open('https://www.google.com/maps/place/Bahria+Town+Phase+7,+Pakistan', '_blank');
                    }
                });
            }
        }
    }

    /**
     * Toggle map fullscreen
     */
    toggleMapFullscreen() {
        const mapCard = document.querySelector('.map-card');
        if (!mapCard) return;

        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (mapCard.requestFullscreen) {
                mapCard.requestFullscreen();
            } else if (mapCard.webkitRequestFullscreen) {
                mapCard.webkitRequestFullscreen();
            } else if (mapCard.msRequestFullscreen) {
                mapCard.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    /**
     * Setup smooth animations for contact page elements
     */
    setupSmoothAnimations() {
        // Animate contact info items on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe contact info items
        document.querySelectorAll('.contact-info-item-modern').forEach(item => {
            observer.observe(item);
        });

        // Observe form card
        const formCard = document.querySelector('.contact-form-card');
        if (formCard) {
            observer.observe(formCard);
        }

        // Observe map card
        const mapCard = document.querySelector('.map-card');
        if (mapCard) {
            observer.observe(mapCard);
        }
    }
}

// Initialize contact page enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.contactEnhancements = new ContactPageEnhancements();
});

