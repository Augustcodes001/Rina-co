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
    
    // Setup smooth scrolling (only for anchor links, not gallery)
    setupSmoothScrolling();
    
    // Setup responsive adjustments
    setupResponsiveAdjustments();
    
    // Setup quick navigation
    initQuickNavigation();
    
    // Initialize theme toggle
    if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }
    
    // Initialize property gallery
    initPropertyGallery();
     // === ADD THIS LINE ===
    // Initialize video testimonials
    if (typeof initVideoTestimonials === 'function') {
        initVideoTestimonials();
    }
     if (typeof initTransactionsSlider === 'function') {
        initTransactionsSlider();
    }
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
   
    
    
}
function setupDarkModeMapStyles() {
    const styleId = 'dark-mode-map-styles';
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    
    // Create new style for dark mode
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .dark-theme .leaflet-popup-content-wrapper {
            background-color: #1a1a1a !important;
            color: #f0f0f0 !important;
            border: 1px solid #333 !important;
            box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4) !important;
        }
        
        .dark-theme .leaflet-popup-tip {
            background-color: #1a1a1a !important;
        }
        
        .dark-theme .map-popup {
            color: #f0f0f0 !important;
        }
        
        .dark-theme .map-popup h4 {
            color: #ffd700 !important;
        }
        
        .dark-theme .map-popup hr {
            border-color: #333 !important;
            opacity: 0.3;
        }
        
        .dark-theme .leaflet-container a.leaflet-popup-close-button {
            color: #f0f0f0 !important;
        }
        
        .dark-theme .leaflet-container a.leaflet-popup-close-button:hover {
            color: #ffd700 !important;
        }
        
        /* Also fix map tiles for dark mode */
        .dark-theme .leaflet-tile {
            filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
    `;
    
    document.head.appendChild(style);
}

// ===== MAP VARIABLES (Global scope) =====
let estateMap = null;
let markers = [];
let routes = [];

// ===== MAP FUNCTIONS (Global scope) =====
function initMap() {
    console.log('Initializing map...');
     setupDarkModeMapStyles();
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.warn('Map element not found');
        return;
    }
    
    if (typeof L === 'undefined') {
        console.warn('Leaflet library not loaded');
        showMapError();
        return;
    }
    
    try {
        // Center coordinates for Evboeson Community
        const estateCoords = [6.339879, 5.652190];
        
        // Initialize map
        estateMap = L.map('map', {
            zoomControl: false,          // Disable default zoom control
            attributionControl: false,
            scrollWheelZoom: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            attributionControl: true,
            fadeAnimation: true,
            zoomAnimation: true,
            markerZoomAnimation: true
        }).setView(estateCoords, 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
            maxZoom: 19,
            detectRetina: true
        }).addTo(estateMap);
        
        // ===== CUSTOM ICONS =====
        const icons = {
            estate: L.divIcon({
                className: 'custom-marker estate-marker',
                html: '<div><i class="fas fa-home"></i></div>',
                iconSize: [60, 60],
                iconAnchor: [30, 60],
                popupAnchor: [0, -60]
            }),
            building: L.divIcon({
                className: 'custom-marker building-marker',
                html: '<div><i class="fas fa-building"></i></div>',
                iconSize: [45, 45],
                iconAnchor: [22, 45],
                popupAnchor: [0, -45]
            }),
            school: L.divIcon({
                className: 'custom-marker school-marker',
                html: '<div><i class="fas fa-graduation-cap"></i></div>',
                iconSize: [45, 45],
                iconAnchor: [22, 45],
                popupAnchor: [0, -45]
            }),
            park: L.divIcon({
                className: 'custom-marker park-marker',
                html: '<div><i class="fas fa-umbrella"></i></div>',
                iconSize: [45, 45],
                iconAnchor: [22, 45],
                popupAnchor: [0, -45]
            }),
            market: L.divIcon({
                className: 'custom-marker market-marker',
                html: '<div><i class="fas fa-shopping-cart"></i></div>',
                iconSize: [45, 45],
                iconAnchor: [22, 45],
                popupAnchor: [0, -45]
            })
        };
        
        // ===== CREATE MARKERS =====
        
        // Main Estate Marker
        const estateMarker = L.marker([6.339879, 5.652190], {
            icon: icons.estate,
            title: 'Elora Gardens Estate'
        }).addTo(estateMap);
        
        markers.push(estateMarker);
        
        estateMarker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas fa-home"></i> Elora Gardens Estate</h4>
                <p><strong>Premium Residential Community</strong></p>
                <p><i class="fas fa-map-marker-alt"></i> Evboeson Community</p>
                <p><i class="fas fa-road"></i> Off Egba Road, Benin-Auchi Road</p>
                <p><i class="fas fa-car"></i> 15 minutes from Benin City center</p>
                <hr>
                <small>Premium living with modern amenities</small>
            </div>
        `);
        
        // Macadams Publishers (Southwest)
        const macadamsMarker = L.marker([6.3388, 5.6515], {
            icon: icons.building,
            title: 'Macadams Publishers Limited'
        }).addTo(estateMap);
        
        markers.push(macadamsMarker);
        
        macadamsMarker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas fa-building"></i> Macadams Publishers Limited</h4>
                <p><i class="fas fa-clock"></i> <strong>5 minutes drive</strong></p>
                <p><i class="fas fa-industry"></i> Major Publishing Company</p>
                <p><i class="fas fa-briefcase"></i> Business opportunities nearby</p>
                <hr>
                <small>Established publishing company in Benin</small>
            </div>
        `);
        
        // Shaka Polytechnic (Northeast)
        const shakaMarker = L.marker([6.3415, 5.6545], {
            icon: icons.school,
            title: 'Shaka Polytechnic'
        }).addTo(estateMap);
        
        markers.push(shakaMarker);
        
        shakaMarker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas fa-graduation-cap"></i> Shaka Polytechnic</h4>
                <p><i class="fas fa-clock"></i> <strong>15 minutes drive</strong></p>
                <p><i class="fas fa-road"></i> Accessible via main road</p>
                <p><i class="fas fa-graduation-cap"></i> Technical education institution</p>
                <hr>
                <small>Quality technical education nearby</small>
            </div>
        `);
        
        // Ramat Park (Southeast)
        const ramatMarker = L.marker([6.3380, 5.6555], {
            icon: icons.park,
            title: 'Ramat Park'
        }).addTo(estateMap);
        
        markers.push(ramatMarker);
        
        ramatMarker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas fa-umbrella"></i> Ramat Park</h4>
                <p><i class="fas fa-clock"></i> <strong>35 minutes drive</strong> (traffic)</p>
                <p><i class="fas fa-bus"></i> Main transportation hub</p>
                <p><i class="fas fa-map-signs"></i> Multiple bus routes available</p>
                <hr>
                <small>Best visited during off-peak hours</small>
            </div>
        `);
        
        // Evboesi Market (Northwest)
        const marketMarker = L.marker([6.3408, 5.6510], {
            icon: icons.market,
            title: 'Evboesi Mini-Market'
        }).addTo(estateMap);
        
        markers.push(marketMarker);
        
        marketMarker.bindPopup(`
            <div class="map-popup">
                <h4><i class="fas fa-shopping-cart"></i> Evboesi Mini-Market</h4>
                <p><i class="fas fa-clock"></i> <strong>1 minute drive / 5 min walk</strong></p>
                <p><i class="fas fa-utensils"></i> Fresh produce & daily essentials</p>
                <p><i class="fas fa-walking"></i> Walking distance from estate</p>
                <hr>
                <small>Convenient for daily shopping needs</small>
            </div>
        `);
        
        // ===== CREATE DRIVING ROUTES =====
        
        // To Macadams (Yellow route - 5 min)
        const routeToMacadams = L.polyline([
            [6.339879, 5.652190],
            [6.3392, 5.6518],
            [6.3388, 5.6515]
        ], {
            color: '#f39c12',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            className: 'driving-route'
        }).addTo(estateMap);
        
        routes.push(routeToMacadams);
        
        // To Shaka (Blue route - 15 min)
        const routeToShaka = L.polyline([
            [6.339879, 5.652190],
            [6.3405, 5.6532],
            [6.3415, 5.6545]
        ], {
            color: '#3498db',
            weight: 4,
            opacity: 0.7,
            dashArray: '15, 10',
            className: 'driving-route'
        }).addTo(estateMap);
        
        routes.push(routeToShaka);
        
        // To Ramat (Red route - 35 min)
        const routeToRamat = L.polyline([
            [6.339879, 5.652190],
            [6.3390, 5.6535],
            [6.3380, 5.6555]
        ], {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.7,
            dashArray: '20, 15',
            className: 'driving-route'
        }).addTo(estateMap);
        
        routes.push(routeToRamat);
        
        // To Market (Green route - 1 min)
        const routeToMarket = L.polyline([
            [6.339879, 5.652190],
            [6.3402, 5.6518],
            [6.3408, 5.6510]
        ], {
            color: '#2ecc71',
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 5',
            className: 'driving-route'
        }).addTo(estateMap);
        
        routes.push(routeToMarket);
        
        // ===== SETUP CONTROLS =====
        
        // Add zoom control
        L.control.zoom({
            position: 'topleft'
        }).addTo(estateMap);
        
        // Fit bounds to show all markers
        const bounds = L.latLngBounds([
            [6.3375, 5.6505], // Southwest
            [6.3420, 5.6560]  // Northeast
        ]);
        
        estateMap.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 16
        });
        
        // ===== SETUP MAP CONTROL BUTTONS =====
        
        document.querySelector('.map-control.zoom-in')?.addEventListener('click', zoomInMap);
        document.querySelector('.map-control.zoom-out')?.addEventListener('click', zoomOutMap);
        document.querySelector('.map-control.reset')?.addEventListener('click', resetMapView);
        
        // ===== LEGEND TOGGLE =====
        
        const legendToggle = document.querySelector('.legend-toggle');
        const legendContent = document.querySelector('.legend-content');
        
        if (legendToggle && legendContent) {
            legendToggle.addEventListener('click', () => {
                legendContent.classList.toggle('collapsed');
                const icon = legendToggle.querySelector('i');
                if (legendContent.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-down';
                    legendToggle.setAttribute('aria-label', 'Expand legend');
                } else {
                    icon.className = 'fas fa-chevron-up';
                    legendToggle.setAttribute('aria-label', 'Collapse legend');
                }
            });
        }
        
        // ===== AMENITY ITEM CLICK =====
        
        document.querySelectorAll('.amenity-item').forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('h4').textContent;
                let marker = null;
                
                // Find corresponding marker
                if (title.includes('Macadams')) marker = macadamsMarker;
                else if (title.includes('Shaka')) marker = shakaMarker;
                else if (title.includes('Ramat')) marker = ramatMarker;
                else if (title.includes('Market')) marker = marketMarker;
                
                if (marker) {
                    // Fly to marker
                    estateMap.flyTo(marker.getLatLng(), 16, {
                        duration: 1,
                        easeLinearity: 0.25
                    });
                    
                    // Open popup after animation
                    setTimeout(() => {
                        marker.openPopup();
                    }, 1000);
                    
                    // Highlight the clicked amenity
                    document.querySelectorAll('.amenity-item').forEach(i => {
                        i.style.borderLeft = '';
                    });
                    this.style.borderLeft = '4px solid var(--secondary-color)';
                }
            });
        });
        
        // Auto-open estate popup on load
        setTimeout(() => {
            estateMarker.openPopup();
        }, 1500);
        
        console.log('Map initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showMapError();
    }
}

// ===== MAP CONTROL FUNCTIONS =====
function zoomInMap() {
    if (estateMap) {
        estateMap.zoomIn();
    }
}

function zoomOutMap() {
    if (estateMap) {
        estateMap.zoomOut();
    }
}

function resetMapView() {
    if (estateMap) {
        estateMap.flyTo([6.339879, 5.652190], 15, {
            duration: 1,
            easeLinearity: 0.25
        });
        
        // Close all popups
        markers.forEach(marker => {
            marker.closePopup();
        });
        
        // Highlight estate marker
        setTimeout(() => {
            markers[0].openPopup();
        }, 1000);
    }
}

// ===== ERROR HANDLING =====
function showMapError() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    mapElement.innerHTML = `
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-light);
            color: var(--text-primary);
            text-align: center;
            padding: 20px;
            border-radius: var(--radius-lg);
            z-index: 1000;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: rgba(223, 180, 41, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                font-size: 2rem;
                color: var(--secondary-color);
            ">
                <i class="fas fa-map"></i>
            </div>
            <h3 style="color: var(--primary-color); margin-bottom: 10px;">
                Map Unavailable
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                We're unable to load the map at the moment. 
                Please check your internet connection and try again.
            </p>
            <button onclick="initMap()" style="
                background: var(--secondary-color);
                color: var(--primary-color);
                border: none;
                padding: 12px 24px;
                border-radius: var(--radius-lg);
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all var(--transition-normal);
            " onmouseover="this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.transform='translateY(0)'">
                <i class="fas fa-redo"></i>
                Retry Loading Map
            </button>
        </div>
    `;
}

// ===== RESPONSIVE MAP RESIZE =====
function handleMapResize() {
    if (estateMap) {
        setTimeout(() => {
            estateMap.invalidateSize();
        }, 300);
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


// ===== PROPERTY GALLERY - BUTTON-ONLY NAVIGATION =====
function initPropertyGallery() {
    const galleryContainer = document.querySelector('.fps-container');
    if (!galleryContainer) return;
    
    const pages = document.querySelectorAll('.fps-page');
    const totalPages = pages.length;
    let currentPage = 1;
    let isScrolling = false;
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'gallery-progress';
    const progressFill = document.createElement('div');
    progressFill.className = 'gallery-progress-fill';
    progressContainer.appendChild(progressFill);
    galleryContainer.appendChild(progressContainer);
    
    // Create page indicator
    const pageIndicator = document.createElement('div');
    pageIndicator.className = 'current-page-indicator';
    galleryContainer.appendChild(pageIndicator);
    
    // Initialize first page
    updateGalleryState();
    
    function updateGalleryState() {
        // Update page classes
        pages.forEach((page, index) => {
            page.classList.remove('active', 'previous', 'small');
            
            if (index + 1 === currentPage) {
                page.classList.add('active');
            } else if (index + 1 === currentPage - 1) {
                page.classList.add('previous');
            } else if (index + 1 < currentPage - 1) {
                page.classList.add('small');
            }
        });
        
        // Update navigation dots
        document.querySelectorAll('.fps-nav-btn').forEach((btn, index) => {
            btn.classList.remove('active');
            if (index + 1 === currentPage) {
                btn.classList.add('active');
            }
        });
        
        // Update progress bar
        const progress = ((currentPage - 1) / (totalPages - 1)) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update page indicator
        pageIndicator.textContent = `Property ${currentPage} of ${totalPages}`;
    }
    
    function navigateToPage(pageNumber) {
        if (isScrolling || pageNumber < 1 || pageNumber > totalPages) return;
        
        isScrolling = true;
        currentPage = pageNumber;
        
        // Add visual feedback
        galleryContainer.classList.add('changing');
        
        // Update visual state
        updateGalleryState();
        
        // Allow next change after animation completes
        setTimeout(() => {
            isScrolling = false;
            galleryContainer.classList.remove('changing');
        }, 800); // Match CSS transition duration
    }
    
    function navigateUp() {
        if (currentPage > 1) {
            navigateToPage(currentPage - 1);
        }
    }
    
    function navigateDown() {
        if (currentPage < totalPages) {
            navigateToPage(currentPage + 1);
        }
    }
    
    // ===== NAVIGATION DOTS =====
    document.querySelectorAll('.fps-nav-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (isScrolling || currentPage === index + 1) return;
            navigateToPage(index + 1);
        });
    });
    
    // ===== SCROLL BUTTONS =====
    const scrollButtons = document.querySelectorAll('.fps-scroll-btn');
    if (scrollButtons.length > 0) {
        scrollButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (isScrolling) return;
                if (this.classList.contains('up')) {
                    navigateUp();
                } else {
                    navigateDown();
                }
            });
        });
    }
    
    // ===== VIEW DETAILS BUTTONS =====
    document.querySelectorAll('.view-gallery-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyType = this.getAttribute('data-property');
            const message = `Hi, I'm interested in the ${propertyType} property (Property ${currentPage}). Can you send me more details?`;
            window.open(`https://wa.me/2348148227087?text=${encodeURIComponent(message)}`, '_blank');
        });
    });
    
    // ===== ADD CSS FOR CHANGING STATE =====
    const style = document.createElement('style');
    style.textContent = `
        .fps-container.changing {
            pointer-events: none;
        }
        
        .fps-container.changing .fps-scroll-btn,
        .fps-container.changing .fps-nav-btn {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* Button hover effects */
        .fps-scroll-btn {
            transition: all 0.3s ease;
        }
        
        .fps-scroll-btn:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-lg);
        }
        
        .fps-nav-btn {
            transition: all 0.3s ease;
        }
        
        .fps-nav-btn:hover {
            transform: scale(1.3);
            background: var(--secondary-color);
        }
        
        /* Remove any scroll hint animations */
        .fps-container::after {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // ===== ADD VISUAL FEEDBACK FOR BUTTON PRESSES =====
    document.querySelectorAll('.fps-scroll-btn, .fps-nav-btn').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.classList.add('pressed');
        });
        
        btn.addEventListener('mouseup', function() {
            this.classList.remove('pressed');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('pressed');
        });
        
        // For touch devices
        btn.addEventListener('touchstart', function() {
            this.classList.add('pressed');
        }, { passive: true });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('pressed');
        }, { passive: true });
    });
}

// Call this function in your DOMContentLoaded


// Also update the setupSmoothScrolling function to prevent conflict with gallery:
function setupSmoothScrolling() {
    console.log('Setting up smooth scrolling...');
    
    // Smooth scroll for anchor links - exclude gallery buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Don't intercept clicks on gallery buttons
            if (this.closest('.fps-container') || 
                this.classList.contains('fps-nav-btn') || 
                this.classList.contains('fps-scroll-btn')) {
                return;
            }
            
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
}
// ===== TRANSACTIONS SLIDESHOW =====
function initTransactionsSlider() {
    const slider = document.querySelector('.transactions-slider');
    if (!slider) return;
    
    const pages = document.querySelectorAll('.transaction-page');
    const totalPages = pages.length;
    let currentPage = 1;
    let isScrolling = false;
    let autoPlayInterval;
    let progressInterval;
    
    // Initialize indicators
    const currentIndicator = document.querySelector('.current-transaction');
    const totalIndicator = document.querySelector('.total-transactions');
    
    if (totalIndicator) {
        totalIndicator.textContent = totalPages;
    }
    
    // Update slider state
    function updateSliderState() {
        // Update page classes
        pages.forEach((page, index) => {
            page.classList.remove('active', 'previous', 'small');
            
            if (index + 1 === currentPage) {
                page.classList.add('active');
            } else if (index + 1 === currentPage - 1) {
                page.classList.add('previous');
            } else if (index + 1 < currentPage - 1) {
                page.classList.add('small');
            }
        });
        
        // Update navigation dots
        document.querySelectorAll('.transactions-nav-btn').forEach((btn, index) => {
            btn.classList.remove('active');
            if (index + 1 === currentPage) {
                btn.classList.add('active');
            }
        });
        
        // Update current page indicator
        if (currentIndicator) {
            currentIndicator.textContent = currentPage;
        }
    }
    
    // Navigate to specific page
    function navigateToPage(pageNumber) {
        if (isScrolling || pageNumber < 1 || pageNumber > totalPages) return;
        
        isScrolling = true;
        currentPage = pageNumber;
        
        // Reset progress bar
        resetProgressBar();
        
        // Update visual state
        updateSliderState();
        
        // Reset auto-play interval
        resetAutoPlay();
        
        // Allow next change after animation completes
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
    
    // Navigate to previous page
    function navigateLeft() {
        if (currentPage > 1) {
            navigateToPage(currentPage - 1);
        } else {
            // Loop to last page
            navigateToPage(totalPages);
        }
    }
    
    // Navigate to next page
    function navigateRight() {
        if (currentPage < totalPages) {
            navigateToPage(currentPage + 1);
        } else {
            // Loop to first page
            navigateToPage(1);
        }
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        // Clear existing interval
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        
        // Start progress bar animation
        startProgressBar();
        
        // Set interval for auto-play (5 seconds)
        autoPlayInterval = setInterval(() => {
            navigateRight();
        }, 5000);
    }
    
    function resetAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Progress bar functionality
    function startProgressBar() {
        const progressFill = document.querySelector('.transactions-progress-fill');
        if (!progressFill) return;
        
        // Clear existing progress interval
        if (progressInterval) clearInterval(progressInterval);
        
        // Reset progress bar
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        
        // Force reflow
        void progressFill.offsetWidth;
        
        // Animate progress bar
        progressFill.style.transition = 'width 5s linear';
        progressFill.style.width = '100%';
    }
    
    function resetProgressBar() {
        const progressFill = document.querySelector('.transactions-progress-fill');
        if (progressFill) {
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.transition = 'width 5s linear';
                progressFill.style.width = '100%';
            }, 10);
        }
    }
    
    // Navigation dots event listeners
    document.querySelectorAll('.transactions-nav-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (isScrolling || currentPage === index + 1) return;
            navigateToPage(index + 1);
        });
    });
    
    // Scroll buttons event listeners
    document.querySelectorAll('.transactions-scroll-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (isScrolling) return;
            if (this.classList.contains('left')) {
                navigateLeft();
            } else {
                navigateRight();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.transactions-slider') || document.activeElement.tagName === 'BODY') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateLeft();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateRight();
            }
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        
        // Minimum swipe distance
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                // Swipe left - go right
                navigateRight();
            } else {
                // Swipe right - go left
                navigateLeft();
            }
        }
    }, { passive: true });
    
    // Pause auto-play on hover
    slider.addEventListener('mouseenter', function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        
        // Pause progress bar
        const progressFill = document.querySelector('.transactions-progress-fill');
        if (progressFill) {
            progressFill.style.animationPlayState = 'paused';
            progressFill.style.transition = 'none';
        }
    });
    
    slider.addEventListener('mouseleave', function() {
        startAutoPlay();
    });
    
    // Initialize
    updateSliderState();
    startAutoPlay();
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        } else {
            startAutoPlay();
        }
    });
    
    console.log('✅ Transactions slider initialized with auto-play');
}
// testimonials
// ===== VIDEO TESTIMONIALS FUNCTIONALITY =====
function initVideoTestimonials() {
    console.log('🎬 Initializing video testimonials...');
    
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const youtubeEmbed = document.getElementById('youtubeEmbed');
    const playButton = document.getElementById('playButton');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    const currentTestimonialSpan = document.querySelector('.current-testimonial');
    const totalTestimonialsSpan = document.querySelector('.total-testimonials');
    
    // Check if required elements exist
    if (!videoPlaceholder || !youtubeEmbed) {
        console.warn('Video testimonial elements not found');
        return;
    }
    
    // Testimonial data
    const testimonials = [
        {
            id: 1,
            name: "James Wilson",
            title: "Property Investor",
            rating: 4.8,
            quote: "Working with Rina & Co. was an exceptional experience. The transparency throughout the land purchase process at Elora Gardens was remarkable. All documents were readily available and verified. Highly recommended!",
            date: "January 2024",
            plot: "100×100ft",
            youtubeId: "dQw4w9WgXcQ",
            thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            title: "First-time Home Buyer",
            rating: 5.0,
            quote: "As a first-time buyer, I was nervous about the process. Rina & Co. guided me through every step. The document verification gave me complete peace of mind. Truly professional service!",
            date: "March 2024",
            plot: "50×100ft",
            youtubeId: "L_jWHffIx5E",
            thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 3,
            name: "Michael Chen",
            title: "Real Estate Developer",
            rating: 4.9,
            quote: "I've purchased multiple plots through Rina & Co. Their attention to detail and commitment to transparency is unmatched. The C of O and other documents were flawless.",
            date: "December 2023",
            plot: "Multiple Plots",
            youtubeId: "9bZkp7q19f0",
            thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 4,
            name: "Amina Balogun",
            title: "Family Investor",
            rating: 4.7,
            quote: "Purchasing land for our family home was made easy by Rina & Co. The deed of transfer process was smooth, and they answered all our questions promptly. Excellent service!",
            date: "February 2024",
            plot: "100×100ft",
            youtubeId: "CduA0TULnow",
            thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            id: 5,
            name: "David Okafor",
            title: "Business Owner",
            rating: 4.8,
            quote: "The root title verification gave me confidence in my investment. Rina & Co.'s professionalism and transparency are why I recommend them to all my business partners.",
            date: "November 2023",
            plot: "Commercial Plot",
            youtubeId: "JGwWNGJdvx8",
            thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        }
    ];
    
    let currentTestimonial = 1;
    let isPlaying = false;
    let videoInterval;
    
    // Update total testimonials count
    if (totalTestimonialsSpan) {
        totalTestimonialsSpan.textContent = testimonials.length;
    }
    
    // Load testimonial data
    function loadTestimonial(testimonialId) {
        const testimonial = testimonials.find(t => t.id === testimonialId);
        if (!testimonial) return;
        
        // Clear any existing interval
        if (videoInterval) {
            clearInterval(videoInterval);
            videoInterval = null;
        }
        
        // Update UI elements if they exist
        const clientName = document.querySelector('.client-details h4');
        const clientTitle = document.querySelector('.client-title');
        const testimonialQuote = document.querySelector('.testimonial-quote p');
        const dateMeta = document.querySelector('.meta-item:nth-child(1) span');
        const plotMeta = document.querySelector('.meta-item:nth-child(2) span');
        const avatarImg = document.querySelector('.client-avatar img');
        const thumbnailImg = document.querySelector('.video-thumbnail');
        const videoTitle = document.querySelector('.video-title');
        
        if (clientName) clientName.textContent = testimonial.name;
        if (clientTitle) clientTitle.textContent = testimonial.title;
        if (testimonialQuote) testimonialQuote.textContent = testimonial.quote;
        if (dateMeta) dateMeta.textContent = `Purchased: ${testimonial.date}`;
        if (plotMeta) plotMeta.textContent = `Plot: ${testimonial.plot}`;
        if (avatarImg) avatarImg.src = testimonial.avatar;
        if (thumbnailImg) thumbnailImg.src = testimonial.thumbnail;
        if (videoTitle) videoTitle.textContent = `Client Testimonial - ${testimonial.name}`;
        
        // Update rating stars
        updateRatingStars(testimonial.rating);
        
        // Update YouTube embed
        const iframe = youtubeEmbed.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${testimonial.youtubeId}?autoplay=0&rel=0&modestbranding=1`;
        }
        
        // Update current testimonial indicator
        if (currentTestimonialSpan) {
            currentTestimonialSpan.textContent = testimonialId;
        }
        
        // Update active thumbnail
        thumbnailItems.forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.testimonial) === testimonialId) {
                item.classList.add('active');
            }
        });
        
        // Reset video state
        resetVideo();
    }
    
    // Update rating stars
    function updateRatingStars(rating) {
        const starsContainer = document.querySelector('.client-rating');
        if (!starsContainer) return;
        
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        starsHTML += `<span>${rating}/5</span>`;
        starsContainer.innerHTML = starsHTML;
    }
    
    // Play video
    function playVideo() {
        if (videoPlaceholder) videoPlaceholder.style.display = 'none';
        if (youtubeEmbed) youtubeEmbed.style.display = 'block';
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Simulate playing state for demo
        simulateVideoPlayback();
    }
    
    // Pause video
    function pauseVideo() {
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Clear simulation interval
        if (videoInterval) {
            clearInterval(videoInterval);
            videoInterval = null;
        }
    }
    
    // Reset video to initial state
    function resetVideo() {
        if (videoPlaceholder) videoPlaceholder.style.display = 'block';
        if (youtubeEmbed) youtubeEmbed.style.display = 'none';
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Reset time display
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        if (currentTimeSpan) currentTimeSpan.textContent = '0:00';
        if (durationSpan) durationSpan.textContent = '3:45';
        
        // Clear interval
        if (videoInterval) {
            clearInterval(videoInterval);
            videoInterval = null;
        }
    }
    
    // Simulate video playback (for demo purposes)
    function simulateVideoPlayback() {
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        
        if (!currentTimeSpan || !durationSpan) return;
        
        // Set random duration between 2-5 minutes
        const totalSeconds = Math.floor(Math.random() * 180) + 120;
        const durationMinutes = Math.floor(totalSeconds / 60);
        const durationSeconds = totalSeconds % 60;
        
        durationSpan.textContent = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        
        if (isPlaying) {
            let currentSeconds = 0;
            
            // Clear any existing interval
            if (videoInterval) clearInterval(videoInterval);
            
            videoInterval = setInterval(() => {
                if (!isPlaying) {
                    clearInterval(videoInterval);
                    return;
                }
                
                currentSeconds++;
                if (currentSeconds > totalSeconds) {
                    clearInterval(videoInterval);
                    resetVideo();
                    return;
                }
                
                const minutes = Math.floor(currentSeconds / 60);
                const seconds = currentSeconds % 60;
                currentTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }
    
    // Event Listeners
    if (playButton) {
        playButton.addEventListener('click', playVideo);
    }
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', playVideo);
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseVideo();
            } else {
                playVideo();
            }
        });
    }
    
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (!icon) return;
            
            if (icon.classList.contains('fa-volume-up')) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                if (volumeSlider) volumeSlider.value = 0;
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                if (volumeSlider) volumeSlider.value = 80;
            }
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value;
            const icon = muteBtn ? muteBtn.querySelector('i') : null;
            
            if (icon) {
                if (volume == 0) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                }
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTestimonial = currentTestimonial > 1 ? currentTestimonial - 1 : testimonials.length;
            loadTestimonial(currentTestimonial);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTestimonial = currentTestimonial < testimonials.length ? currentTestimonial + 1 : 1;
            loadTestimonial(currentTestimonial);
        });
    }
    
    // Thumbnail click events
    thumbnailItems.forEach(item => {
        item.addEventListener('click', function() {
            const testimonialId = parseInt(this.dataset.testimonial);
            currentTestimonial = testimonialId;
            loadTestimonial(testimonialId);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.video-player-container') || document.activeElement.tagName === 'BODY') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentTestimonial = currentTestimonial > 1 ? currentTestimonial - 1 : testimonials.length;
                loadTestimonial(currentTestimonial);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentTestimonial = currentTestimonial < testimonials.length ? currentTestimonial + 1 : 1;
                loadTestimonial(currentTestimonial);
            } else if (e.key === ' ') {
                e.preventDefault();
                if (isPlaying) {
                    pauseVideo();
                } else {
                    playVideo();
                }
            }
        }
    });
    
    // Initialize first testimonial
    loadTestimonial(currentTestimonial);
    
    console.log('✅ Video testimonials initialized');
}