/**
 * Kosenuel E-Commerce Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSearch();
    
    // Initialize page-specific components
    if (document.querySelector('.faq-item')) {
        initFAQ();
    }
    
    if (document.querySelector('.tabs-container')) {
        initTabs();
    }
    
    if (document.querySelector('.testimonial-slider')) {
        initTestimonials();
    }
    
    if (document.querySelector('.checkout-progress')) {
        initCheckout();
    }
    
    // Initialize cart count on page load
    updateCartCount();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle menu icon (hamburger to X)
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !event.target.closest('.main-nav') && 
            !event.target.closest('.menu-toggle')) {
            navMenu.classList.remove('active');
            
            // Reset menu icon
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.remove('active'));
        }
    });
    
    // Search toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.style.display = searchContainer.style.display === 'block' ? 'none' : 'block';
            
            if (searchContainer.style.display === 'block') {
                searchContainer.querySelector('input').focus();
            }
        });
    }
}

/**
 * Search functionality
 */
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real implementation, this would redirect to search results
                // For now, we'll redirect to the products page with a search parameter
                window.location.href = `${window.location.pathname.includes('/pages/') ? '' : 'pages/'}products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

/**
 * FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Toggle current item
            item.classList.toggle('active');
            
            // Close other items (uncomment for accordion behavior)
            /*
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            */
        });
    });
}

/**
 * Tabs functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to current button
            button.classList.add('active');
            
            // Show corresponding panel
            const tabId = button.dataset.tab;
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

/**
 * Testimonial slider functionality
 */
function initTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!testimonialSlider || testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Show first testimonial
    testimonials[currentIndex].classList.add('active');
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            testimonials[currentIndex].classList.remove('active');
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            testimonials[currentIndex].classList.add('active');
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            testimonials[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].classList.add('active');
        });
    }
    
    // Auto slide
    setInterval(function() {
        if (document.visibilityState === 'visible') {
            testimonials[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].classList.add('active');
        }
    }, 5000);
}

/**
 * Checkout functionality
 */
function initCheckout() {
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (checkoutSteps.length === 0) return;
    
    let currentStep = 0;
    
    // Show first step
    checkoutSteps[currentStep].classList.add('active');
    progressSteps[currentStep].classList.add('active');
    
    // Next buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate current step
            if (!validateStep(currentStep)) {
                return;
            }
            
            // Hide current step
            checkoutSteps[currentStep].classList.remove('active');
            
            // Show next step
            currentStep++;
            checkoutSteps[currentStep].classList.add('active');
            
            // Update progress
            progressSteps[currentStep].classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
    
    // Previous buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide current step
            checkoutSteps[currentStep].classList.remove('active');
            
            // Show previous step
            currentStep--;
            checkoutSteps[currentStep].classList.add('active');
            
            // Update progress
            progressSteps[currentStep + 1].classList.remove('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
    
    // Load cart items
    loadCartItems();
    
    // Order form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate final step
            if (!validateStep(currentStep)) {
                return;
            }
            
            // Show order confirmation
            const orderConfirmation = document.getElementById('order-confirmation');
            if (orderConfirmation) {
                // Hide checkout steps
                checkoutSteps.forEach(step => step.classList.remove('active'));
                
                // Show confirmation
                orderConfirmation.classList.add('active');
                
                // Generate order number
                const orderNumber = 'KOS' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
                const orderNumberElement = document.getElementById('order-number');
                if (orderNumberElement) {
                    orderNumberElement.textContent = orderNumber;
                }
                
                // Clear cart
                localStorage.removeItem('kosenuelCart');
                updateCartCount();
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
        });
    }
}

/**
 * Validate checkout step
 */
function validateStep(step) {
    // Get all required fields in current step
    const currentStepElement = document.querySelectorAll('.checkout-step')[step];
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message if not exists
            let errorMessage = field.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // Remove error message if exists
            const errorMessage = field.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });
    
    return isValid;
}

/**
 * Load cart items in checkout
 */
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!cartItemsContainer) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        
        if (subtotalElement) subtotalElement.textContent = '₦0';
        if (totalElement) totalElement.textContent = '₦0';
        
        return;
    }
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Calculate subtotal
    let subtotal = 0;
    
    // Add cart items
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const variantText = item.variants ? 
            Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
        
        const cartItem = `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    ${variantText ? `<div class="cart-item-variants">${variantText}</div>` : ''}
                    <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-quantity">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-total">₦${itemTotal.toLocaleString()}</div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItem);
    });
    
    // Update subtotal and total
    if (subtotalElement) subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    
    // Calculate total (subtotal + shipping)
    const shipping = 2000; // Fixed shipping cost
    const total = subtotal + shipping;
    
    if (totalElement) totalElement.textContent = `₦${total.toLocaleString()}`;
    
    // Add event listeners to quantity buttons
    const quantityButtons = cartItemsContainer.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const cartItem = this.closest('.cart-item');
            const index = Array.from(cartItemsContainer.children).indexOf(cartItem);
            
            if (index === -1) return;
            
            if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity--;
            } else if (action === 'increase') {
                cart[index].quantity++;
            }
            
            // Update localStorage
            localStorage.setItem('kosenuelCart', JSON.stringify(cart));
            
            // Reload cart items
            loadCartItems();
            
            // Update cart count
            updateCartCount();
        });
    });
    
    // Add event listeners to remove buttons
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            
            if (isNaN(index)) return;
            
            // Remove item from cart
            cart.splice(index, 1);
            
            // Update localStorage
            localStorage.setItem('kosenuelCart', JSON.stringify(cart));
            
            // Reload cart items
            loadCartItems();
            
            // Update cart count
            updateCartCount();
        });
    });
}
