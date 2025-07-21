      
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