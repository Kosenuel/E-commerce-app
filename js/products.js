/**
 * Kosenuel E-Commerce Website
 * Products JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize product-related components
    if (document.getElementById('featured-products-grid')) {
        loadFeaturedProducts();
    }
    
    if (document.getElementById('products-grid')) {
        loadProducts();
    }
    
    if (document.getElementById('product-detail-container')) {
        loadProductDetail();
    }
    
    if (document.getElementById('related-products-grid')) {
        loadRelatedProducts();
    }
});

/**
 * Load featured products on homepage
 */
function loadFeaturedProducts() {
    const featuredProductsGrid = document.getElementById('featured-products-grid');
    
    if (!featuredProductsGrid) return;
    
    // Show loading spinner
    featuredProductsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
    
    // Fetch products from API
    fetch('https://dummyjson.com/products?limit=8')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear loading spinner
            featuredProductsGrid.innerHTML = '';
            
            // Display products
            data.products.forEach(product => {
                // Convert price to Naira (multiply by 1500 as an example conversion rate)
                const priceInNaira = Math.round(product.price * 1500);
                
                // Calculate discount percentage
                const discountPercentage = Math.round(product.discountPercentage);
                
                // Create product card
                const productCard = `
                    <div class="product-card" data-id="${product.id}">
                        <div class="product-image">
                            <img src="${product.thumbnail}" alt="${product.title}">
                            ${discountPercentage > 0 ? `<span class="product-badge">-${discountPercentage}%</span>` : ''}
                        </div>
                        <div class="product-info">
                            <div class="product-category">${product.category}</div>
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-price">₦${priceInNaira.toLocaleString()}</div>
                            <div class="product-rating">
                                <div class="stars">
                                    ${generateStars(product.rating)}
                                </div>
                                <span class="rating-count">(${Math.round(product.rating * 10)})</span>
                            </div>
                            <div class="product-actions">
                                <button class="add-to-cart">Add to Cart</button>
                                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                
                featuredProductsGrid.insertAdjacentHTML('beforeend', productCard);
            });
            
            // Initialize wishlist buttons
            initWishlistButtons();
            
            // Initialize cart buttons for dynamically added products
            initCartButtons();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            featuredProductsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load products. Please try again later.</p>
                    <button class="btn btn-primary" onclick="loadFeaturedProducts()">Retry</button>
                </div>
            `;
        });
}

