      
       document.addEventListener('DOMContentLoaded', () => {
            const circle = document.querySelector('.progress-ring-circle');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const preloader = document.querySelector('.preloader');
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            // Set initial progress to 0
            setProgress(0);
            
            // Simulate loading progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Fade out after completion
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                        }, 300);
                    }, 200);
                }
                setProgress(progress);
            }, 100);
            
            function setProgress(percent) {
                const offset = circumference - (percent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        });
        
       // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    //   slider
        document.addEventListener('DOMContentLoaded', () => {
            const sliderWrapper = document.querySelector('.slider-wrapper');
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.nav-dot');
            const prevBtn = document.querySelector('.arrow-left');
            const nextBtn = document.querySelector('.arrow-right');
                const progressBar = document.querySelector('.progress-bar');
            let currentSlide = 0;
            const slideCount = slides.length;
            
            // Update slider position
            function updateSlider() {
                sliderWrapper.style.transform = `translateX(-${currentSlide * 25}%)`;
                
                // Update active dot
                dots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
                 // Reset progress bar
                progressBar.style.width = '0%';
                startProgressBar();
            }
             // Start progress bar animation
            function startProgressBar() {
                clearInterval(progressInterval);
                progressBar.style.width = '0%';
                
                let width = 0;
                progressInterval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(progressInterval);
                    } else {
                        width += 1;
                        progressBar.style.width = width + '%';
                    }
                }, 80); // 8 seconds for 100% width (8000ms / 100 = 80ms per 1%)
            }
            // Next slide
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slideCount;
                updateSlider();
            }
            
            // Previous slide
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                updateSlider();
            }
            
            // Auto slide every 8 seconds
            let slideInterval = setInterval(nextSlide, 8000);
            
            // Event listeners for arrows
            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 8000);
            });
            
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 8000);
            });
            
            // Event listeners for dots
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    clearInterval(slideInterval);
                    currentSlide = parseInt(dot.getAttribute('data-slide'));
                    updateSlider();
                    slideInterval = setInterval(nextSlide, 8000);
                });
            });
            
            // Pause auto slide on hover
            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderWrapper.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 8000);
            });
        });
      
      // Mobile menu functionality
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const closeMenu = document.getElementById('closeMenu');
        
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenu.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
            // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
        // Tab functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                btn.classList.add('active');
                tabPanes[index].classList.add('active');
            });
        });
        
        // Lifecycle step interaction
        const lifecycleSteps = document.querySelectorAll('.lifecycle-step');
        
        lifecycleSteps.forEach(step => {
            step.addEventListener('click', () => {
                lifecycleSteps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
            });
        });
        
        // View switcher
        const viewBtns = document.querySelectorAll('.view-btn');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
    //  whatsapp button
       document.addEventListener('DOMContentLoaded', function() {
            const whatsappButton = document.getElementById('whatsappButton');
            const supportBubble = document.getElementById('supportBubble');
            const firstVisitMessage = document.getElementById('firstVisitMessage');
            
            // WhatsApp number - Replace with your actual support number
            const whatsappNumber = "+2348148227087"; // Example number
            const defaultMessage = "Hello, I need support with your services.";
            
            // Check if this is the user's first visit in this session
            const hasSeenMessage = sessionStorage.getItem('whatsappWidgetSeen');
            
            if (hasSeenMessage) {
                // If they've already seen the message, hide it immediately
                supportBubble.classList.add('hidden');
            } else {
                // Show first visit notification
                setTimeout(() => {
                    firstVisitMessage.classList.add('hidden');
                }, 3000);
                
                // Mark that the user has seen the message in this session
                sessionStorage.setItem('whatsappWidgetSeen', 'true');
                
                // Hide the bubble after 5 seconds
                setTimeout(() => {
                    supportBubble.classList.add('hidden');
                }, 5000);
            }
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
            
            // Set up click event for WhatsApp button
            whatsappButton.addEventListener('click', function() {
                window.open(whatsappUrl, '_blank');
            });
            
            // Optional: Add hover effect to show bubble again
            whatsappButton.addEventListener('mouseenter', function() {
                if (hasSeenMessage) {
                    supportBubble.classList.remove('hidden');
                }
            });
            
            whatsappButton.addEventListener('mouseleave', function() {
                if (hasSeenMessage) {
                    // Delay hiding to allow clicking on bubble if needed
                    setTimeout(() => {
                        supportBubble.classList.add('hidden');
                    }, 500);
                }
            });
            
            // Allow clicking on the bubble to open WhatsApp as well
            supportBubble.addEventListener('click', function() {
                window.open(whatsappUrl, '_blank');
            });
        });
       // ============================================
