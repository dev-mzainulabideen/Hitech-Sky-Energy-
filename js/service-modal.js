/**
 * Service Modal Handler
 * Handles opening and populating service detail modals
 */

document.addEventListener('DOMContentLoaded', function() {
    const serviceModal = new bootstrap.Modal(document.getElementById('serviceModal') || document.getElementById('serviceDetailModal'));
    const serviceCards = document.querySelectorAll('.service-card-clickable');
    const serviceInfoButtons = document.querySelectorAll('.service-info-btn');

    // Service data mapping
    const serviceData = {
        'panel-maintenance': {
            title: 'Panel Maintenance',
            type: 'Maintenance Service',
            icon: 'bi-tools',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
            description: 'Solar panel maintenance is essential for optimal performance and longevity. Clean panels every few months with a gentle detergent solution, inspect for damage, and trim nearby vegetation. Regular maintenance ensures maximum energy efficiency and extends the lifespan of your solar investment.',
            features: [
                'Remove dust and debris every few months',
                'Check for cracks, loose connections, and wear',
                'Trim nearby vegetation for optimal sunlight exposure',
                'Professional inspection and cleaning services',
                'Performance monitoring and optimization'
            ],
            process: [
                'Initial consultation and site assessment',
                'System design and customization for your specific needs',
                'Professional installation by certified technicians',
                'Regular maintenance scheduling and monitoring',
                'Ongoing support and performance optimization'
            ]
        },
        'solar-pv': {
            title: 'Solar PV System',
            type: 'Photovoltaic System',
            icon: 'bi-sun-fill',
            image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
            description: 'Our Solar PV Systems offer cutting-edge photovoltaic technology, providing you with a reliable and sustainable energy solution. Harness the power of the sun to generate clean electricity and contribute to a greener tomorrow. Our customized PV systems are designed to suit your specific energy needs and location, maximizing efficiency and cost-effectiveness.',
            features: [
                'Efficient Solar Panels: High-quality panels with advanced technology',
                'Customized Design: Tailor-made system optimizing energy production',
                'Smart Inverter Technology: Maximum energy conversion efficiency',
                'Battery Storage Options: Store excess energy for later use',
                'Monitoring System: Real-time performance tracking'
            ],
            process: [
                'Initial consultation and site assessment',
                'System design and customization for your specific needs',
                'Professional installation by certified technicians',
                'System testing and commissioning',
                'Ongoing monitoring and maintenance support'
            ]
        },
        'solar-energy': {
            title: 'Solar Energy',
            type: 'Renewable Energy',
            icon: 'bi-sunrise',
            image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            description: 'Solar energy, derived from sunlight via photovoltaic panels and solar thermal systems, is a renewable, eco-friendly power source. It reduces emissions, cuts electricity costs, and fosters energy independence. Advancing technology makes solar panels more efficient and accessible, driving sustainability and environmental responsibility.',
            features: [
                'Renewable and Sustainable: Clean energy from the sun',
                'Cost-Effective: Significant reduction in electricity bills',
                'Environmentally Friendly: Zero emissions and carbon footprint reduction',
                'Energy Independence: Reduce reliance on grid electricity',
                'Long-Term Investment: 25+ years of reliable energy production'
            ],
            process: [
                'Initial consultation and site assessment',
                'System design and customization for your specific needs',
                'Professional installation by certified technicians',
                'Grid connection and system activation',
                'Ongoing support and maintenance services'
            ]
        },
        'hybrid-energy': {
            title: 'Hybrid Energy System',
            type: 'Integrated System',
            icon: 'bi-lightning-charge-fill',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            description: 'Hybrid energy systems blend diverse sources like solar, wind, and batteries, maximizing efficiency and reliability. They cut emissions, adapt to changing conditions, and offer versatile, sustainable energy solutions for a greener future. Perfect for locations with varying energy needs and weather conditions.',
            features: [
                'Multiple Energy Integration: Combine solar, wind, and storage',
                'Efficiency & Sustainability: Boost efficiency and reduce emissions',
                'Smart Energy Management: Automatic switching between sources',
                'Battery Backup: Uninterrupted power supply during outages',
                'Scalable Design: Expandable system to meet growing needs'
            ],
            process: [
                'Initial consultation and site assessment',
                'System design and customization for your specific needs',
                'Multi-source integration planning',
                'Professional installation by certified technicians',
                'System optimization and ongoing support'
            ]
        }
    };

    /**
     * Populate modal with service data
     */
    function populateModal(serviceId) {
        const data = serviceData[serviceId];
        if (!data) return;

        // Get modal elements
        const modal = document.getElementById('serviceDetailModal');
        const titleEl = document.getElementById('serviceDetailModalLabel');
        const typeEl = document.getElementById('serviceModalType');
        const iconEl = document.getElementById('serviceModalIcon');
        const imageEl = document.getElementById('serviceModalImage');
        const descriptionEl = document.getElementById('serviceModalDescription');
        const featuresEl = document.getElementById('serviceModalFeatures');
        const processEl = document.getElementById('serviceModalProcess');

        // Populate modal
        if (titleEl) titleEl.textContent = data.title;
        if (typeEl) typeEl.innerHTML = `<i class="bi ${getServiceIcon(data.type)} me-1"></i>${data.type}`;
        if (iconEl) {
            iconEl.className = `bi ${data.icon}`;
        }
        if (imageEl) {
            imageEl.src = data.image;
            imageEl.alt = data.title;
        }
        if (descriptionEl) descriptionEl.textContent = data.description;
        
        // Populate features
        if (featuresEl) {
            featuresEl.innerHTML = '';
            data.features.forEach(feature => {
                const li = document.createElement('li');
                li.className = 'mb-2 d-flex align-items-start';
                li.innerHTML = `
                    <i class="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                    <span>${feature}</span>
                `;
                featuresEl.appendChild(li);
            });
        }

        // Populate process
        if (processEl) {
            processEl.innerHTML = '';
            data.process.forEach((step, index) => {
                const li = document.createElement('li');
                li.className = 'mb-2 d-flex align-items-start';
                li.innerHTML = `
                    <span class="badge bg-primary rounded-pill me-2">${index + 1}</span>
                    <span>${step}</span>
                `;
                processEl.appendChild(li);
            });
        }
    }

    /**
     * Get service icon based on type
     */
    function getServiceIcon(type) {
        const iconMap = {
            'Maintenance Service': 'bi-wrench-adjustable',
            'Photovoltaic System': 'bi-lightning-charge-fill',
            'Renewable Energy': 'bi-recycle',
            'Integrated System': 'bi-diagram-3'
        };
        return iconMap[type] || 'bi-gear';
    }

    /**
     * Open modal with service data
     */
    function openServiceModal(serviceId) {
        populateModal(serviceId);
        const modalElement = document.getElementById('serviceDetailModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.show();
        }
    }

    // Add click handlers to service cards
    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on buttons or links
            if (e.target.closest('a, button')) {
                return;
            }
            
            const serviceId = this.getAttribute('data-service');
            if (serviceId) {
                openServiceModal(serviceId);
            }
        });
    });

    // Add click handlers to info buttons
    serviceInfoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const serviceId = this.getAttribute('data-service');
            if (serviceId) {
                openServiceModal(serviceId);
            }
        });
    });

    // Add click handler to "Here to know about this service" button
    const serviceViewButtons = document.querySelectorAll('.service-view-btn');
    serviceViewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.service-card-clickable');
            if (card) {
                const serviceId = card.getAttribute('data-service');
                if (serviceId) {
                    openServiceModal(serviceId);
                }
            }
        });
    });
});

