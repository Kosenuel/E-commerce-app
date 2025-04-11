document.addEventListener("DOMContentLoaded", () => {
    const productDetailContainer = document.getElementById("product-detail-container");
    const productCategory = document.getElementById("product-category");
    const productName = document.getElementById("product-name");

    // Function to fetch product details
    async function fetchProductDetails() {
        const productId = new URLSearchParams(window.location.search).get("id");
        if (!productId) {
            productDetailContainer.innerHTML = "<p>Product ID is missing. Please select a valid product.</p>";
            return;
        }

        try {
            const response = await fetch(`https://dummyjson.com/products/${productId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product details.");
            }

            const product = await response.json();
            displayProductDetails(product);
        } catch (error) {
            productDetailContainer.innerHTML = `<p>Error loading product details: ${error.message}</p>`;
        }
    }

    // Function to display product details
    function displayProductDetails(product) {
        productCategory.innerHTML = `<a href="products.html?category=${product.category}">${product.category}</a>`;
        productName.textContent = product.title;

        productDetailContainer.innerHTML = `
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h1>${product.title}</h1>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        // Add event listener for the "Add to Cart" button
        const addToCartButton = document.querySelector(".add-to-cart");
        addToCartButton.addEventListener("click", () => {
            addToCart(product.id);
        });
    }

    // Function to handle adding product to cart
    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productExists = cart.find(item => item.id === productId);

        if (productExists) {
            productExists.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    }

    // Initialize product details loading
    fetchProductDetails();
});