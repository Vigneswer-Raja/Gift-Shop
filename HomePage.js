// HomePage.js

// Countdown Timer for New Year (15 Oct 2024)
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

const newYears = "15 Oct 2024";

function countdown() {
    const newYearsDate = new Date(newYears);
    const currentDate = new Date();

    const totalSeconds = (newYearsDate - currentDate) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Initial call
countdown();

setInterval(countdown, 1000);

// Firebase Firestore configuration
const apiKey = "AIzaSyC0Iw28uh92DIAigj16FSZzfb2VDsUN6ds"; // Your Firebase API key
const projectId = "giftshop-32f9f";
const baseFirestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

// Function to fetch products by category
async function fetchProductsByCategory(catID) {
    try {
        const response = await fetch(`${baseFirestoreUrl}/products?key=${apiKey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the raw response to debug

        // Filter products by CatID
        const products = data.documents.filter(product => {
            return product.fields && product.fields.CatID && product.fields.CatID.stringValue === catID;
        });

        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to display products
function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        productContainer.innerHTML = '<p>No products found for this category.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-box');
        productElement.innerHTML = `
            <img alt="${product.fields.Title.stringValue}" src="${product.fields.ImageURL.stringValue}">
            <h3>${product.fields.Title.stringValue}</h3>
            <p>Price: $${product.fields.Price.doubleValue.toFixed(2)}</p>
            <p>${product.fields.Description.stringValue}</p>
            <p>Quantity: ${product.fields.Quantity.integerValue}</p>
            <a href="cart.html" class="cart-btn">
                <i class="fas fa-shopping-bag"></i> Add to Cart
            </a>
        `;
        productContainer.appendChild(productElement);
    });
}

// Function to handle category click
async function handleCategoryClick(event) {
    const selectedCategory = event.currentTarget.getAttribute('data-category');
    const categoryId = event.currentTarget.getAttribute('data-cat-id');

    const products = await fetchProductsByCategory(categoryId);
    displayProducts(products);
}

// Attach event listeners to category boxes
const categoryBoxes = document.querySelectorAll('.category-box');
categoryBoxes.forEach(box => {
    box.addEventListener('click', handleCategoryClick);
});

// Cart functionality from homee.js
const baseUrlCarts = `${baseFirestoreUrl}/carts`;
let cartCount = 0;
let currentUserId = localStorage.getItem('loggedInUserId');
let cart = [];

// Function to update the cart count on the UI
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cartCount;
}

// Fetch user cart
async function fetchUserCart() {
    if (!currentUserId) return [];

    try {
        const response = await fetch(`${baseUrlCarts}?key=${apiKey}`);
        const data = await response.json();

        if (data.documents) {
            return data.documents
                .map(doc => doc.fields)
                .filter(item => {
                    console.log(item)
                    // item.userId.stringValue === currentUserId
                });
        }

        return [];
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

// Add product to the cart
async function addToCart(ProductId) {
    const currentUser = firebase.auth().currentUser;
  
    if (currentUser) {
      const userId = currentUser.uid;
  
      // Fetch the product information from Firestore
      const productRef = db.collection('products').doc(ProductId);
      const productSnapshot = await productRef.get();
  
      if (productSnapshot.exists) {
        const productData = productSnapshot.data();
        
        // Create the cart entry
        const cartItem = {
          userId: userId,
          ProductId: ProductId,
          Quantity: 1, // You can change this to allow selecting quantities
          productTitle: productData.Title, // Assuming Title is a field in product data
          Price: productData.Price, // Assuming Price is a field in product data
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
  
        // Add the cart item to the 'carts' collection
        db.collection('carts').add(cartItem)
          .then(() => {
            console.log("Item successfully added to cart");
          })
          .catch((error) => {
            console.error("Error adding item to cart: ", error);
          });
      } else {
        console.error("Product does not exist");
      }
    } else {
      console.log("No user is signed in");
    }
  }
  
  // Bind this function to your "Add to Cart" button
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
      const ProductId = this.getAttribute('data-product-id'); // Assume each button has a data attribute with product ID
      addToCart(ProductId);
    });
  });
  
// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch(`${baseFirestoreUrl}/products?key=${apiKey}`);
        const data = await response.json();

        cart = await fetchUserCart();
        displayProducts(data.documents);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
    const productShowcase = document.getElementById('product-showcase');
    const categorySelect = document.getElementById('category-select');

    fetchCategories();
    fetchProducts();
});

// Fetch categories from Firestore
async function fetchCategories() {
    try {
        const response = await fetch(`${baseFirestoreUrl}/Category?key=${apiKey}`);
        const data = await response.json();

        categorySelect.innerHTML = '<option value="">Select Category</option>';
        data.documents.forEach(doc => {
            const categoryName = doc.fields.Name.stringValue;
            const categoryId = doc.name.split('/').pop();

            const option = document.createElement('option');
            option.value = categoryId;
            option.textContent = categoryName;

            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}