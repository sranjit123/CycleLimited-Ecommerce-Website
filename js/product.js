document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = Number(urlParams.get("id"));

  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load products.");
      }
      return response.json();
    })
    .then((products) => {
      const product = products.find((product) => product.id === productId);

      if (!product) {
        document.body.innerHTML = `<h1>Product not found</h1>`;
        return;
      }

      document.getElementById("product-image").src = product.image;
      document.getElementById("product-image").alt = product.name;
      document.getElementById("product-name").textContent = product.name;
      document.getElementById("product-category").textContent = product.category;
      document.getElementById("product-price").textContent = `Rs. ${product.price.toFixed(2)}`;
      document.getElementById("product-description").textContent = product.description;
      document.getElementById("breadcrumb-product").textContent = product.name;
      document.getElementById("meta-category").textContent = product.category;

      let quantity = 1;
      const quantityDisplay = document.getElementById("quantity");

      document.getElementById("increase-btn").addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
      });

      document.getElementById("decrease-btn").addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantityDisplay.textContent = quantity;
        }
      });
      document.getElementById("add-to-cart").addEventListener("click", () => {
        addToCart(product, quantity); 
      });
    })
    
    .catch((error) => {
      console.error(error);
    });
});