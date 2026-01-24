// Responsive Estate Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing estate page');
    
    // Initialize all components
    initComponents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize map
    initMap();
    
    // Initialize calculator
    initCalculator();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Setup property filtering - Use the new bulletproof version
    setTimeout(initFilters, 100);
    
    // Setup modals
    setupModals();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup responsive adjustments
    setupResponsiveAdjustments();
    
    // Setup quick navigation
    initQuickNavigation();
    
    console.log('All components initialized');
});

function initComponents() {
    console.log('Initializing components...');
    
    // Initialize Swiper Gallery only if element exists and Swiper is loaded
    const galleryElement = document.querySelector('.gallery-swiper');
    
    if (galleryElement) {
        console.log('Gallery element found:', galleryElement);
        
        // Check if Swiper is loaded
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library not loaded. Make sure the Swiper JS is included.');
            showGalleryFallback(galleryElement);
            return;
        }
        
        console.log('Swiper library available, initializing gallery...');
        
        try {
            // Initialize Swiper
            const gallerySwiper = new Swiper('.gallery-swiper', {
                loop: true,
                speed: 600,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                keyboard: {
                    enabled: true,
                },
                mousewheel: {
                    forceToAxis: true,
                },
                effect: 'slide',
                grabCursor: true,
                preloadImages: true,
                lazy: {
                    loadPrevNext: true,
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                        pagination: {
                            dynamicBullets: false,
                        }
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    }
                },
                on: {
                    init: function() {
                        console.log('Swiper gallery initialized successfully');
                    }
                }
            });
            
            // Store reference for debugging
            window.gallerySwiper = gallerySwiper;
            
        } catch (error) {
            console.error('Error initializing Swiper:', error);
        }
    } else {
        console.warn('Gallery element not found. Looking for .gallery-swiper');
    }
}

// ===== BULLETPROOF FILTER SOLUTION =====
function initFilters() {
    console.log('Initializing filters...');
    
    // Get elements
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('[data-size]');
    
    // If no elements found, try alternative selectors
    if (!buttons.length) {
        console.log('No data-filter buttons found, trying .filter-btn');
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.setAttribute('data-filter', btn.textContent.toLowerCase().includes('50') ? '50x100' : 
                             btn.textContent.toLowerCase().includes('100') ? '100x100' : 'all');
        });
    }
    
    if (!cards.length) {
        console.log('No data-size cards found, trying .property-card');
        document.querySelectorAll('.property-card').forEach(card => {
            const sizeText = card.querySelector('.badge.size')?.textContent || '';
            if (sizeText.includes('100×100ft')) card.setAttribute('data-size', '100x100');
            else if (sizeText.includes('50×100ft')) card.setAttribute('data-size', '50x100');
        });
    }
    
    // Now get elements again
    const filterButtons = document.querySelectorAll('[data-filter]');
    const propertyCards = document.querySelectorAll('[data-size]');
    
    // Add click events for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove all active classes
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter cards
            propertyCards.forEach(card => {
                const cardSize = card.getAttribute('data-size');
                
                if (filter === 'all' || cardSize === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.visibility = 'visible';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update counter
            const visible = document.querySelectorAll(`[data-size]${filter === 'all' ? '' : `[data-size="${filter}"]`}`).length;
            const counter = document.querySelector('.filter-count');
            if (counter) counter.textContent = `Showing ${visible} properties`;
        });
    });
    
    // Activate first button
    if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
        // Don't trigger click automatically to avoid conflicts
    }
    
    console.log('Filters initialized successfully');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Property filter buttons (already handled by initFilters)
    // Just add active class styling here if needed
    
    // ===== CRITICAL: VIEW DETAILS BUTTONS EVENT LISTENER =====
    // View details buttons - Use event delegation to handle dynamic content
    document.addEventListener('click', function(e) {
        // Check if clicked element is a view-details button or its child
        const viewDetailsBtn = e.target.closest('.btn-view, .view-details');
        
        if (viewDetailsBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const propertyId = viewDetailsBtn.getAttribute('data-property');
            console.log('Property button clicked, ID:', propertyId);
            
            if (propertyId) {
                // Make sure showPropertyModal exists
                if (typeof window.showPropertyModal === 'function') {
                    window.showPropertyModal(propertyId);
                } else {
                    console.error('showPropertyModal is not a function!');
                }
            }
        }
    });
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById('propertyModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
    
    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateROI);
    }
    
    // Appreciation rate slider
    const appreciationRate = document.getElementById('appreciationRate');
    const rateValue = document.getElementById('rateValue');
    if (appreciationRate && rateValue) {
        appreciationRate.addEventListener('input', function() {
            rateValue.textContent = this.value + '%';
        });
    }
    
    // Map controls
    document.querySelector('.zoom-in')?.addEventListener('click', () => {
        if (window.estateMap) window.estateMap.zoomIn();
    });
    
    document.querySelector('.zoom-out')?.addEventListener('click', () => {
        if (window.estateMap) window.estateMap.zoomOut();
    });
    
    document.querySelector('.reset')?.addEventListener('click', () => {
        if (window.estateMap) window.estateMap.setView([6.333, 5.622], 15);
    });
}

