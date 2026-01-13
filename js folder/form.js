   document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('investment-form');
            const statusMessage = document.getElementById('status-message');
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Show sending status
                statusMessage.textContent = 'Sending your message...';
                statusMessage.className = 'status-message status-sending';
                
                try {
                    // Create FormData object from form
                    const formData = new FormData(form);
                    
                    // Send to Formspree using your endpoint
                    const response = await fetch('https://formspree.io/f/mrbloeja', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Success message
                        statusMessage.textContent = '✅ Your message has been sent successfully! We will contact you shortly.';
                        statusMessage.className = 'status-message status-success';
                        
                        // Reset form
                        form.reset();
                    } else {
                        // Show error message
                        const errorData = await response.json();
                        let errorMsg = '❌ There was an error sending your message.';
                        
                        if (errorData.errors) {
                            errorMsg += ` (${errorData.errors.map(err => err.message).join(', ')})`;
                        }
                        
                        statusMessage.textContent = errorMsg;
                        statusMessage.className = 'status-message status-error';
                    }
                } catch (error) {
                    // Network error
                    statusMessage.textContent = '❌ Network error. Please check your connection and try again.';
                    statusMessage.className = 'status-message status-error';
                    console.error('Form submission error:', error);
                }
            });
        });