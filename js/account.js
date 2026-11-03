document.addEventListener("DOMContentLoaded", () => {
  const currentUser = loadAndSyncCurrentUser();
  if (!currentUser) return;

  renderUserProfile(currentUser);
  renderUserAddress(currentUser);
  renderOrders(currentUser.orders || []);

  setupProfileEdit(currentUser);
  setupAddressEdit(currentUser);
  setupLogout();
});

function loadAndSyncCurrentUser() {
  const storedUserRaw = localStorage.getItem("currentUser");
  if (!storedUserRaw) {
    window.location.href = "login.html";
    return null;
  }

  let currentUser = JSON.parse(storedUserRaw);
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find((u) => u.email === currentUser.email);
  if (matchedUser) {
    currentUser = matchedUser;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  return currentUser;
}

function renderUserProfile(user) {
  const firstNameEl = document.getElementById("first-name");
  const lastNameEl = document.getElementById("last-name");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");

  if (firstNameEl) firstNameEl.textContent = user.firstName || user.username || "-";
  if (lastNameEl) lastNameEl.textContent = user.lastName || "-";
  if (emailEl) emailEl.textContent = user.email || "-";
  if (phoneEl) phoneEl.textContent = user.phone || user.phoneNumber || "Not added";
}

function renderUserAddress(user) {
  const addressDisplay = document.getElementById("address-display");
  const editAddressBtn = document.getElementById("edit-address-btn");
  if (!addressDisplay) return;

  if (user.address) {
    if (editAddressBtn) editAddressBtn.textContent = "Edit Address";

    if (typeof user.address === "string") {
      addressDisplay.innerHTML = `<p style="margin: 0; color: #333;">${user.address}</p>`;
    } else if (typeof user.address === "object") {
      const { street, city, state, postalCode, country } = user.address;
      const parts = [street, city, state, postalCode, country].filter(Boolean);

      if (parts.length > 0) {
        addressDisplay.innerHTML = `
          <p style="margin: 0; line-height: 1.6; color: #333;">
            <strong>${street || ""}</strong><br>
            ${city || ""}${state ? ", " + state : ""} ${postalCode || ""}<br>
            ${country || ""}
          </p>
        `;
      } else {
        addressDisplay.innerHTML = `<p class="empty-message">No address added yet.</p>`;
        if (editAddressBtn) editAddressBtn.textContent = "Add Address";
      }
    }
  } else {
    addressDisplay.innerHTML = `<p class="empty-message">No address added yet.</p>`;
    if (editAddressBtn) editAddressBtn.textContent = "Add Address";
  }
}

function renderOrders(orders) {
  const ordersContainer = document.getElementById("orders-container");
  if (!ordersContainer) return;

  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = `<p style="color: #777; padding: 15px 0;">No previous orders found.</p>`;
    return;
  }

  ordersContainer.innerHTML = orders
    .map((order) => {
      const orderId = order.orderId || order.id || Math.floor(100000 + Math.random() * 900000);
      const orderDate = order.date || "Recent";
      const items = order.items || [];
      const orderTotal = Number(order.total) || 0;

      return `
      <div class="order-card" style="border: 1px solid #e0e0e0; padding: 18px; margin-bottom: 20px; border-radius: 6px; background-color: #fff;">
        <div class="order-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <div>
            <strong style="font-size: 15px;">Order #${orderId}</strong>
            <span style="color: #777; font-size: 13px; margin-left: 10px;">Date: ${orderDate}</span>
          </div>
        </div>

        <div class="order-items-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px;">
          ${items
            .map((item) => {
              const itemImg = item.imgSrc || item.image || item.img || "images/placeholder.jpg";
              const itemTitle = item.title || item.name || "Product";
              const itemQty = item.quantity || 1;
              const itemPrice = Number(item.price) || 0;

              return `
              <div class="order-item-detail">
                <div class="order-item-left">
                  <img src="${itemImg}" alt="${itemTitle}" class="order-item-img" />
                  <div class="order-item-info">
                    <div class="order-item-title">${itemTitle}</div>
                    <div class="order-item-meta">Qty: ${itemQty} × Rs. ${itemPrice.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div class="order-item-price">
                  Rs. ${(itemPrice * itemQty).toLocaleString("en-IN")}
                </div>
              </div>
          `;
            })
            .join("")}
        </div>

        <div class="order-footer" style="text-align: right; border-top: 1px solid #eee; padding-top: 10px; display:flex; justify-content: space-between; font-weight: bold; font-size: 15px;">
        <div>Total :</div>
        <div>Rs. ${orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

function setupProfileEdit(currentUser) {
  const editBtn = document.getElementById("edit-profile-btn");
  const cancelBtn = document.getElementById("cancel-profile-btn");
  const form = document.getElementById("profile-form");

  if (!editBtn || !form) return;

  editBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
    document.getElementById("edit-first-name").value = currentUser.firstName || "";
    document.getElementById("edit-last-name").value = currentUser.lastName || "";
    document.getElementById("edit-phone").value = currentUser.phone || currentUser.phoneNumber || "";
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.classList.add("hidden");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentUser.firstName = document.getElementById("edit-first-name").value.trim();
    currentUser.lastName = document.getElementById("edit-last-name").value.trim();
    currentUser.phone = document.getElementById("edit-phone").value.trim();

    saveUserData(currentUser);
    renderUserProfile(currentUser);
    form.classList.add("hidden");
  });
}

function setupAddressEdit(currentUser) {
  const editBtn = document.getElementById("edit-address-btn");
  const cancelBtn = document.getElementById("cancel-address-btn");
  const form = document.getElementById("address-form");

  if (!editBtn || !form) return;

  editBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
    const addr = currentUser.address || {};
    document.getElementById("street").value = addr.street || (typeof addr === "string" ? addr : "");
    document.getElementById("city").value = addr.city || "";
    document.getElementById("state").value = addr.state || "";
    document.getElementById("postal-code").value = addr.postalCode || addr.zip || "";
    document.getElementById("country").value = addr.country || "Nepal";
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.classList.add("hidden");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentUser.address = {
      street: document.getElementById("street").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      postalCode: document.getElementById("postal-code").value.trim(),
      country: document.getElementById("country").value.trim(),
    };

    saveUserData(currentUser);
    renderUserAddress(currentUser);
    form.classList.add("hidden");
  });
}

function saveUserData(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const uIndex = users.findIndex((u) => u.email === user.email);
  if (uIndex !== -1) {
    users[uIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
}