/**
 * Kosenuel E-Commerce Website
 * Checkout JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout process
    initCheckout();
});

/**
 * Initialize checkout process
 */
function initCheckout() {
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Load cart items
    loadCartItems();
    
    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current and next step
            const currentStep = button.closest('.checkout-step');
            const nextStepId = button.dataset.next;
            const nextStep = document.getElementById(`${nextStepId}-step`);
            
            // If this is a form submission, validate first
            if (currentStep.querySelector('form')) {
                const form = currentStep.querySelector('form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
            }
            
            // Hide current step
            currentStep.classList.remove('active');
            
            // Show next step
            if (nextStep) {
                nextStep.classList.add('active');
                
                // Update progress
                updateCheckoutProgress(nextStepId);
                
                // If moving to confirmation step, generate order details
                if (nextStepId === 'confirmation') {
                    generateOrderConfirmation();
                }
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
        });
    });
    
    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current and previous step
            const currentStep = button.closest('.checkout-step');
            const prevStepId = button.dataset.prev;
            const prevStep = document.getElementById(`${prevStepId}-step`);
            
            // Hide current step
            currentStep.classList.remove('active');
            
            // Show previous step
            if (prevStep) {
                prevStep.classList.add('active');
                
                // Update progress
                updateCheckoutProgress(prevStepId);
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
        });
    });
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment forms
                document.getElementById('credit-card-form').style.display = 'none';
                document.getElementById('bank-transfer-form').style.display = 'none';
                document.getElementById('pay-on-delivery-form').style.display = 'none';
                
                // Show selected payment form
                document.getElementById(`${this.value}-form`).style.display = 'block';
                
                // Update order summary
                if (this.value === 'pay-on-delivery') {
                    document.querySelectorAll('.pod-fee').forEach(el => el.style.display = 'flex');
                } else {
                    document.querySelectorAll('.pod-fee').forEach(el => el.style.display = 'none');
                }
                
                // Update totals
                updateOrderTotal();
            });
        });
    }
    
    // Shipping method selection
    const shippingMethods = document.querySelectorAll('input[name="shipping-method"]');
    
    if (shippingMethods.length > 0) {
        shippingMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Update shipping cost in order summary
                let shippingCost = 0;
                
                switch(this.value) {
                    case 'standard':
                        shippingCost = 2000;
                        break;
                    case 'express':
                        shippingCost = 5000;
                        break;
                    case 'same-day':
                        shippingCost = 8000;
                        break;
                }
                
                document.getElementById('shipping-cost').textContent = `₦${shippingCost.toLocaleString()}`;
                
                // Update total
                updateOrderTotal();
            });
        });
    }
}

/**
 * Update checkout progress
 */
function updateCheckoutProgress(stepId) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach(step => {
        // Remove active class from all steps
        step.classList.remove('active');
        
        // Mark previous steps as completed
        if (getStepIndex(step.dataset.step) < getStepIndex(stepId)) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
        
        // Add active class to current step
        if (step.dataset.step === stepId) {
            step.classList.add('active');
        }
    });
    
    // Helper function to get step index
    function getStepIndex(stepId) {
        const steps = ['cart', 'shipping', 'payment', 'confirmation'];
        return steps.indexOf(stepId);
    }
}

/**
 * Load cart items
 */
function loadCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const toShippingBtn = document.getElementById('to-shipping-btn');
    
    if (!cartItemsList) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        
        // Disable proceed button
        if (toShippingBtn) {
            toShippingBtn.disabled = true;
        }
        
        return;
    }
    
    // Hide empty cart message
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    // Enable proceed button
    if (toShippingBtn) {
        toShippingBtn.disabled = false;
    }
    
    // Clear existing items
    if (cartItemsList) {
        // Keep the empty cart message
        const message = emptyCartMessage ? emptyCartMessage.outerHTML : '';
        cartItemsList.innerHTML = message;
        
        // Add cart items
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const variantText = item.variants ? 
                Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
            
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        ${variantText ? `<p class="cart-item-variant">${variantText}</p>` : ''}
                        <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                        <div class="cart-item-actions">
                            <div class="cart-quantity">
                                <button type="button" class="cart-quantity-btn minus">-</button>
                                <input type="text" class="cart-quantity-input" value="${item.quantity}" readonly>
                                <button type="button" class="cart-quantity-btn plus">+</button>
                            </div>
                            <button type="button" class="remove-item"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsList.insertAdjacentHTML('beforeend', cartItemHTML);
        });
        
        // Update order summary
        const shipping = 2000; // Default shipping cost
        const tax = Math.round(subtotal * 0.075); // 7.5% VAT
        const total = subtotal + shipping + tax;
        
        // Update cart step summary
        if (document.getElementById('cart-subtotal')) {
            document.getElementById('cart-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
            document.getElementById('cart-shipping').textContent = `₦${shipping.toLocaleString()}`;
            document.getElementById('cart-tax').textContent = `₦${tax.toLocaleString()}`;
            document.getElementById('cart-total').textContent = `₦${total.toLocaleString()}`;
        }
        
        // Update shipping step summary
        if (document.getElementById('shipping-subtotal')) {
            document.getElementById('shipping-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
            document.getElementById('shipping-tax').textContent = `₦${tax.toLocaleString()}`;
            document.getElementById('shipping-total').textContent = `₦${total.toLocaleString()}`;
            
            // Also update shipping cart items summary
            updateCartSummary('shipping-cart-items', cart);
        }
        
        // Update payment step summary
        if (document.getElementById('payment-subtotal')) {
            document.getElementById('payment-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
            document.getElementById('payment-shipping').textContent = `₦${shipping.toLocaleString()}`;
            document.getElementById('payment-tax').textContent = `₦${tax.toLocaleString()}`;
            document.getElementById('payment-total').textContent = `₦${total.toLocaleString()}`;
            
            // Also update payment cart items summary
            updateCartSummary('payment-cart-items', cart);
        }
        
        // Add event listeners to quantity buttons and remove buttons
        const minusButtons = cartItemsList.querySelectorAll('.minus');
        const plusButtons = cartItemsList.querySelectorAll('.plus');
        const removeButtons = cartItemsList.querySelectorAll('.remove-item');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const quantityInput = cartItem.querySelector('.cart-quantity-input');
                let quantity = parseInt(quantityInput.value);
                
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                    updateCartItemQuantity(itemId, quantity);
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const quantityInput = cartItem.querySelector('.cart-quantity-input');
                let quantity = parseInt(quantityInput.value);
                
                quantity++;
                quantityInput.value = quantity;
                updateCartItemQuantity(itemId, quantity);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                
                removeCartItem(itemId);
                cartItem.remove();
                
                // Check if cart is empty
                if (cartItemsList.querySelectorAll('.cart-item').length === 0) {
                    if (emptyCartMessage) {
                        emptyCartMessage.style.display = 'block';
                    }
                    
                    if (toShippingBtn) {
                        toShippingBtn.disabled = true;
                    }
                }
            });
        });
    }
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(itemId, quantity) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    // Find item
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = quantity;
        
        // Save cart
        localStorage.setItem('kosenuelCart', JSON.stringify(cart));
        
        // Update cart count in header
        updateCartCount(cart);
        
        // Update order summary
        updateOrderSummary(cart);
    }
}

/**
 * Remove cart item
 */
function removeCartItem(itemId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    // Remove item
    cart = cart.filter(item => item.id !== itemId);
    
    // Save cart
    localStorage.setItem('kosenuelCart', JSON.stringify(cart));
    
    // Update cart count in header
    updateCartCount(cart);
    
    // Update order summary
    updateOrderSummary(cart);
}

/**
 * Update cart count in header
 */
function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

/**
 * Update order summary
 */
