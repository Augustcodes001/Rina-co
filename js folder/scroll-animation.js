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


