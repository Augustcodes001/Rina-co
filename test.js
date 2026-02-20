<script>
        // Investment Guides Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('guideModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const viewGuideBtns = document.querySelectorAll('.view-guide-btn');
    const downloadGuideBtns = document.querySelectorAll('.download-guide-btn');
    const guideFrame = document.getElementById('guideFrame');
    const modalTitle = document.getElementById('modalTitle');
    const guideEmail = document.getElementById('guideEmail');
    const sendGuideBtn = document.getElementById('sendGuideBtn');
    const downloadToast = document.getElementById('downloadToast');
    const viewerLoading = document.querySelector('.viewer-loading');
    const downloadSuccess = document.querySelector('.download-success');
    
    // Guide data - Update these paths to your actual PDF files
    const guides = {
        1: {
            title: "Beginner's Guide to Real Estate Investing",
            pdf: "documents/beginners-guide-real-estate.pdf",
            preview: "documents/previews/beginners-preview.pdf"
        },
        2: {
            title: "High-Growth Investment Strategies",
            pdf: "documents/high-growth-strategies.pdf",
            preview: "documents/previews/high-growth-preview.pdf"
        },
        3: {
            title: "Tax & Sustainable Investment Benefits",
            pdf: "documents/tax-sustainable-investment.pdf",
            preview: "documents/previews/tax-preview.pdf"
        }
    };
    
    // Open modal for guide preview
    viewGuideBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const guideId = this.getAttribute('data-guide');
            const guide = guides[guideId];
            
            if (guide) {
                modalTitle.textContent = guide.title;
                viewerLoading.style.display = 'flex';
                guideFrame.style.display = 'none';
                
                // Reset form
                downloadSuccess.style.display = 'none';
                guideEmail.value = '';
                
                // Use Google Docs Viewer for reliable PDF embedding
                guideFrame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/' + guide.preview)}&embedded=true`;
                
                // Show loading for 2 seconds, then show iframe
                setTimeout(() => {
                    viewerLoading.style.display = 'none';
                    guideFrame.style.display = 'block';
                }, 2000);
                
                // Update send button data
                sendGuideBtn.setAttribute('data-guide', guideId);
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Direct download (simulated - for direct download links)
    downloadGuideBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const guideId = this.getAttribute('data-guide');
            const guideTitle = this.getAttribute('data-title');
            
            // Show email capture modal instead of direct download
            // For direct download, uncomment the next line and remove the modal open code
            // window.location.href = guides[guideId].pdf;
            
            // Instead, show modal for email capture
            modalTitle.textContent = `Download ${guideTitle}`;
            guideFrame.style.display = 'none';
            viewerLoading.style.display = 'none';
            downloadSuccess.style.display = 'none';
            guideEmail.value = '';
            sendGuideBtn.setAttribute('data-guide', guideId);
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle email submission for guide download
    sendGuideBtn.addEventListener('click', function() {
        const email = guideEmail.value.trim();
        const guideId = this.getAttribute('data-guide');
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            guideEmail.focus();
            return;
        }
        
        // Here you would typically send the email to your server
        // For now, we'll simulate the process
        
        // Show success message
        downloadSuccess.style.display = 'block';
        
        // Simulate sending to server (remove in production)
        setTimeout(() => {
            // In production: Send email to your backend
            // fetch('/api/send-guide', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({email: email, guideId: guideId})
            // });
            
            // Simulate download
            const guide = guides[guideId];
            if (guide) {
                const link = document.createElement('a');
                link.href = guide.pdf;
                link.download = guide.title + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show download toast
                showToast('Download started! Check your downloads folder.');
                
                // Close modal after download
                setTimeout(closeModal, 2000);
            }
        }, 1500);
    });
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        guideFrame.src = ''; // Stop loading iframe
    }
    
    // Show toast notification
    function showToast(message) {
        const toastMessage = downloadToast.querySelector('.toast-message p');
        toastMessage.textContent = message;
        
        downloadToast.classList.add('show');
        
        setTimeout(() => {
            downloadToast.classList.remove('show');
        }, 3000);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Form submission on enter key
    guideEmail.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendGuideBtn.click();
        }
    });
});
    </script>