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