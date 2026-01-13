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

class ScrollShuffleEffect {
  constructor() {
    this.sections = document.querySelectorAll('.video-section');
    this.container = document.querySelector('.shuffle-section');
    this.currentIndex = 0;
    this.isAnimating = false;
    this.animationDelay = 800;
    this.scrollThreshold = 200; // pixels scrolled to trigger change
    this.lastScrollTop = 0;
    this.scrollTimeout = null;
    
    this.init();
  }
  
  init() {
    // Initialize with first section active
    this.updateSectionStates();
    
    // Setup progress bar
    this.setupProgressBar();
    
    // Setup event listeners
    this.setupEventListeners();
    this.setupVideoModal();
    
    // Setup scroll listener
    this.setupScrollListener();
  }
  
  setupProgressBar() {
    // Remove any existing progress bar
    const existingProgress = this.container.querySelector('.shuffle-progress');
    if (existingProgress) {
      existingProgress.remove();
    }
    
    // Create new progress bar
    const progressHtml = `
      <div class="shuffle-progress">
        <div class="progress-bar"></div>
        <div class="progress-steps">
          ${Array.from(this.sections).map((_, index) => 
            `<span class="step ${index === 0 ? 'active' : ''}" data-step="${index}">0${index + 1}</span>`
          ).join('')}
        </div>
      </div>
    `;
    
    this.container.insertAdjacentHTML('beforeend', progressHtml);
    
    this.progressBar = this.container.querySelector('.progress-bar');
    this.steps = this.container.querySelectorAll('.step');
    
    // Add click event to steps
    this.steps.forEach(step => {
      step.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.step);
        this.goToSection(index);
      });
    });
    
    // Update progress bar width
    this.updateProgressBar();
  }
  
  setupEventListeners() {
    // Play buttons
    document.querySelectorAll('.play-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const section = btn.closest('.video-section');
        const videoId = section.dataset.videoId;
        this.openVideoModal(videoId);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.nextSection();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.previousSection();
      }
    });
    
    // Touch events
    this.setupTouchEvents();
  }
  
  setupTouchEvents() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          this.nextSection();
        } else {
          this.previousSection();
        }
      }
    }, { passive: true });
  }
  
  setupScrollListener() {
    // Debounced scroll handler
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = this.container.offsetTop;
      const containerBottom = containerTop + this.container.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Check if we're in the shuffle section
      if (currentScrollTop + viewportHeight < containerTop || currentScrollTop > containerBottom) {
        return; // Not in shuffle section
      }
      
      // Calculate which section should be active
      const scrollWithinContainer = currentScrollTop - containerTop;
      const sectionHeight = this.container.offsetHeight / this.sections.length;
      let targetIndex = Math.floor(scrollWithinContainer / sectionHeight);
      
      // Clamp the index
      targetIndex = Math.max(0, Math.min(targetIndex, this.sections.length - 1));
      
      // Only change if different from current
      if (targetIndex !== this.currentIndex && !this.isAnimating) {
        this.goToSection(targetIndex);
      }
    };
    
    // Use requestAnimationFrame for smooth scrolling
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  
  updateSectionStates() {
    this.sections.forEach((section, index) => {
      section.classList.remove('active', 'previous', 'next');
      
      if (index === this.currentIndex) {
        section.classList.add('active');
      } else if (index === this.currentIndex - 1) {
        section.classList.add('previous');
      } else if (index === this.currentIndex + 1) {
        section.classList.add('next');
      }
    });
    
    this.updateProgressBar();
  }
  
  updateProgressBar() {
    const progressPercentage = ((this.currentIndex + 1) / this.sections.length) * 100;
    
    // Update progress bar width
    if (this.progressBar) {
      this.progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Update steps
    if (this.steps) {
      this.steps.forEach((step, index) => {
        step.classList.toggle('active', index === this.currentIndex);
      });
    }
  }
  
  goToSection(index) {
    if (this.isAnimating || 
        index < 0 || 
        index >= this.sections.length || 
        index === this.currentIndex) {
      return;
    }
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    // Update section states
    this.updateSectionStates();
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDelay);
  }
  
  nextSection() {
    const nextIndex = (this.currentIndex + 1) % this.sections.length;
    this.goToSection(nextIndex);
  }
  
  previousSection() {
    const prevIndex = (this.currentIndex - 1 + this.sections.length) % this.sections.length;
    this.goToSection(prevIndex);
  }
  
  setupVideoModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('videoModal')) {
      const modalHtml = `
        <div class="video-modal" id="videoModal">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="video-wrapper">
              <video id="modalVideo" controls>
                <source src="" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="video-info">
              <h3 id="videoTitle"></h3>
              <p id="videoDescription"></p>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    // Setup modal
    this.modal = document.getElementById('videoModal');
    this.modalVideo = document.getElementById('modalVideo');
    this.videoTitle = document.getElementById('videoTitle');
    this.videoDescription = document.getElementById('videoDescription');
    
    // Close modal handlers
    const closeModal = () => {
      this.modal.classList.remove('active');
      this.modalVideo.pause();
      this.modalVideo.currentTime = 0;
    };
    
    this.modal.querySelector('.modal-close').addEventListener('click', closeModal);
    this.modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  openVideoModal(videoId) {
    // Sample video data - replace with your actual video URLs
    const videoData = {
      video1: {
        src: 'https://example.com/video1.mp4',
        title: 'The Journey So Far',
        description: 'Experience our transformative journey in motion.'
      },
      video2: {
        src: 'https://example.com/video2.mp4',
        title: 'Project Development',
        description: 'Witness the evolution of our projects.'
      },
      video3: {
        src: 'https://example.com/video3.mp4',
        title: 'Final Results',
        description: 'Discover the finished projects.'
      }
    };
    
    const data = videoData[videoId];
    if (data) {
      this.modalVideo.src = data.src;
      this.videoTitle.textContent = data.title;
      this.videoDescription.textContent = data.description;
      this.modal.classList.add('active');
      
      // Try to play video
      this.modalVideo.play().catch(e => {
        console.log('Video play failed:', e);
      });
    }
  }
}

// Initialize the effect
document.addEventListener('DOMContentLoaded', () => {
  new ScrollShuffleEffect();
});