/**
 * Load products on products page
 */
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (!productsGrid) return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    // Set initial filter values based on URL parameters
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
    }
    
    // Show loading spinner
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
    
    // Build API URL based on filters
    let apiUrl = 'https://dummyjson.com/products?limit=20';
    
    if (categoryParam) {
        apiUrl = `https://dummyjson.com/products/category/${categoryParam}`;
    }
    
    if (searchParam) {
        apiUrl = `https://dummyjson.com/products/search?q=${searchParam}`;
    }
    
    // Fetch products from API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store products for filtering
            let products = data.products;
            
            // Apply filters and sorting
            displayFilteredProducts(products);
            
            // Add event listeners to filters
            if (categoryFilter) {
                categoryFilter.addEventListener('change', function() {
                    if (this.value === 'all') {
                        // Reset to all products
                        fetch('https://dummyjson.com/products?limit=20')
                            .then(response => response.json())
                            .then(data => {
                                products = data.products;
                                displayFilteredProducts(products);
                            });
                    } else {
                        // Filter by category
                        fetch(`https://dummyjson.com/products/category/${this.value}`)
                            .then(response => response.json())
                            .then(data => {
                                products = data.products;
                                displayFilteredProducts(products);
                            });
                    }
                });
            }
            
            if (priceFilter) {
                priceFilter.addEventListener('change', function() {
                    displayFilteredProducts(products);
                });
            }
            
            if (sortBy) {
                sortBy.addEventListener('change', function() {
                    displayFilteredProducts(products);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load products. Please try again later.</p>
                    <button class="btn btn-primary" onclick="loadProducts()">Retry</button>
                </div>
            `;
        });
    
    /**
     * Display filtered and sorted products
     */
    function displayFilteredProducts(products) {
        // Apply price filter
        if (priceFilter && priceFilter.value !== 'all') {
            const priceRange = priceFilter.value.split('-');
            const minPrice = parseInt(priceRange[0]) || 0;
            const maxPrice = priceRange[1] ? parseInt(priceRange[1]) : Infinity;
            
            products = products.filter(product => {
                const priceInNaira = Math.round(product.price * 1500);
                return priceInNaira >= minPrice && priceInNaira <= maxPrice;
            });
        }
        
        // Apply sorting
        if (sortBy) {
            switch (sortBy.value) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    products.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    products.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                // Featured is default, no sorting needed
            }
        }
        
        // Clear products grid
        productsGrid.innerHTML = '';
        
        // Display filtered products
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <p>No products found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        products.forEach(product => {
            // Convert price to Naira
            const priceInNaira = Math.round(product.price * 1500);
            
            // Calculate discount percentage
            const discountPercentage = Math.round(product.discountPercentage);
            
            // Create product card
            const productCard = `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <a href="product-detail.html?id=${product.id}">
                            <img src="${product.thumbnail}" alt="${product.title}">
                            ${discountPercentage > 0 ? `<span class="product-badge">-${discountPercentage}%</span>` : ''}
                        </a>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">
                            <a href="product-detail.html?id=${product.id}">${product.title}</a>
                        </h3>
                        <div class="product-price">₦${priceInNaira.toLocaleString()}</div>
                        <div class="product-rating">
                            <div class="stars">
                                ${generateStars(product.rating)}
                            </div>
                            <span class="rating-count">(${Math.round(product.rating * 10)})</span>
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart">Add to Cart</button>
                            <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            productsGrid.insertAdjacentHTML('beforeend', productCard);
        });
        
        // Initialize wishlist buttons
        initWishlistButtons();
        
        // Initialize cart buttons for dynamically added products
        initCartButtons();
    }
}

/**
 * Load product detail
 */
