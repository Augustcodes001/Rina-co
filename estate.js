   // Land Navigation Tabs
        const landNavItems = document.querySelectorAll('.land-nav-item');
        const landContents = document.querySelectorAll('.land-content');
        
        landNavItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                landNavItems.forEach(navItem => navItem.classList.remove('active'));
                landContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding content
                const target = item.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });


        // Mobile Menu Toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navMenu = document.querySelector('nav ul');
        
    
        
    

        // Property Slider Functionality
        document.querySelectorAll('.property-slider').forEach(slider => {
            const container = slider.querySelector('.slider-container');
            const sections = container.querySelectorAll('.slider-section');
            const navBtns = slider.querySelectorAll('.slider-nav-btn');
            const prevBtn = slider.querySelector('.prev-btn');
            const nextBtn = slider.querySelector('.next-btn');
            const imageSlide = slider.querySelector('.image-slide');
            const images = slider.querySelectorAll('.slider-img');
            const galleryDots = slider.querySelectorAll('.gallery-dot');
            
            let currentSection = 0;
            let currentImage = 0;
            let autoSlideInterval;
            
            // Function to show section
            function showSection(index) {
                container.style.transform = `translateX(-${index * 100}%)`;
                navBtns.forEach(btn => btn.classList.remove('active'));
                navBtns[index].classList.add('active');
                currentSection = index;
                
                // Clear any existing auto-slide
                clearInterval(autoSlideInterval);
                
                // Start auto-slide for images if in image section
                if (index === 0 && images.length > 1) {
                    startAutoSlide();
                }
            }
            
            // Function to show image
            function showImage(index) {
                imageSlide.style.transform = `translateX(-${index * 100}%)`;
                galleryDots.forEach(dot => dot.classList.remove('active'));
                galleryDots[index].classList.add('active');
                currentImage = index;
            }
            
            // Auto-slide for images
            function startAutoSlide() {
                autoSlideInterval = setInterval(() => {
                    const nextImage = (currentImage + 1) % images.length;
                    showImage(nextImage);
                }, 4000);
            }
            
            // Navigation button event listeners
            navBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    showSection(index);
                });
            });
            
            // Previous/Next buttons for sections
            prevBtn.addEventListener('click', () => {
                const prevSection = (currentSection - 1 + sections.length) % sections.length;
                showSection(prevSection);
            });
            
            nextBtn.addEventListener('click', () => {
                const nextSection = (currentSection + 1) % sections.length;
                showSection(nextSection);
            });
            
            // Gallery dots for images
            if (galleryDots.length) {
                galleryDots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        showImage(index);
                    });
                });
            }
            
            // Initialize first section
            showSection(0);
        });

        // Image Modal Functionality
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeModal = document.querySelector('.close-modal');
        const prevModal = document.querySelector('.prev-modal');
        const nextModal = document.querySelector('.next-modal');
        
        let currentModalImages = [];
        let currentModalIndex = 0;
        
        // Open modal with image
        document.querySelectorAll('.slider-img').forEach(img => {
            img.addEventListener('click', function() {
                const slider = this.closest('.property-slider');
                currentModalImages = Array.from(slider.querySelectorAll('.slider-img'));
                currentModalIndex = currentModalImages.indexOf(this);
                
                modal.style.display = 'block';
                modalImg.src = this.src;
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Previous image in modal
        prevModal.addEventListener('click', function() {
            currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
            modalImg.src = currentModalImages[currentModalIndex].src;
        });
        
        // Next image in modal
        nextModal.addEventListener('click', function() {
            currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
            modalImg.src = currentModalImages[currentModalIndex].src;
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });