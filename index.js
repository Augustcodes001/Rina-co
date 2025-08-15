      
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
        
        // Option selection in customization studio
        const optionCards = document.querySelectorAll('.option-card');
        
        optionCards.forEach(card => {
            card.addEventListener('click', function() {
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll('.option-card');
                
                siblings.forEach(sibling => {
                    if (sibling !== this) {
                        sibling.classList.remove('active');
                    }
                });
                
                this.classList.toggle('active');
            });
        });
        
        // Simple animation on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('.section-header, .lifecycle-nav, .projects-grid, .tabs-container, .properties-container, .studio-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
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