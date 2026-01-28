// ============================================
// SCROLL ANIMATIONS & LAZY LOADING SYSTEM
// ============================================

class ScrollAnimator {
    constructor() {
        // Configuration
        this.config = {
            animation: {
                threshold: 0.15,
                rootMargin: '0px 0px -80px 0px',
                triggerOnce: true
            },
            images: {
                threshold: 0.01,
                rootMargin: '100px',
                triggerOnce: true
            },
            sections: {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
                triggerOnce: true
            }
        };
        
        // Elements to observe
        this.animationElements = document.querySelectorAll('[data-animation]');
        this.lazyImages = document.querySelectorAll('img.lazy-image');
        this.sections = document.querySelectorAll('.section-animate, .container-animate');
        
        this.init();
    }
    
    init() {
        this.setupAnimationObserver();
        this.setupImageObserver();
        this.setupSectionObserver();
        this.setupProgressBar();
    }
    
    // ============================================
    // 1. ANIMATION OBSERVER
    // ============================================
    setupAnimationObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    this.animateElement(element);
                    
                    if (this.config.animation.triggerOnce) {
                        observer.unobserve(element);
                    }
                }
            });
        }, this.config.animation);
        
        // Observe all animation elements
        this.animationElements.forEach(element => {
            observer.observe(element);
        });
        
        // Observe dynamically added elements
        this.setupMutationObserver(observer);
    }
    
    animateElement(element) {
        const animationType = element.dataset.animation;
        const delay = element.dataset.delay || '0';
        
        // Apply delay
        if (delay !== '0') {
            element.style.animationDelay = `${delay}ms`;
        }
        
        // Apply animation class
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, 10);
        
        // Clean up data attributes after animation
        setTimeout(() => {
            element.removeAttribute('data-animation');
            element.removeAttribute('data-delay');
            element.style.animationDelay = '';
        }, parseInt(delay) + 800);
    }
    
    // ============================================
    // 2. IMAGE LAZY LOADING OBSERVER
    // ============================================
    setupImageObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    
                    if (this.config.images.triggerOnce) {
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, this.config.images);
        
        // Observe all lazy images
        this.lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        // Create promise for loading
        const loadPromise = new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Even if error, resolve to show something
        });
        
        // Load image
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
        
        if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
        }
        
        // Add loaded class
        loadPromise.then(() => {
            img.classList.add('loaded');
        });
    }
    
    // ============================================
    // 3. SECTION OBSERVER
    // ============================================
    setupSectionObserver() {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    
                    // Trigger section animation
                    section.classList.add('visible');
                    
                    // Auto-animate children in staggered containers
                    if (section.classList.contains('container-animate')) {
                        this.staggerChildren(section);
                    }
                    
                    if (this.config.sections.triggerOnce) {
                        sectionObserver.unobserve(section);
                    }
                }
            });
        }, this.config.sections);
        
        // Observe all sections
        this.sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    staggerChildren(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ============================================
    // 4. MUTATION OBSERVER (for dynamic content)
    // ============================================
    setupMutationObserver(animationObserver) {
        if (typeof MutationObserver === 'undefined') return;
        
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check for new animation elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const newElements = node.querySelectorAll ? 
                                node.querySelectorAll('[data-animation]') : 
                                node.hasAttribute('data-animation') ? [node] : [];
                            
                            newElements.forEach(el => {
                                animationObserver.observe(el);
                            });
                            
                            // Check for lazy images
                            const newImages = node.querySelectorAll ? 
                                node.querySelectorAll('img.lazy-image[data-src]') : 
                                (node.tagName === 'IMG' && node.classList.contains('lazy-image') && node.dataset.src) ? 
                                [node] : [];
                            
                            newImages.forEach(img => {
                                this.setupImageObserverForElement(img);
                            });
                        }
                    });
                }
            });
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupImageObserverForElement(img) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, this.config.images);
        
        imageObserver.observe(img);
    }
    
    // ============================================
    // 5. PROGRESS BAR FOR PAGE SCROLL
    // ============================================
    setupProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
}

// ============================================
// 6. FALLBACK FOR OLDER BROWSERS
// ============================================
function fallbackAnimations() {
    // Show all animations immediately
    document.querySelectorAll('[data-animation]').forEach(el => {
        const animationType = el.dataset.animation;
        el.classList.add(`animate-${animationType}`);
        el.style.opacity = '1';
    });
    
    // Load all images immediately
    document.querySelectorAll('img.lazy-image[data-src]').forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('loaded');
    });
    
    // Show all sections
    document.querySelectorAll('.section-animate, .container-animate').forEach(section => {
        section.classList.add('visible');
    });
}

