/**
 * Kosenuel E-Commerce Website
 * Contact Form JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ accordion
    if (document.querySelector('.faq-item')) {
        initFAQ();
    }
});

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const phone = this.querySelector('#phone').value;
        const subject = this.querySelector('#subject').value;
        const message = this.querySelector('#message').value;
        
        // Validate form data
        if (!validateContactForm(name, email, subject, message)) {
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Reset form
            this.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Show success message
            showNotification('Your message has been sent successfully! We will get back to you soon.');
        }, 1500);
    });
}

/**
 * Validate contact form
 */
function validateContactForm(name, email, subject, message) {
    // Check if required fields are filled
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already in CSS
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            .notification {
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-out forwards;
                display: flex;
                align-items: center;
            }
            .notification.success {
                background-color: var(--color-navy);
                color: white;
            }
            .notification.error {
                background-color: #f44336;
                color: white;
            }
            .notification i {
                margin-right: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .notification.fade-out {
                animation: fadeOut 0.3s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Initialize FAQ accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            if (isActive) {
                item.classList.remove('active');
                answer.style.display = 'none';
            } else {
                item.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });
}
