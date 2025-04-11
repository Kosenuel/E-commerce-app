/**
 * Kosenuel E-Commerce Website
 * About Page JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial slider
    initTestimonials();
});

/**
 * Initialize testimonial slider
 */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Hide all slides except the first one
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.display = 'none';
        }
    });
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToSlide((currentSlide + 1) % slides.length);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        });
    }
    
    // Dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });
    }
    
    function goToSlide(index) {
        // Hide current slide
        slides[currentSlide].style.display = 'none';
        
        // Remove active class from current dot
        if (dots.length > 0) {
            dots[currentSlide].classList.remove('active');
        }
        
        // Update current slide
        currentSlide = index;
        
        // Show new slide
        slides[currentSlide].style.display = 'block';
        
        // Add active class to new dot
        if (dots.length > 0) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, 5000);
}