function loadProductDetail() {
    const productDetailContainer = document.getElementById('product-detail-container');
    const productName = document.getElementById('product-name');
    const productCategory = document.getElementById('product-category');
    const descriptionTab = document.getElementById('description');
    const specificationsTab = document.getElementById('specifications');
    
    if (!productDetailContainer) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        productDetailContainer.innerHTML = `
            <div class="error-message">
                <p>Product not found. Please go back to the products page.</p>
                <a href="products.html" class="btn btn-primary">View All Products</a>
            </div>
        `;
        return;
    }
    
    // Show loading spinner
    productDetailContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading product details...</p>
        </div>
    `;
    
    // Fetch product from API
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => {
            // Convert price to Naira
            const priceInNaira = Math.round(product.price * 1500);
            
            // Update breadcrumb
            if (productName) {
                productName.textContent = product.title;
            }
            
            if (productCategory) {
                productCategory.querySelector('a').textContent = product.category;
                productCategory.querySelector('a').href = `products.html?category=${product.category}`;
            }
            
            // Create product gallery HTML
            const galleryHTML = `
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="${product.images[0]}" alt="${product.title}">
                    </div>
                    <div class="thumbnail-gallery">
                        ${product.images.map((image, index) => `
                            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                                <img src="${image}" alt="${product.title} - Image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Create product info HTML
            const productInfoHTML = `
                <div class="product-info-detail">
                    <div class="product-category">${product.category}</div>
                    <h1 class="product-title">${product.title}</h1>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${Math.round(product.rating * 10)} reviews)</span>
                    </div>
                    <div class="product-price">₦${priceInNaira.toLocaleString()}</div>
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">Brand:</span>
                            <span>${product.brand}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Availability:</span>
                            <span>${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">SKU:</span>
                            <span>KOS-${product.id.toString().padStart(5, '0')}</span>
                        </div>
                    </div>
                    
                    <div class="product-variants">
                        <div class="variant-label">Color:</div>
                        <div class="color-options">
                            <div class="color-option active" style="background-color: #0A2647;" data-color="Navy Blue"></div>
                            <div class="color-option" style="background-color: #1E90FF;" data-color="Electric Blue"></div>
                            <div class="color-option" style="background-color: #E5E5E5;" data-color="Silver Gray"></div>
                            <div class="color-option" style="background-color: #FF7700;" data-color="Orange"></div>
                        </div>
                        
                        <div class="variant-label">Size:</div>
                        <div class="size-options">
                            <div class="size-option" data-size="S">S</div>
                            <div class="size-option active" data-size="M">M</div>
                            <div class="size-option" data-size="L">L</div>
                            <div class="size-option" data-size="XL">XL</div>
                        </div>
                    </div>
                    
                    <div class="quantity-selector">
                        <span class="quantity-label">Quantity:</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn">-</button>
                            <input type="text" class="quantity-input" value="1">
                            <button class="quantity-btn">+</button>
                        </div>
                    </div>
                    
                    <div class="product-actions-detail">
                        <button class="btn btn-primary add-to-cart-detail">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-primary buy-now">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                        <button class="wishlist-btn-detail">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-share">
                        <span class="share-label">Share:</span>
                        <div class="share-options">
                            <a href="#" class="share-option"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="share-option"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="share-option"><i class="fab fa-pinterest"></i></a>
                            <a href="#" class="share-option"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            `;
            
            // Update product detail container
            productDetailContainer.innerHTML = galleryHTML + productInfoHTML;
            
            // Set product ID on the container for cart functionality
            productDetailContainer.setAttribute('data-id', product.id);
            
            // Update tabs content
            if (descriptionTab) {
                descriptionTab.innerHTML = `
                    <h3>Product Description</h3>
                    <p>${product.description}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
                    <p>Features:</p>
                    <ul>
                        <li>High-quality materials</li>
                        <li>Durable construction</li>
                        <li>Sleek design</li>
                        <li>User-friendly interface</li>
                        <li>Advanced technology</li>
                    </ul>
                `;
            }
            
            if (specificationsTab) {
                specificationsTab.innerHTML = `
                    <h3>Technical Specifications</h3>
                    <table class="specs-table">
                        <tbody>
                            <tr>
                                <th>Brand</th>
                                <td>${product.brand}</td>
                            </tr>
                            <tr>
                                <th>Model</th>
                                <td>${product.title}</td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>${product.category}</td>
                            </tr>
                            <tr>
                                <th>Stock</th>
                                <td>${product.stock} units</td>
                            </tr>
                            <tr>
                                <th>Rating</th>
                                <td>${product.rating} out of 5</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            }
            
            // Initialize thumbnail gallery
            initThumbnailGallery();
            
            // Initialize color and size options
            initVariantOptions();
            
            // Initialize quantity controls
            initQuantityControls();
            
            // Initialize cart buttons for product detail page
            initCartDetailButtons();
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            productDetailContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load product details. Please try again later.</p>
                    <button class="btn btn-primary" onclick="loadProductDetail()">Retry</button>
                </div>
            `;
        });
}

/**
 * Load related products
 */
function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    
    if (!relatedProductsGrid) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;
    
    // Show loading spinner
    relatedProductsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading related products...</p>
        </div>
    `;
    
    // First get the current product to determine its category
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Then fetch products in the same category
            return fetch(`https://dummyjson.com/products/category/${product.category}`);
        })
        .then(response => response.json())
        .then(data => {
            // Filter out the current product and limit to 4 products
            const relatedProducts = data.products
                .filter(product => product.id.toString() !== productId)
                .slice(0, 4);
            
            // Clear loading spinner
            relatedProductsGrid.innerHTML = '';
            
            // Display related products
            relatedProducts.forEach(product => {
                // Convert price to Naira
                const priceInNaira = Math.round(product.price * 1500);
                
                // Create product card
                const productCard = `
                    <div class="product-card" data-id="${product.id}">
                        <div class="product-image">
                            <a href="product-detail.html?id=${product.id}">
                                <img src="${product.thumbnail}" alt="${product.title}">
                            </a>
                        </div>
                        <div class="product-info">
                            <div class="product-category">${product.category}</div>
                            <h3 class="product-title">
                                <a href="product-detail.html?id=${product.id}">${product.title}</a>
                            </h3>
                            <div class="product-price">₦${priceInNaira.toLocaleString()}</div>
                            <div class="product-rating">
                                <div class="stars">
                                    ${generateStars(product.rating)}
                                </div>
                                <span class="rating-count">(${Math.round(product.rating * 10)})</span>
                            </div>
                            <div class="product-actions">
                                <button class="add-to-cart">Add to Cart</button>
                                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                
                relatedProductsGrid.insertAdjacentHTML('beforeend', productCard);
            });
            
            // Initialize wishlist buttons
            initWishlistButtons();
            
            // Initialize cart buttons for dynamically added products
            initCartButtons();
        })
        .catch(error => {
            console.error('Error fetching related products:', error);
            relatedProductsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load related products.</p>
                </div>
            `;
        });
}

/**
 * Initialize cart buttons for product cards
 */
function initCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                const productId = productCard.dataset.id;
                const productName = productCard.querySelector('.product-title').textContent.trim();
                const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₦', '').replace(/,/g, ''));
                const productImage = productCard.querySelector('.product-image img').src;
                
                // Add to cart
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
                
                // Show confirmation
                showNotification('Product added to cart!');
            });
        });
    }
}