// ============================================
// 7. INITIALIZATION
// ============================================
function initScrollAnimations() {
    // Check for Intersection Observer support
    if ('IntersectionObserver' in window && 
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new ScrollAnimator();
            });
        } else {
            new ScrollAnimator();
        }
    } else {
        // Fallback for older browsers
        console.log('Intersection Observer not supported, using fallback animations');
        fallbackAnimations();
    }
}

// Export for module systems or global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollAnimator, initScrollAnimations };
} else {
    window.initScrollAnimations = initScrollAnimations;
    window.ScrollAnimator = ScrollAnimator;
}

// Auto-initialize
initScrollAnimations();


// Enhanced toggle with better animations
function initEnhancedMobileToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const toggleIndicator = document.querySelector('.toggle-indicator');
    const formContent = document.querySelector('.form-content');
    const formInfo = document.querySelector('.form-info');
    
    if (!toggleButtons.length) return;
    
    // Set initial active state
    let activeTab = 'form';
    
    function switchTab(target) {
        // Prevent switching to same tab
        if (target === activeTab) return;
        
        // Add loading animation to buttons
        toggleButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
        });
        
        // Update UI after a brief delay for animation
        setTimeout(() => {
            // Update button states
            toggleButtons.forEach(btn => {
                if (btn.dataset.target === target) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Move indicator with bounce effect
            if (toggleIndicator) {
                const activeBtn = document.querySelector(`.toggle-btn[data-target="${target}"]`);
                if (activeBtn) {
                    const btnWidth = activeBtn.offsetWidth;
                    const btnLeft = activeBtn.offsetLeft;
                    
                    // Add bounce animation
                    toggleIndicator.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    toggleIndicator.style.transform = `translateX(${btnLeft}px)`;
                    toggleIndicator.style.width = `${btnWidth}px`;
                }
            }
            
            // Handle content switching on mobile
            if (window.innerWidth < 768) {
                // Fade out current content
                if (target === 'form') {
                    formInfo.classList.add('fade-out');
                    setTimeout(() => {
                        formInfo.classList.add('mobile-hidden');
                        formInfo.classList.remove('fade-out');
                        formContent.classList.remove('mobile-hidden');
                        formContent.classList.add('fade-in');
                        setTimeout(() => {
                            formContent.classList.remove('fade-in');
                        }, 300);
                    }, 200);
                } else {
                    formContent.classList.add('fade-out');
                    setTimeout(() => {
                        formContent.classList.add('mobile-hidden');
                        formContent.classList.remove('fade-out');
                        formInfo.classList.remove('mobile-hidden');
                        formInfo.classList.add('fade-in');
                        setTimeout(() => {
                            formInfo.classList.remove('fade-in');
                        }, 300);
                    }, 200);
                }
            }
            
            activeTab = target;
            
            // Re-enable buttons
            toggleButtons.forEach(btn => {
                btn.style.pointerEvents = 'auto';
            });
            
            // Save to sessionStorage
            sessionStorage.setItem('activeContactTab', target);
        }, 100);
    }
    
    // Event listeners
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.target);
        });
    });
    
    // Initialize
    setTimeout(() => {
        const savedTab = sessionStorage.getItem('activeContactTab') || 'form';
        switchTab(savedTab);
    }, 100);
    
    // Handle responsive behavior
    function handleResponsive() {
        if (window.innerWidth >= 768) {
            formContent.classList.remove('mobile-hidden', 'fade-in', 'fade-out');
            formInfo.classList.remove('mobile-hidden', 'fade-in', 'fade-out');
        } else {
            switchTab(activeTab);
        }
    }
    
    window.addEventListener('resize', function() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(handleResponsive, 250);
    });
    
    handleResponsive();
}

// Add fade animations to CSS
const fadeCSS = `
    .fade-in {
        animation: fadeIn 0.3s ease forwards;
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;

// Inject fade animations
const styleSheet = document.createElement('style');
styleSheet.textContent = fadeCSS;
document.head.appendChild(styleSheet);

// Initialize enhanced toggle
document.addEventListener('DOMContentLoaded', initEnhancedMobileToggle);

// Minimal JavaScript for scroll detection (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const shuffleSection = document.querySelector('.shuffle-section');
    const videoSections = document.querySelectorAll('.video-section');
    
    if (!shuffleSection || videoSections.length === 0) return;
    
    let hasScrolled = false;
    
    // Track initial scroll to hide hint
    window.addEventListener('scroll', function() {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            shuffleSection.classList.add('scrolled');
        }
    }, { passive: true });
    
    // Optional: Add active class based on scroll position
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const videoSection = entry.target;
            if (entry.isIntersecting) {
                videoSection.classList.add('active');
                videoSections.forEach(section => {
                    if (section !== videoSection) {
                        section.classList.remove('active');
                        section.classList.add('passing');
                    }
                });
            } else {
                videoSection.classList.remove('active', 'passing');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px' // Adjust based on viewport
    });
    
    // Observe each video section
    videoSections.forEach(section => {
        observer.observe(section);
    });
});