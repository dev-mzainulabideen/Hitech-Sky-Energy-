/**
 * Alert Utility System
 * Provides Bootstrap alert messages for notifications, errors, and confirmations
 * Uses Bootstrap Icons for consistent iconography
 */

class AlertSystem {
    constructor() {
        this.container = document.getElementById('alertContainer');
        if (!this.container) {
            console.warn('Alert container not found. Creating one...');
            this.container = this.createContainer();
        }
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.className = 'alert-container';
        document.querySelector('main').prepend(container);
        return container;
    }

    /**
     * Show an alert message
     * @param {string} message - The alert message
     * @param {string} type - Alert type: 'success', 'danger', 'warning', 'info'
     * @param {number} duration - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
     * @param {boolean} dismissible - Whether the alert can be dismissed
     * @returns {HTMLElement} The created alert element
     */
    show(message, type = 'info', duration = 5000, dismissible = true) {
        const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Icon mapping for Bootstrap Icons
        const icons = {
            success: 'bi-check-circle-fill',
            danger: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };

        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show modern-alert" role="alert" id="${alertId}">
                <i class="bi ${icons[type] || icons.info} me-2"></i>
                <strong>${this.getTypeLabel(type)}</strong> ${message}
                ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = alertHTML;
        const alertElement = tempDiv.firstElementChild;

        this.container.appendChild(alertElement);

        // Auto-dismiss if duration is set
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(alertId);
            }, duration);
        }

        // Scroll to alert if it's not visible
        this.scrollToAlert(alertElement);

        return alertElement;
    }

    /**
     * Show success alert
     */
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Show error/danger alert
     */
    error(message, duration = 7000) {
        return this.show(message, 'danger', duration);
    }

    /**
     * Show warning alert
     */
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Show info alert
     */
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Dismiss an alert by ID
     */
    dismiss(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }

    /**
     * Clear all alerts
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Get type label for display
     */
    getTypeLabel(type) {
        const labels = {
            success: 'Success:',
            danger: 'Error:',
            warning: 'Warning:',
            info: 'Info:'
        };
        return labels[type] || 'Info:';
    }

    /**
     * Scroll to alert if not visible
     */
    scrollToAlert(alertElement) {
        setTimeout(() => {
            const rect = alertElement.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (!isVisible) {
                alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
}

// Create global instance
const alertSystem = new AlertSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertSystem;
}

