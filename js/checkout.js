document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  renderCheckoutSummary(currentUser);
  if (currentUser) {
    autofillDeliveryDetails(currentUser);
  }
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) =>
      handleCheckoutSubmit(e, currentUser),
    );
  }
});

function getCartItems(currentUser) {
  if (!currentUser) {
    return [];
  }

  const userIdentifier =
    currentUser.email || currentUser.id || currentUser.username;

  if (!userIdentifier) {
    return [];
  }

  const allCarts = JSON.parse(localStorage.getItem("carts")) || {};

  return allCarts[userIdentifier] || [];
}

function renderCheckoutSummary(currentUser) {
  const cartItems = getCartItems(currentUser);
  const productListContainer = document.getElementById("checkout-product-list");
  const productCountEl = document.getElementById("product-count");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (!productListContainer) return;

  if (cartItems.length === 0) {
    productListContainer.innerHTML = `
      <p
        style="
          color: #ccc;
          text-align: center;
          padding: 20px 0;
        "
      >
        Your cart is empty.
      </p>
    `;

    if (productCountEl) {
      productCountEl.textContent = "00";
    }

    if (subtotalEl) {
      subtotalEl.textContent = "Rs. 0.00";
    }

    if (totalEl) {
      totalEl.textContent = "Rs. 0.00";
    }

    return;
  }
  let totalItemCount = 0;
  let grandTotal = 0;

  productListContainer.innerHTML = cartItems
    .map((item) => {
      const title = item.title || item.name || "Product";
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const imgSrc =
        item.imgSrc || item.image || item.img || "images/placeholder.jpg";
      const itemTotal = price * quantity;
      totalItemCount += quantity;
      grandTotal += itemTotal;

      return `
          <div class="checkout-product-item">

            <div class="left-div">

              <div class="image-container">

                <img
                  src="${imgSrc}"
                  alt="${title}"
                />

              </div>

              <div class="text-container">

                <h4>
                  ${title}
                </h4>

                <span>
                  Qty: ${quantity}
                  ×
                  Rs. ${price.toLocaleString()}
                </span>

              </div>

            </div>

            <div class="right-div">

              Rs. ${itemTotal.toLocaleString()}

            </div>

          </div>

          <hr
            style="
              border: none;
              height: 1px;
              background-color: #e5e5e5;
            "
          >
        `;
    })
    .join("");

  if (productCountEl) {
    productCountEl.textContent =
      totalItemCount < 10 ? `0${totalItemCount}` : totalItemCount;
  }

  const formattedTotal = `Rs. ${grandTotal.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

  if (subtotalEl) {
    subtotalEl.textContent = formattedTotal;
  }

  if (totalEl) {
    totalEl.textContent = formattedTotal;
  }
}

function autofillDeliveryDetails(user) {
  const setValue = (id, val) => {
    const el = document.getElementById(id);

    if (el && val) {
      el.value = val;
    }
  };

  setValue("firstName", user.firstName);
  setValue("lastName", user.lastName);
  setValue("phone", user.phone || user.phoneNumber);

  if (user.address) {
    if (typeof user.address === "string") {
      setValue("address", user.address);
    }

    else if (typeof user.address === "object") {
      setValue("address", user.address.street);
      setValue("city", user.address.city);
      setValue("state", user.address.state);
      setValue("zip", user.address.postalCode || user.address.zip);
      if (user.address.country) {
        setValue("country", user.address.country);
      }
    }
  }
}

function handleCheckoutSubmit(e, currentUser) {
  e.preventDefault();

  const firstName = document.getElementById("firstName")?.value.trim() || "";
  const lastName = document.getElementById("lastName")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const street = document.getElementById("address")?.value.trim() || "";
  const city = document.getElementById("city")?.value.trim() || "";
  const state = document.getElementById("state")?.value.trim() || "";
  const zip = document.getElementById("zip")?.value.trim() || "";
  const country = document.getElementById("country")?.value || "Nepal";
  const saveInfo = document.getElementById("saveInfo")?.checked;
  let isValid = true;
  const cityInput=document.getElementById("city");
  const firstNameInput=document.getElementById("firstName");
  const phoneInput = document.getElementById("phone");
  const streetInput = document.getElementById("address");
  const cityErrorMessage=document.getElementById("error-city");
  const addressErrorMessage=document.getElementById("error-address");
  const firstNameErrorMessage=document.getElementById("error-firstName");
  const phoneErrorMessage=document.getElementById("error-phone");


  cityInput.addEventListener("input", ()=>{
    cityErrorMessage.innerHTML="";
  });
  phoneInput.addEventListener("input", ()=>{
    phoneErrorMessage.innerHTML="";
  });
  streetInput.addEventListener("input", ()=>{
    addressErrorMessage.innerHTML="";
  });
  firstNameInput.addEventListener("input", ()=>{
    firstNameErrorMessage.innerHTML="";
  });


  const validateField = (id, condition) => {
    const errorEl = document.getElementById(`error-${id}`);

    if (!condition) {
      if (errorEl) {
        errorEl.style.display = "block";
      }

      isValid = false;
    } else {
      if (errorEl) {
        errorEl.style.display = "none";
      }
    }
  };

  validateField("firstName", firstName !== "");
  validateField("phone", phone !== "");
  validateField("address", street !== "");
  validateField("city", city !== "");

  if (!isValid) {
    return;
  }

  const cartItems = getCartItems(currentUser);

  if (cartItems.length === 0) {
    alert("Your cart is empty!");

    return;
  }

  let orderTotal = 0;

  const processedItems = cartItems.map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    orderTotal += price * quantity;
    return {
      title: item.title || item.name || "Product",
      price: price,
      imgSrc: item.imgSrc || item.image || item.img || "images/placeholder.jpg",
      quantity: quantity,
    };
  });

  const activeUser = currentUser || {
    email: "guest@checkout.com",
    orders: [],
  };

  if (saveInfo || !activeUser.firstName) {
    activeUser.firstName = firstName;
    activeUser.lastName = lastName;
    activeUser.phone = phone;
    activeUser.address = {
      street,
      city,
      state,
      postalCode: zip,
      country,
    };
  }

  const newOrder = {
    orderId: Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    items: processedItems,
    total: orderTotal,
  };
  if (!activeUser.orders) {
    activeUser.orders = [];
  }
  activeUser.orders.unshift(newOrder);
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const uIndex = users.findIndex((u) => u.email === currentUser.email);
    if (uIndex !== -1) {
      users[uIndex] = activeUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
    localStorage.setItem("currentUser", JSON.stringify(activeUser));
  }

  const userIdentifier =
    currentUser.email || currentUser.id || currentUser.username;
  const allCarts = JSON.parse(localStorage.getItem("carts")) || {};
  delete allCarts[userIdentifier];

  localStorage.setItem("carts", JSON.stringify(allCarts));
  const toast = document.getElementById("toast");

  if (toast) {
    toast.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = "account.html";
    }, 1500);
  } else {
    alert("Order placed successfully!");

    window.location.href = "account.html";
  }
}