// Dailymotion Video System
// Features: 
// 1. Automatic thumbnail generation
// 2. Lightbox video player
// 3. Fallback to original images
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Extract Dailymotion video ID from various URL formats
     */
    function getDailymotionId(url) {
        if (!url) return null;
        
        // Clean URL
        url = url.trim();
        
        // Case 1: Short URL (dai.ly)
        if (url.includes('dai.ly/')) {
            return url.split('dai.ly/')[1].split('?')[0].split('/')[0];
        }
        // Case 2: Full video URL
        else if (url.includes('dailymotion.com/video/')) {
            return url.split('/video/')[1].split('?')[0].split('/')[0];
        }
        // Case 3: Embed URL
        else if (url.includes('dailymotion.com/embed/video/')) {
            return url.split('/embed/video/')[1].split('?')[0].split('/')[0];
        }
        // Case 4: Already a video ID (starts with x)
        else if (url.startsWith('x') && url.length >= 5) {
            return url.split('?')[0];
        }
        
        return null;
    }
    
    /**
     * Generate Dailymotion thumbnail URL
     */
    function getDailymotionThumbnail(videoId) {
        // Default options
        const defaults = {
            width: 800,
            height: 450,
            quality: '720x480',
            // version: 5 // Time in seconds (optional)
        };
        
        const settings = { ...defaults, ...options };
        const baseUrl = 'https://www.dailymotion.com/thumbnail/video/';
        
        // Build parameters
        const params = [];
        if (settings.width) params.push(`width=${settings.width}`);
        if (settings.height) params.push(`height=${settings.height}`);
        if (settings.version) params.push(`version=${settings.version}`);
        if (settings.quality) params.push(`quality=${settings.quality}`);
        
        // Construct URL
        let thumbnailUrl = `${baseUrl}${videoId}`;
        if (params.length > 0) {
            thumbnailUrl += `?${params.join('&')}`;
        }
        
        return thumbnailUrl;
    }
    
    /**
     * Check if a URL is a Dailymotion video
     */
    function isDailymotionUrl(url) {
        if (!url) return false;
        return url.includes('dailymotion.com') || 
               url.includes('dai.ly') || 
               (url.startsWith('x') && url.length >= 5);
    }
    
    // ============================================
    // THUMBNAIL GENERATION SYSTEM
    // ============================================
    
    /**
     * Load thumbnail for a single image element
     */
    function loadThumbnailForImage(imgElement) {
        const videoSrc = imgElement.getAttribute('data-video-src');
        
        // Only process Dailymotion videos
        if (!isDailymotionUrl(videoSrc)) {
            console.log('Not a Dailymotion URL:', videoSrc);
            return Promise.resolve(false);
        }
        
        const videoId = getDailymotionId(videoSrc);
        if (!videoId) {
            console.warn('Could not extract video ID from:', videoSrc);
            return Promise.resolve(false);
        }
        
        // Store original image as fallback
        const originalSrc = imgElement.src;
        imgElement.setAttribute('data-original-src', originalSrc);
        
        // Generate thumbnail URL
        // const thumbnailUrl = getDailymotionThumbnail(videoId, {
        //     width: 800,
        //     height: 450,
        //     quality: '720x480'
        // });
        const thumbnailUrl = `https://www.dailymotion.com/thumbnail/video/${videoId}?quality=480x360`;
        // Add loading class
        imgElement.classList.add('thumbnail-loading');
        
        return new Promise((resolve) => {
            // Create test image to check if thumbnail exists
            const testImage = new Image();
            
            testImage.onload = function() {
                // Thumbnail exists - update the image
                imgElement.src = thumbnailUrl;
                imgElement.classList.remove('thumbnail-loading');
                imgElement.classList.add('thumbnail-loaded');
                imgElement.setAttribute('data-thumbnail-status', 'loaded');
                console.log(`Thumbnail loaded for video: ${videoId}`);
                resolve(true);
            };
            
            testImage.onerror = function() {
                // Thumbnail doesn't exist - try fallback URL
                console.warn(`Thumbnail not available for: ${videoId}, trying fallback...`);
                
                // Try without parameters
                const fallbackUrl = `https://www.dailymotion.com/thumbnail/video/${videoId}`;
                const fallbackTest = new Image();
                
                fallbackTest.onload = function() {
                    imgElement.src = fallbackUrl;
                    imgElement.classList.remove('thumbnail-loading');
                    imgElement.classList.add('thumbnail-loaded');
                    imgElement.setAttribute('data-thumbnail-status', 'fallback');
                    resolve(true);
                };
                
                fallbackTest.onerror = function() {
                    // Keep original image
                    console.warn(`No thumbnail available for video: ${videoId}`);
                    imgElement.classList.remove('thumbnail-loading');
                    imgElement.setAttribute('data-thumbnail-status', 'failed');
                    resolve(false);
                };
                
                fallbackTest.src = fallbackUrl;
            };
            
            testImage.src = thumbnailUrl;
        });
    }
    
    /**
     * Update all video thumbnails on the page
     */
    function updateAllThumbnails() {
        console.log('Updating Dailymotion thumbnails...');
        
        // Find all images with video-src attribute
        const thumbnailImages = document.querySelectorAll('.video-placeholder img[data-video-src]');
        const total = thumbnailImages.length;
        let loaded = 0;
        
        if (total === 0) {
            console.log('No video thumbnails found to update');
            return;
        }
        
        console.log(`Found ${total} video thumbnails to update`);
        
        // Process each image
        thumbnailImages.forEach((imgElement, index) => {
            // Load thumbnail with a small delay to prevent overwhelming requests
            setTimeout(() => {
                loadThumbnailForImage(imgElement).then(success => {
                    loaded++;
                    console.log(`Thumbnail ${index + 1}/${total}: ${success ? '✓' : '✗'}`);
                    
                    if (loaded === total) {
                        console.log(`Thumbnail update complete: ${loaded}/${total} successful`);
                    }
                });
            }, index * 100); // Stagger requests by 100ms
        });
    }
    
    // ============================================
    // LIGHTBOX VIDEO PLAYER SYSTEM
    // ============================================
    
    /**
     * Initialize lightbox functionality
     */
    function initVideoLightbox() {
        const playButtons = document.querySelectorAll('.play-button[data-video-src]');
        const lightbox = document.getElementById('video-lightbox');
        const playerContainer = document.getElementById('dailymotion-player');
        const closeBtn = document.querySelector('.close-lightbox');
        
        if (!playButtons.length || !lightbox) {
            console.warn('Lightbox elements not found');
            return;
        }
        
        console.log(`Found ${playButtons.length} video play buttons`);
        
        // ============================================
        // PLAY BUTTON CLICK HANDLER
        // ============================================
        playButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const videoSrc = this.getAttribute('data-video-src');
                console.log('Playing video:', videoSrc);
                
                // Clear previous content
                playerContainer.innerHTML = '';
                
                // ============================================
                // DAILYMOTION VIDEO
                // ============================================
                if (isDailymotionUrl(videoSrc)) {
                    const videoId = getDailymotionId(videoSrc);
                    
                    if (!videoId) {
                        console.error('Invalid Dailymotion URL:', videoSrc);
                        alert('Unable to play video: Invalid video URL');
                        return;
                    }
                    
                    // Get video title for accessibility
                    const sectionHeader = this.closest('.video-section')?.querySelector('.section-header h2');
                    const videoTitle = sectionHeader ? sectionHeader.textContent.replace(/[^\w\s]/gi, '') : 'Video Player';
                    
                    // Create Dailymotion iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&queue-enable=false&sharing-enable=true&ui-logo=false`;
                    iframe.width = '100%';
                    iframe.height = '100%';
                    iframe.frameBorder = '0';
                    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
                    iframe.allowFullscreen = true;
                    iframe.title = `${videoTitle} - Dailymotion Video`;
                    iframe.setAttribute('allowtransparency', 'true');
                    
                    playerContainer.appendChild(iframe);
                    
                // ============================================
                // LOCAL MP4 VIDEO (FALLBACK)
                // ============================================
                } else if (videoSrc.endsWith('.mp4') || videoSrc.endsWith('.webm') || videoSrc.endsWith('.ogg')) {
                    playerContainer.innerHTML = `
                        <video controls autoplay playsinline style="width:100%;height:100%;">
                            <source src="${videoSrc}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `;
                    
                // ============================================
                // UNSUPPORTED FORMAT
                // ============================================
                } else {
                    console.error('Unsupported video format:', videoSrc);
                    playerContainer.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: white;">
                            <h3>Unable to play video</h3>
                            <p>Video format not supported.</p>
                        </div>
                    `;
                }
                
                // Show lightbox
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // ============================================
        // CLOSE LIGHTBOX FUNCTION
        // ============================================
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            playerContainer.innerHTML = ''; // Stop video
            
            // If using Dailymotion API, you might want to destroy the player here
            console.log('Lightbox closed');
        }
        
        // ============================================
        // CLOSE BUTTON EVENT
        // ============================================
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // ============================================
        // BACKGROUND CLICK TO CLOSE
        // ============================================
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // ============================================
        // ESCAPE KEY TO CLOSE
        // ============================================
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        console.log('Lightbox initialized successfully');
    }
    
    // ============================================
    // LAZY LOAD THUMBNAILS AS THEY ENTER VIEWPORT
    // ============================================
    function initLazyLoading() {
        const thumbnailImages = document.querySelectorAll('.video-placeholder img[data-video-src]');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            updateAllThumbnails();
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const status = img.getAttribute('data-thumbnail-status');
                    
                    // Only load if not already loaded
                    if (!status || status === 'failed') {
                        loadThumbnailForImage(img);
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px', // Load 100px before entering viewport
            threshold: 0.1
        });
        
        thumbnailImages.forEach(img => {
            observer.observe(img);
        });
        
        console.log('Lazy loading initialized');
    }
    
    // ============================================
    // INITIALIZE EVERYTHING WHEN DOM IS READY
    // ============================================
    function initVideoSystem() {
        console.log('Initializing Dailymotion video system...');
        
        // 1. Initialize lightbox first (so play buttons work immediately)
        initVideoLightbox();
        
        // 2. Initialize lazy loading for thumbnails
        initLazyLoading();
        
        // 3. Optional: Pre-load first 2 thumbnails immediately
        const firstImages = document.querySelectorAll('.video-placeholder img[data-video-src]');
        if (firstImages.length > 0) {
            // Load first image immediately
            setTimeout(() => loadThumbnailForImage(firstImages[0]), 500);
            
            // Load second image with delay
            if (firstImages.length > 1) {
                setTimeout(() => loadThumbnailForImage(firstImages[1]), 1000);
            }
        }
        
        console.log('Dailymotion video system initialized');
    }
    
    // ============================================
    // MANUAL CONTROL FUNCTIONS (Optional)
    // ============================================
    window.DailymotionVideoSystem = {
        // Public API methods
        refreshThumbnails: updateAllThumbnails,
        reloadThumbnail: function(imgElement) {
            if (typeof imgElement === 'string') {
                imgElement = document.querySelector(imgElement);
            }
            if (imgElement) {
                return loadThumbnailForImage(imgElement);
            }
        },
        playVideo: function(videoSrcOrElement) {
            // Programmatically trigger video play
            if (typeof videoSrcOrElement === 'string') {
                // Find play button with this video src
                const button = document.querySelector(`.play-button[data-video-src="${videoSrcOrElement}"]`);
                if (button) button.click();
            } else if (videoSrcOrElement.click) {
                videoSrcOrElement.click();
            }
        }
    };
    
    // ============================================
    // START THE SYSTEM
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoSystem);
    } else {
        initVideoSystem();
    }
    
})();


         // FAQ Accordion Functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });
        
// counting animation
        document.addEventListener('DOMContentLoaded', function() {
            // Count-up animation function
            function animateValue(element, start, end, duration) {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const value = Math.floor(progress * (end - start) + start);
                    
                    // Check if the original element had a '+' or '%' suffix
                    const suffixTop = element.innerHTML.includes('+') ? '+' : 
                                   element.innerHTML.includes('%') ? '%' : '';
                    
                    element.innerHTML = value + suffixTop;
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            }
            
            // Intersection Observer for counting animation
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statItems = document.querySelectorAll('.stat-item-top');
                        
                        statItems.forEach(item => {
const numberElement = item.querySelector('.stat-number-top');
                            const targetValue = parseInt(numberElement.getAttribute('data-target'));
                            
                            // Get suffix for display
                            const suffixTop = numberElement.innerHTML.includes('+') ? '+' : 
                                          numberElement.innerHTML.includes('%') ? '%' : '';
                            
                            // Start animation
                            animateValue(numberElement, 0, targetValue, 2000);
                            
                            // Add animation class
                            numberElement.classList.add('counting');
                        });
                        
                        // Stop observing after animation starts
                        observer.disconnect();
                    }
                });
            }, {
                threshold: 0.5 // Trigger when 50% of the element is visible
            });
            
            // Observe the stats container at the top
            const statsContainerTop = document.querySelector('.stats-container-top');
            if (statsContainerTop) {
                observer.observe(statsContainerTop);
            }
        
             // Intersection Observer for counting animation for the container at the bottom
            const observerBottom = new IntersectionObserver((entries, observerBottom) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statItems = document.querySelectorAll('.stat-item');
                        
                        statItems.forEach(item => {
                            const numberElement = item.querySelector('.stat-number');
                            const targetValue = parseInt(numberElement.getAttribute('data-target'));
                            
                            // Get suffix for display
                            const suffix = numberElement.innerHTML.includes('+') ? '+' : 
                                          numberElement.innerHTML.includes('%') ? '%' : '';
                            
                            // Start animation
                            animateValue(numberElement, 0, targetValue, 2000);
                            
                            // Add animation class
                            numberElement.classList.add('counting');
                        });
                        
                        // Stop observing after animation starts
                      observerBottom.disconnect();
                    }
                });
            }, {
                threshold: 0.5 // Trigger when 50% of the element is visible
            });
            
            // Observe the stats container
            const statsContainer = document.querySelector('.stats-container');
            if (statsContainer) {
                observerBottom.observe(statsContainer);
            }
            // Video play button functionality
            // const playBtn = document.querySelector('.play-btn');
            // if (playBtn) {
            //     playBtn.addEventListener('click', function() {
            //         alert("In a real implementation, this would play the testimonial video.");
            //     });
            // }
        });

 
        //  estate player logic
          const videoPlaceholder = document.querySelector(".video-placeholder-estate");
             const videoOverlay = document.querySelector(".video-overlay");
           const playButton = document.querySelector(".video-overlay .play-button");
         const EloraVideo = document.querySelector(".Elora-gardens-video video");
            const EloraVideoContainer = document.querySelector(".Elora-gardens-video");
playButton.onclick = function(){
    videoOverlay.style.display="none";
      videoPlaceholder.style.display="none";
      EloraVideo.play();
          EloraVideo.muted = false;
       EloraVideo.classList.add(".animate-slide-up")
}



        // video player
       
        document.addEventListener('DOMContentLoaded', function() {
            const videoOverlay = document.querySelector('.video-overlay');
            const playPauseBtn = document.getElementById('play-pause');
            const muteBtn = document.getElementById('mute');
            const progressBar = document.getElementById('progress-bar');
            const progressContainer = document.querySelector('.progress-container');
            const fullscreenBtn = document.getElementById('fullscreen');
            const videoWrapper = document.querySelector('.video-wrapper');
            const iframe = document.querySelector('iframe');
            
            // Simulated video controls functionality
            let isPlaying = false;
            let isMuted = false;
            
            // Play/Pause functionality
            playPauseBtn.addEventListener('click', function() {
                isPlaying = !isPlaying;
                playPauseBtn.innerHTML = isPlaying ? 
                    '<i class="fas fa-pause"></i>' : 
                    '<i class="fas fa-play"></i>';
                
                // Simulate video progress for demo
                if (isPlaying) {
                    simulateProgress();
                }
            });
            
            // Mute functionality
            muteBtn.addEventListener('click', function() {
                isMuted = !isMuted;
                muteBtn.innerHTML = isMuted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
            });
            
            // Progress bar click
            progressContainer.addEventListener('click', function(e) {
                const pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
                progressBar.style.width = pos * 100 + '%';
            });
            
            // Fullscreen functionality
            fullscreenBtn.addEventListener('click', function() {
                if (videoWrapper.requestFullscreen) {
                    videoWrapper.requestFullscreen();
                } else if (videoWrapper.mozRequestFullScreen) {
                    videoWrapper.mozRequestFullScreen();
                } else if (videoWrapper.webkitRequestFullscreen) {
                    videoWrapper.webkitRequestFullscreen();
                } else if (videoWrapper.msRequestFullscreen) {
                    videoWrapper.msRequestFullscreen();
                }
            });
            
            // Remove overlay on play
            videoOverlay.addEventListener('click', function() {
                this.style.display = 'none';
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                simulateProgress();
            });
            
            // Simulate progress for demo
            function simulateProgress() {
                if (isPlaying) {
                    let width = 0;
                    const interval = setInterval(function() {
                        if (width >= 100 || !isPlaying) {
                            clearInterval(interval);
                            if (width >= 100) {
                                isPlaying = false;
                                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                            }
                        } else {
                            width += 0.5;
                            progressBar.style.width = width + '%';
                        }
                    }, 50);
                }
            }
        });
// 


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const closeIcon = document.getElementById('closeMenu');
    const menuItems = document.querySelectorAll('.mobile-nav ul li');

    // Set staggered animation delay via CSS custom properties
    menuItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });

    function openMenu() {
        mobileNav.classList.add('active');
        menuToggle.classList.add('open');
    }

    function closeMenu() {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('open');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (closeIcon) {
        closeIcon.addEventListener('click', closeMenu);
    }

    // Close menu when clicking outside (optional)
    document.addEventListener('click', function(e) {
        if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target) && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
});