function initMap() {
    console.log('Initializing map...');
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.warn('Map element not found');
        return;
    }
    
    if (typeof L === 'undefined') {
        console.warn('Leaflet library not loaded');
        return;
    }
    
    try {
        // Initialize map
        window.estateMap = L.map('map').setView([6.333, 5.622], 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(window.estateMap);
        
        // Estate location marker
        const estateIcon = L.divIcon({
            className: 'custom-marker estate-marker',
            html: '<div><i class="fas fa-home"></i></div>',
            iconSize: [50, 50],
            iconAnchor: [25, 50]
        });
        
        const estateMarker = L.marker([6.333, 5.622], { icon: estateIcon }).addTo(window.estateMap);
        estateMarker.bindPopup(`
            <div class="map-popup">
                <h4>Elora Gardens Estate</h4>
                <p>Premium residential community in Evboeson</p>
                <p><i class="fas fa-map-marker-alt"></i> Evboeson Community, Benin City</p>
            </div>
        `);
        
        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

function initCalculator() {
    console.log('Initializing calculator...');
    
    // Initial calculation
    setTimeout(calculateROI, 100);
    
    // Recalculate on input changes
    document.getElementById('plotSize')?.addEventListener('change', calculateROI);
    document.getElementById('appreciationRate')?.addEventListener('input', calculateROI);
    document.getElementById('investmentPeriod')?.addEventListener('change', calculateROI);
}

function calculateROI() {
    console.log('Calculating ROI...');
    
    const plotSize = document.getElementById('plotSize');
    const appreciationRate = document.getElementById('appreciationRate');
    const investmentPeriod = document.getElementById('investmentPeriod');
    
    if (!plotSize || !appreciationRate || !investmentPeriod) {
        console.warn('Calculator elements not found');
        return;
    }
    
    const initialInvestment = parseInt(plotSize.value);
    const rate = parseInt(appreciationRate.value) / 100;
    const years = parseInt(investmentPeriod.value);
    
    // Compound interest formula
    const futureValue = initialInvestment * Math.pow(1 + rate, years);
    const totalProfit = futureValue - initialInvestment;
    const annualROI = ((Math.pow(futureValue / initialInvestment, 1/years) - 1) * 100).toFixed(1);
    
    // Format currency
    const formatCurrency = (num) => {
        return '₦' + num.toLocaleString('en-NG');
    };
    
    // Update display
    const initialInvestmentEl = document.getElementById('initialInvestment');
    const projectedValueEl = document.getElementById('projectedValue');
    const totalProfitEl = document.getElementById('totalProfit');
    const annualROIEl = document.getElementById('annualROI');
    
    if (initialInvestmentEl) initialInvestmentEl.textContent = formatCurrency(initialInvestment);
    if (projectedValueEl) projectedValueEl.textContent = formatCurrency(Math.round(futureValue));
    if (totalProfitEl) totalProfitEl.textContent = formatCurrency(Math.round(totalProfit));
    if (annualROIEl) annualROIEl.textContent = annualROI + '%';
}

function initStatsCounter() {
    console.log('Initializing stats counter...');
    
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    if (statValues.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => observer.observe(stat));
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.getAttribute('data-count').includes('%') ? '%' : (element.getAttribute('data-count').includes('+') ? '+' : ''));
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }
}

