document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".cart-icon");
  const cart = document.querySelector(".cart");
  const cartClose = document.querySelector("#cart-close");
  const cartContent = document.querySelector(".cart-content");
  const btnBuy = document.querySelector(".btn-buy");

  const formatCurrency = (amount) => {
    return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
  };

  const parsePrice = (val) => {
    if (typeof val === "number") {
      if (isNaN(val) || val <= 0) return 0;
      if (val < 100 && val > 0) return Math.round(val * 100000);
      return Math.round(val);
    }
    if (!val) return 0;

    let str = String(val).trim();
    const digitsOnly = str.replace(/[^0-9]/g, "");
    let parsedInt = parseInt(digitsOnly, 10) || 0;

    if (str.includes(".00") && digitsOnly.endsWith("00")) {
      parsedInt = parsedInt / 100;
    }

    return parsedInt;
  };

  const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));

  const getUserIdentifier = () => {
    const user = getCurrentUser();
    return user ? (user.email || user.id || user.username || null) : null;
  };

  const getAllCarts = () => JSON.parse(localStorage.getItem("carts")) || {};

  const getCurrentUserCart = () => {
    const userIdentifier = getUserIdentifier();
    if (!userIdentifier) return [];
    return getAllCarts()[userIdentifier] || [];
  };

  const saveCartToStorage = () => {
    const userIdentifier = getUserIdentifier();
    if (!userIdentifier || !cartContent) return;

    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    const updatedCart = [];

    cartBoxes.forEach((cartBox) => {
      const title = cartBox.querySelector(".cart-product-title")?.textContent.trim() || "";
      const category = cartBox.querySelector(".cart-product-category")?.textContent.trim() || "";
      const unitPrice = parsePrice(cartBox.querySelector(".cart-price")?.dataset.unitPrice);
      const imgSrc = cartBox.querySelector("img")?.src || "";
      const quantity = parseInt(cartBox.querySelector(".number")?.textContent, 10) || 1;

      updatedCart.push({
        title,
        category,
        price: unitPrice,
        imgSrc,
        quantity
      });
    });

    const allCarts = getAllCarts();
    allCarts[userIdentifier] = updatedCart;
    localStorage.setItem("carts", JSON.stringify(allCarts));
  };

  if (cartIcon && cart) {
    cartIcon.addEventListener("click", () => {
      if (!getUserIdentifier()) {
        window.location.href = "login.html";
        return;
      }
      cart.classList.add("active");
    });
  }

  if (cartClose && cart) {
    cartClose.addEventListener("click", () => cart.classList.remove("active"));
  }

  if (btnBuy) {
    btnBuy.addEventListener("click", (e) => {
      e.preventDefault();
      if (!getUserIdentifier()) {
        window.location.href = "login.html";
        return;
      }
      const cartBoxes = cartContent ? cartContent.querySelectorAll(".cart-box") : [];
      if (cartBoxes.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      window.location.href = "checkout.html";
    });
  }

  const updateCartCount = () => {
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    if (!cartItemCountBadge || !cartContent) return;

    let totalItems = 0;
    cartContent.querySelectorAll(".cart-box").forEach((cartBox) => {
      const quantity = parseInt(cartBox.querySelector(".number")?.textContent, 10);
      if (!isNaN(quantity)) totalItems += quantity;
    });

    if (totalItems > 0) {
      cartItemCountBadge.style.visibility = "visible";
      cartItemCountBadge.textContent = totalItems;
    } else {
      cartItemCountBadge.style.visibility = "hidden";
      cartItemCountBadge.textContent = "";
    }
  };

  const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    if (!totalPriceElement || !cartContent) return;

    let total = 0;
    cartContent.querySelectorAll(".cart-box").forEach((cartBox) => {
      const unitPrice = parsePrice(cartBox.querySelector(".cart-price")?.dataset.unitPrice);
      const quantity = parseInt(cartBox.querySelector(".number")?.textContent, 10) || 1;
      total += unitPrice * quantity;
    });

    totalPriceElement.textContent = formatCurrency(total);
  };

  const renderEmptyCartMessage = () => {
    if (!cartContent) return;
    const userIdentifier = getUserIdentifier();
    if (!userIdentifier) {
      cartContent.innerHTML = '<p class="empty-cart-msg">Log In to view cart</p>';
    } else {
      cartContent.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    }
  };

  const createCartBoxElement = (item) => {
    if (!cartContent) return;

    const emptyMsg = cartContent.querySelector(".empty-cart-msg");
    if (emptyMsg) {
      emptyMsg.remove();
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    const unitPrice = parsePrice(item.price);
    const quantity = item.quantity || 1;
    const lineTotal = unitPrice * quantity;

    cartBox.innerHTML = `
      <div class="cart-top">
        <div class="cart-image">
          <img src="${item.imgSrc}" alt="${item.title}" class="cart-img">
        </div>
        <div class="cart-detail">
          <h2 class="cart-product-title">${item.title}</h2>
          <h5 class="cart-product-category">${item.category || ""}</h5>
        </div>
        <div class="cart-remove-icon">
          <i class="fa-solid fa-trash-can cart-remove"></i>
        </div>
      </div>
      <div class="cart-bottom">
        <div class="cart-quantity">
          <button class="decrement" style="color: ${quantity > 1 ? "#333" : "#999"};">-</button>
          <span class="number">${quantity}</span>
          <button class="increment">+</button>
        </div>
        <div class="cart-product-price">
          <span class="cart-price" data-unit-price="${unitPrice}">${formatCurrency(lineTotal)}</span>
        </div>
      </div>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      cartBox.remove();

      if (cartContent.querySelectorAll(".cart-box").length === 0) {
        renderEmptyCartMessage();
      }

      updateTotalPrice();
      updateCartCount();
      saveCartToStorage();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
      const numberElement = cartBox.querySelector(".number");
      const decrementButton = cartBox.querySelector(".decrement");
      const priceElement = cartBox.querySelector(".cart-price");

      let currentQty = parseInt(numberElement.textContent, 10) || 1;
      const baseUnitPrice = parsePrice(priceElement.dataset.unitPrice);

      if (event.target.classList.contains("decrement") && currentQty > 1) {
        currentQty--;
      } else if (event.target.classList.contains("increment")) {
        currentQty++;
      }

      decrementButton.style.color = currentQty > 1 ? "#333" : "#999";
      numberElement.textContent = currentQty;

      priceElement.textContent = formatCurrency(baseUnitPrice * currentQty);

      updateTotalPrice();
      updateCartCount();
      saveCartToStorage();
    });
  };

  const loadSavedCart = () => {
    if (!cartContent) return;
    const userIdentifier = getUserIdentifier();

    if (!userIdentifier) {
      renderEmptyCartMessage();
      updateTotalPrice();
      updateCartCount();
      return;
    }

    const cartData = getCurrentUserCart();
    cartContent.innerHTML = "";

    if (!cartData || cartData.length === 0) {
      renderEmptyCartMessage();
    } else {
      cartData.forEach((item) => createCartBoxElement(item));
    }

    updateTotalPrice();
    updateCartCount();
  };

  window.addToCart = (productInput, quantityToAdd = 1) => {
    if (!getUserIdentifier()) {
      window.location.href = "login.html";
      return;
    }

    let productTitle = "";
    let rawPrice = 0;
    let imgSrc = "";
    let productCategory = "";
    const addQty = parseInt(quantityToAdd, 10) || 1;

    if (productInput instanceof HTMLElement) {
      const productImg = productInput.querySelector("img");
      const productTitleEl = productInput.querySelector(".product-title");
      const priceEl = productInput.querySelector(".bold-price") || productInput.querySelector(".product-price");
      const categoryEl = productInput.querySelector(".product-category");

      if (!productImg || !productTitleEl || !priceEl) return;

      productTitle = productTitleEl.textContent.trim();
      rawPrice = parsePrice(priceEl.dataset.price || priceEl.textContent);
      imgSrc = productImg.src;
      productCategory = categoryEl ? categoryEl.textContent.trim() : "";
    } else if (typeof productInput === "object") {
      productTitle = productInput.name || productInput.title;
      rawPrice = parsePrice(productInput.price);
      imgSrc = productInput.image;
      productCategory = productInput.category || "";
    }

    const existingCartItem = Array.from(
      cartContent.querySelectorAll(".cart-box")
    ).find(
      (item) => item.querySelector(".cart-product-title")?.textContent.trim() === productTitle
    );

    if (existingCartItem) {
      const quantityElement = existingCartItem.querySelector(".number");
      const priceElement = existingCartItem.querySelector(".cart-price");
      const currentQty = parseInt(quantityElement.textContent, 10) || 1;
      const newQty = currentQty + addQty;

      quantityElement.textContent = newQty;

      const baseUnitPrice = parsePrice(priceElement.dataset.unitPrice);
      priceElement.textContent = formatCurrency(baseUnitPrice * newQty);

      const decrementBtn = existingCartItem.querySelector(".decrement");
      if (decrementBtn) decrementBtn.style.color = "#333";
    } else {
      createCartBoxElement({
        title: productTitle,
        category: productCategory,
        price: rawPrice,
        imgSrc: imgSrc,
        quantity: addQty
      });
    }

    updateTotalPrice();
    updateCartCount();
    saveCartToStorage();

    if (cart) cart.classList.add("active");
  };

  loadSavedCart();
});