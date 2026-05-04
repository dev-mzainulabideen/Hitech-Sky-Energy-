/**
 * Component Loader
 * Loads reusable HTML components (header, navbar, footer) into pages
 */

class ComponentLoader {
    constructor() {
        this.components = {};
        this.loaded = false;
    }

    /**
     * Load a component from an HTML file
     * @param {string} componentName - Name of the component (header, navbar, footer)
     * @param {string} targetId - ID of the element where component will be inserted
     */
    async loadComponent(componentName, targetId) {
        try {
            // Use relative path from current page location
            const basePath = window.location.pathname.includes('/') 
                ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
                : '';
            
            let componentPath = `components/${componentName}.html`;
            
            // If we're at root level, use direct path
            if (basePath && basePath !== '/') {
                componentPath = `${basePath}/${componentPath}`;
            }
            
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            const target = document.getElementById(targetId);
            
            if (!target) {
                console.warn(`Target element #${targetId} not found for component ${componentName}`);
                return;
            }
            
            target.innerHTML = html;
            this.components[componentName] = html;
            
            // Trigger custom event after component is loaded
            document.dispatchEvent(new CustomEvent('componentLoaded', {
                detail: { component: componentName, targetId: targetId }
            }));
            
            console.log(`✓ ${componentName} component loaded successfully`);
            return html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
            console.error(`Attempted path: components/${componentName}.html`);
            
            // Check if file:// protocol (local file)
            if (window.location.protocol === 'file:') {
                const target = document.getElementById(targetId);
                if (target) {
                    target.innerHTML = `<div class="alert alert-info">⚠️ Note: Components require a web server. Use 'python -m http.server 8000' or VS Code Live Server extension.</div>`;
                }
                return;
            }
            
            // Fallback: show error message in target
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = `<div class="alert alert-warning">Failed to load ${componentName} component. Error: ${error.message}</div>`;
            }
        }
    }

    /**
     * Load all components at once
     * @param {Object} components - Object with component names and target IDs
     * Example: { header: 'header-container', navbar: 'navbar-container', footer: 'footer-container' }
     */
    async loadAll(components) {
        const promises = Object.entries(components).map(([name, targetId]) => 
            this.loadComponent(name, targetId)
        );
        
        await Promise.all(promises);
        this.loaded = true;
        
        // Trigger all components loaded event
        document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
        
        // Initialize navigation highlighting after components are loaded
        this.initializeNavigation();
    }

    /**
     * Initialize navigation active state based on current page
     */
    initializeNavigation() {
        // Get current page name from URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop();
                // Remove active class from all links
                link.classList.remove('active');
                
                // Add active class if it matches current page or contains current section
                if (linkPage === currentPage || 
                    (currentPage === 'index.html' && link.getAttribute('data-page'))) {
                    link.classList.add('active');
                }
            }
        });

        // Handle section highlighting for index.html
        if (currentPage === 'index.html') {
            this.handleSectionNavigation();
        }
    }

    /**
     * Handle section navigation highlighting on scroll
     */
    handleSectionNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#mainNavbar .nav-link[data-page]');
        
        const handleScroll = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === current) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial load
    }

    /**
     * Get cached component HTML
     * @param {string} componentName 
     * @returns {string|null}
     */
    getComponent(componentName) {
        return this.components[componentName] || null;
    }
}

// Create global instance
const componentLoader = new ComponentLoader();

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check which components exist on the page and load them
    const componentsToLoad = {};
    
    if (document.getElementById('header-container')) {
        componentsToLoad.header = 'header-container';
    }
    
    if (document.getElementById('navbar-container')) {
        componentsToLoad.navbar = 'navbar-container';
    }
    
    if (document.getElementById('footer-container')) {
        componentsToLoad.footer = 'footer-container';
    }
    
    if (Object.keys(componentsToLoad).length > 0) {
        componentLoader.loadAll(componentsToLoad).then(() => {
            console.log('All components loaded successfully!');
        });
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}