function setupModals() {
    console.log('Setting up modals...');
    
    const propertyDetails = {
        1: {
            title: "Plot 1 - Elora Gardens (100×100ft)",
            price: "₦1,500,000",
            size: "100ft × 100ft (900 SQM)",
            location: "Evboeson Community, Benin City",
            features: [
                "Prime corner plot with excellent road frontage",
                "Ready for immediate construction",
                "All utilities available (water, electricity)",
                "Government approved layout plan",
                "Perfect for duplex or mansion",
                "High appreciation potential - expected 25% annual growth"
            ],
            amenities: [
                "Paved road access",
                "Security perimeter",
                "Drainage system",
                "Surveyed and beaconed"
            ],
            whatsappMessage: "Hi, I'm interested in Plot 1 (100x100ft) at Elora Gardens. Can you provide more details?"
        },
        2: {
            title: "Plot 2 - Elora Gardens (50×100ft)",
            price: "₦800,000",
            size: "50ft × 100ft (450 SQM)",
            location: "Evboeson Community, Benin City",
            features: [
                "Affordable premium plot in prime location",
                "Perfect for family home construction",
                "Easy access to main road",
                "All utilities available",
                "Secure and serene environment",
                "Excellent investment opportunity"
            ],
            amenities: [
                "Paved road access",
                "Security perimeter",
                "Drainage system",
                "Surveyed and beaconed"
            ],
            whatsappMessage: "Hi, I'm interested in Plot 2 (50x100ft) at Elora Gardens. Can you provide more details?"
        },
        3: {
            title: "Plot 3 - Elora Gardens (100×100ft)",
            price: "₦1,500,000",
            size: "100ft × 100ft (900 SQM)",
            location: "Evboeson Community, Benin City",
            features: [
                "Strategic location near estate entrance",
                "Beautiful landscape view",
                "Suitable for luxury duplex",
                "All documentation complete",
                "Best investment value in estate",
                "Ready for immediate development"
            ],
            amenities: [
                "Paved road access",
                "Security perimeter",
                "Drainage system",
                "Surveyed and beaconed"
            ],
            whatsappMessage: "Hi, I'm interested in Plot 3 (100x100ft) at Elora Gardens. Can you provide more details?"
        },
        4: {
            title: "Plot 4 - Elora Gardens (50×100ft)",
            price: "₦800,000",
            size: "50ft × 100ft (450 SQM)",
            location: "Evboeson Community, Benin City",
            features: [
                "Budget-friendly investment opportunity",
                "Close to community amenities",
                "Ideal for starter home",
                "High appreciation potential",
                "Flexible payment plans available",
                "Perfect for young families"
            ],
            amenities: [
                "Paved road access",
                "Security perimeter",
                "Drainage system",
                "Surveyed and beaconed"
            ],
            whatsappMessage: "Hi, I'm interested in Plot 4 (50x100ft) at Elora Gardens. Can you provide more details?"
        }
    };
    
    // Define showPropertyModal as a global function
    window.showPropertyModal = function(propertyId) {
        console.log('Showing property modal for:', propertyId);
        const property = propertyDetails[propertyId];
        const modal = document.getElementById('propertyModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody || !property) {
            console.error('Modal elements or property not found');
            return;
        }
        
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2>${property.title}</h2>
            </div>
            
            <div class="modal-content-grid">
                <div class="modal-image">
                    <img src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                         alt="${property.title}" loading="lazy">
                </div>
                
                <div class="modal-details">
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> Property Details</h3>
                        <div class="detail-row">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value">${property.price}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Size:</span>
                            <span class="detail-value">${property.size}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${property.location}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-star"></i> Key Features</h3>
                        <ul class="feature-list">
                            ${property.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-check-circle"></i> Amenities</h3>
                        <ul class="amenity-list">
                            ${property.amenities.map(amenity => `<li><i class="fas fa-check"></i> ${amenity}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <a href="https://wa.me/2348148227087?text=${encodeURIComponent(property.whatsappMessage)}" 
                   class="btn btn-primary" target="_blank">
                    <i class="fab fa-whatsapp"></i> Inquire Now on WhatsApp
                </a>
                <button class="btn btn-outline close-modal">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add fade-in effect
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Add close event to new close button
        modalBody.querySelector('.close-modal').addEventListener('click', closeModal);
        
        console.log('Modal opened successfully');
    };
}

function closeModal() {
    console.log('Closing modal');
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function setupSmoothScrolling() {
    console.log('Setting up smooth scrolling...');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            // Update active navigation for quick nav items
            if (this.classList.contains('quick-nav-item')) {
                document.querySelectorAll('.quick-nav-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
            
            // Calculate scroll position
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.quick-nav-item');
    
    if (sections.length > 0 && navItems.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }
}

function setupResponsiveAdjustments() {
    console.log('Setting up responsive adjustments...');
    
    // Adjust hero height based on viewport
    function adjustHeroHeight() {
        const hero = document.querySelector('.responsive-hero');
        const viewportHeight = window.innerHeight;
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        if (hero) {
            hero.style.minHeight = `calc(${viewportHeight}px - ${headerHeight}px)`;
        }
    }
    
    // Initialize adjustments
    adjustHeroHeight();
    
    // Re-adjust on resize
    window.addEventListener('resize', adjustHeroHeight);
}

function initQuickNavigation() {
    console.log('Initializing quick navigation...');
    
    const quickNavItems = document.querySelector('.quick-nav-items');
    if (!quickNavItems) return;
    
    // Make quick nav scrollable on mobile
    if (window.innerWidth < 768) {
        quickNavItems.style.overflowX = 'auto';
        quickNavItems.style.overflowY = 'hidden';
        quickNavItems.style.whiteSpace = 'nowrap';
        quickNavItems.style.flexWrap = 'nowrap';
    }
}

// Export functions for global access
window.initComponents = initComponents;
window.showPropertyModal = window.showPropertyModal || function() { console.error('showPropertyModal not available'); };
window.closeModal = closeModal;

// Debug: Test button
setTimeout(() => {
    console.log('Page fully loaded. Modal function available:', typeof window.showPropertyModal);
    
    // Remove any existing test button
    const existingTest = document.querySelector('#modal-test-button');
    if (existingTest) existingTest.remove();
    
    // Add test button
    // const testBtn = document.createElement('button');
    // testBtn.id = 'modal-test-button';
    // testBtn.textContent = 'TEST MODAL';
    // testBtn.style.cssText = `
    //     position: fixed;
    //     top: 70px;
    //     left: 10px;
    //     z-index: 99999;
    //     padding: 10px 20px;
    //     background: red;
    //     color: white;
    //     font-weight: bold;
    //     border: none;
    //     border-radius: 5px;
    //     cursor: pointer;
    //     box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    // `;
    testBtn.onclick = () => {
        console.log('Test button clicked');
        if (typeof window.showPropertyModal === 'function') {
            window.showPropertyModal(1);
        } else {
            alert('showPropertyModal is not available');
        }
    };
    document.body.appendChild(testBtn);
}, 2000);

// darkmode theme
// ===== THEME TOGGLE FUNCTIONALITY =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('.theme-text');
    
    // Check for saved theme or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        enableDarkMode(themeIcon, themeText);
    } else {
        enableLightMode(themeIcon, themeText);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            enableLightMode(themeIcon, themeText);
            localStorage.setItem('theme', 'light');
        } else {
            enableDarkMode(themeIcon, themeText);
            localStorage.setItem('theme', 'dark');
        }
    });
    
    function enableDarkMode(icon, text) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        text.textContent = 'Light Mode';
    }
    
    function enableLightMode(icon, text) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        text.textContent = 'Dark Mode';
    }
}

// Call this in your DOMContentLoaded function
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing estate page');
    
    // Initialize all components
    initComponents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize map
    initMap();
    
    // Initialize calculator
    initCalculator();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Setup property filtering
    setTimeout(initFilters, 100);
    
    // Setup modals
    setupModals();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup responsive adjustments
    setupResponsiveAdjustments();
    
    // Setup quick navigation
    initQuickNavigation();
    
    // Initialize theme toggle - ADD THIS LINE
    initThemeToggle();
    
    console.log('All components initialized');
});