/**
 * Initialize cart buttons for product detail page
 */
function initCartDetailButtons() {
    const addToCartDetail = document.querySelector('.add-to-cart-detail');
    const buyNowBtn = document.querySelector('.buy-now');
    
    if (addToCartDetail) {
        addToCartDetail.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info from detail page
            const productDetail = document.getElementById('product-detail-container');
            if (!productDetail) return;
            
            const productId = productDetail.getAttribute('data-id');
            const productName = productDetail.querySelector('.product-title').textContent.trim();
            const productPrice = parseFloat(productDetail.querySelector('.product-price').textContent.replace('₦', '').replace(/,/g, ''));
            const productImage = document.querySelector('.main-image img').src;
            
            // Get quantity
            const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
            
            // Get selected variants if available
            let variants = {};
            
            const selectedColor = document.querySelector('.color-option.active');
            if (selectedColor) {
                variants.color = selectedColor.dataset.color;
            }
            
            const selectedSize = document.querySelector('.size-option.active');
            if (selectedSize) {
                variants.size = selectedSize.dataset.size;
            }
            
            // Add to cart
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity,
                variants: variants
            });
            
            // Show confirmation
            showNotification('Product added to cart!');
        });
    }
    
    if (buyNowBtn && addToCartDetail) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // First add to cart
            addToCartDetail.click();
            
            // Then redirect to checkout
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
}

/**
 * Initialize quantity controls
 */
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.quantity-controls');
    
    if (quantityControls.length > 0) {
        quantityControls.forEach(control => {
            const minusBtn = control.querySelector('.quantity-btn:first-child');
            const plusBtn = control.querySelector('.quantity-btn:last-child');
            const input = control.querySelector('.quantity-input');
            
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                if (value > 1) {
                    input.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                input.value = value + 1;
            });
        });
    }
}

/**
 * Initialize thumbnail gallery
 */
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                mainImage.src = this.dataset.image;
            });
        });
    }
}

/**
 * Initialize variant options
 */
function initVariantOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    const sizeOptions = document.querySelectorAll('.size-option');
    
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

/**
 * Initialize wishlist buttons
 */
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn, .wishlist-btn-detail');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Product added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Product removed from wishlist!');
            }
        });
    });
}

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

/**
 * Add product to cart
 */
function addToCart(product) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.variants || {}) === JSON.stringify(product.variants || {})
    );
    
    if (existingProductIndex !== -1) {
        // Update quantity
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Add new product
        cart.push(product);
    }
    
    // Save cart
    localStorage.setItem('kosenuelCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart);
}

/**
 * Update cart count in header
 */
function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    
    if (!cart) {
        cart = JSON.parse(localStorage.getItem('kosenuelCart')) || [];
    }
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animate the cart icon
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 300);
    }
}

/**
 * Show notification
 */
function showNotification(message) {
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
                background-color: var(--color-navy);
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-out forwards;
                display: flex;
                align-items: center;
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
            .pulse {
                animation: pulse 0.3s ease-out;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
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