function updateOrderSummary(cart) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get shipping cost
    let shipping = 2000; // Default shipping cost
    const selectedShipping = document.querySelector('input[name="shipping-method"]:checked');
    if (selectedShipping) {
        switch(selectedShipping.value) {
            case 'standard':
                shipping = 2000;
                break;
            case 'express':
                shipping = 5000;
                break;
            case 'same-day':
                shipping = 8000;
                break;
        }
    }
    
    // Calculate tax
    const tax = Math.round(subtotal * 0.075); // 7.5% VAT
    
    // Calculate total
    let total = subtotal + shipping + tax;
    
    // Add POD fee if applicable
    if (document.querySelector('input[name="payment-method"]:checked')?.value === 'pay-on-delivery') {
        total += 1000;
    }
    
    // Update cart step summary
    if (document.getElementById('cart-subtotal')) {
        document.getElementById('cart-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
        document.getElementById('cart-shipping').textContent = `₦${shipping.toLocaleString()}`;
        document.getElementById('cart-tax').textContent = `₦${tax.toLocaleString()}`;
        document.getElementById('cart-total').textContent = `₦${total.toLocaleString()}`;
    }
    
    // Update shipping step summary
    if (document.getElementById('shipping-subtotal')) {
        document.getElementById('shipping-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
        document.getElementById('shipping-tax').textContent = `₦${tax.toLocaleString()}`;
        document.getElementById('shipping-total').textContent = `₦${total.toLocaleString()}`;
    }
    
    // Update payment step summary
    if (document.getElementById('payment-subtotal')) {
        document.getElementById('payment-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
        document.getElementById('payment-shipping').textContent = `₦${shipping.toLocaleString()}`;
        document.getElementById('payment-tax').textContent = `₦${tax.toLocaleString()}`;
        document.getElementById('payment-total').textContent = `₦${total.toLocaleString()}`;
    }
}

/**
 * Update cart summary in checkout steps
 */
function updateCartSummary(containerId, cart) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add cart items summary
    cart.forEach(item => {
        const variantText = item.variants ? 
            Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
        
        const itemHTML = `
            <div class="summary-cart-item">
                <div class="summary-item">
                    <span>${item.name} ${variantText ? `(${variantText})` : ''} x ${item.quantity}</span>
                    <span>₦${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

/**
 * Update order total
 */
function updateOrderTotal() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    // Update order summary
    updateOrderSummary(cart);
}

/**
 * Generate order confirmation
 */
function generateOrderConfirmation() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    // Generate order number
    const orderNumber = 'KOS-' + Math.floor(100000 + Math.random() * 900000);
    
    // Get current date
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'credit-card';
    const paymentMethodText = {
        'credit-card': 'Credit Card',
        'bank-transfer': 'Bank Transfer',
        'pay-on-delivery': 'Pay on Delivery'
    }[paymentMethod];
    
    // Get shipping method
    const shippingMethod = document.querySelector('input[name="shipping-method"]:checked')?.value || 'standard';
    const shippingMethodText = {
        'standard': 'Standard Shipping (3-5 business days)',
        'express': 'Express Shipping (1-2 business days)',
        'same-day': 'Same Day Delivery'
    }[shippingMethod];
    
    // Get shipping address
    const firstName = document.getElementById('first-name')?.value || 'John';
    const lastName = document.getElementById('last-name')?.value || 'Doe';
    const address = document.getElementById('address')?.value || '123 Main Street';
    const city = document.getElementById('city')?.value || 'Lagos';
    const state = document.getElementById('state')?.value || 'Lagos State';
    const postalCode = document.getElementById('postal-code')?.value || '100001';
    const country = document.getElementById('country')?.value || 'Nigeria';
    const phone = document.getElementById('phone')?.value || '+234 123 456 7890';
    const email = document.getElementById('email')?.value || 'john.doe@example.com';
    
    // Update confirmation page
    document.getElementById('confirmation-order-number').textContent = orderNumber;
    document.getElementById('confirmation-order-date').textContent = orderDate;
    document.getElementById('confirmation-payment-method').textContent = paymentMethodText;
    document.getElementById('confirmation-shipping-method').textContent = shippingMethodText;
    document.getElementById('confirmation-email').textContent = email;
    
    // Update shipping address
    document.getElementById('confirmation-address').innerHTML = `
        ${firstName} ${lastName}<br>
        ${address}<br>
        ${city}, ${state} ${postalCode}<br>
        ${country}<br>
        ${phone}
    `;
    
    // Update order items
    const confirmationItems = document.getElementById('confirmation-items');
    if (confirmationItems) {
        confirmationItems.innerHTML = '';
        
        // Calculate subtotal
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const variantText = item.variants ? 
                Object.entries(item.variants).map(([key, value]) => `${key}: ${value}`).join(', ') : '';
            
            const itemHTML = `
                <div class="summary-cart-item">
                    <div class="summary-item">
                        <span>${item.name} ${variantText ? `(${variantText})` : ''} x ${item.quantity}</span>
                        <span>₦${itemTotal.toLocaleString()}</span>
                    </div>
                </div>
            `;
            
            confirmationItems.insertAdjacentHTML('beforeend', itemHTML);
        });
        
        // Get shipping cost
        let shipping = 2000; // Default shipping cost
        switch(shippingMethod) {
            case 'standard':
                shipping = 2000;
                break;
            case 'express':
                shipping = 5000;
                break;
            case 'same-day':
                shipping = 8000;
                break;
        }
        
        // Calculate tax
        const tax = Math.round(subtotal * 0.075); // 7.5% VAT
        
        // Calculate total
        let total = subtotal + shipping + tax;
        
        // Add POD fee if applicable
        if (paymentMethod === 'pay-on-delivery') {
            total += 1000;
            document.querySelectorAll('.pod-fee').forEach(el => el.style.display = 'flex');
        } else {
            document.querySelectorAll('.pod-fee').forEach(el => el.style.display = 'none');
        }
        
        // Update confirmation summary
        document.getElementById('confirmation-subtotal').textContent = `₦${subtotal.toLocaleString()}`;
        document.getElementById('confirmation-shipping').textContent = `₦${shipping.toLocaleString()}`;
        document.getElementById('confirmation-tax').textContent = `₦${tax.toLocaleString()}`;
        document.getElementById('confirmation-total').textContent = `₦${total.toLocaleString()}`;
    }
    
    // Clear cart after successful order
    localStorage.removeItem('kosenuelCart');
    
    // Update cart count in header
    updateCartCount([]);
}
