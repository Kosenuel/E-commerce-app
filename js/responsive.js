/**
 * Kosenuel E-Commerce Website
 * Responsive Testing JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add viewport size indicator for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addViewportSizeIndicator();
    }
    
    // Add responsive image loading
    initResponsiveImages();
});

/**
 * Add viewport size indicator for development
 */
function addViewportSizeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'viewport-indicator';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .viewport-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Update indicator on resize
    function updateIndicator() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let size = 'XS';
        
        if (width >= 1200) size = 'XL';
        else if (width >= 992) size = 'LG';
        else if (width >= 768) size = 'MD';
        else if (width >= 576) size = 'SM';
        
        indicator.textContent = `${width}x${height} - ${size}`;
    }
    
    // Initial update
    updateIndicator();
    
    // Add to body
    document.body.appendChild(indicator);
    
    // Update on resize
    window.addEventListener('resize', updateIndicator);
}

/**
 * Initialize responsive images
 */
function initResponsiveImages() {
    // Find all images with data-srcset attribute
    const images = document.querySelectorAll('img[data-srcset]');
    
    images.forEach(img => {
        // Set srcset attribute
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
        
        // Set sizes attribute if available
        if (img.dataset.sizes) {
            img.sizes = img.dataset.sizes;
        }
    });
    
    // Lazy load images that are not in the viewport
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Set src from data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    // Remove placeholder class if any
                    img.classList.remove('placeholder-image');
                    
                    // Stop observing the image
                    observer.unobserve(img);
                }
            });
        });
        
        // Find all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}
