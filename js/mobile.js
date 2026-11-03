
  document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("search-toggle");
  const mobileSearchBar = document.getElementById("mobile-search-bar");
  const menuToggle = document.getElementById("menu-toggle");
  const menuIcon = document.getElementById("menu-icon");
  const mobileNav = document.getElementById("mobile-nav-container");
  const searchInputs = document.querySelectorAll(".input-container input");

  let productsData = [];

  fetch("./products.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      productsData = data;
    })
    .catch((err) => {
      console.error("Error loading products.json for search dropdown:", err);
    });

  if (searchToggle && mobileSearchBar) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      if (mobileNav && mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-open");
        if (menuIcon) {
          menuIcon.classList.remove("fa-xmark");
          menuIcon.classList.add("fa-bars");
        }
      }

      mobileSearchBar.classList.toggle("hidden");

      if (!mobileSearchBar.classList.contains("hidden")) {
        const mobileInput = mobileSearchBar.querySelector("input");
        if (mobileInput) mobileInput.focus();
      }
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      if (mobileSearchBar && !mobileSearchBar.classList.contains("hidden")) {
        mobileSearchBar.classList.add("hidden");
      }

      const isOpen = mobileNav.classList.toggle("is-open");

      if (menuIcon) {
        if (isOpen) {
          menuIcon.classList.remove("fa-bars");
          menuIcon.classList.add("fa-xmark");
        } else {
          menuIcon.classList.remove("fa-xmark");
          menuIcon.classList.add("fa-bars");
        }
      }
    });
  }

  searchInputs.forEach((input) => {
    const inputContainer = input.closest(".input-container");
    if (!inputContainer) return;

    inputContainer.style.position = "relative";

    let searchDropdown = inputContainer.querySelector(".search-dropdown");
    let searchResultsList = inputContainer.querySelector(".search-dropdown-content");

    if (!searchDropdown) {
      searchDropdown = document.createElement("div");
      searchDropdown.className = "search-dropdown hidden";

      searchResultsList = document.createElement("div");
      searchResultsList.className = "search-dropdown-content";

      searchDropdown.appendChild(searchResultsList);
      inputContainer.appendChild(searchDropdown);
    }

    input.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      searchInputs.forEach((otherInput) => {
        if (otherInput !== input) {
          otherInput.value = e.target.value;
        }
      });

      if (!query) {
        searchDropdown.classList.add("hidden");
        searchResultsList.innerHTML = "";
        return;
      }

      const matches = productsData.filter((product) => {
        const title = (product.name || product.title || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        return title.includes(query) || category.includes(query) || brand.includes(query);
      });

      renderSearchResults(matches, searchDropdown, searchResultsList);
    });

    input.addEventListener("focus", () => {
      if (input.value.trim() && searchResultsList.children.length > 0) {
        searchDropdown.classList.remove("hidden");
      }
    });
  });

  function renderSearchResults(items, searchDropdown, searchResultsList) {
    searchResultsList.innerHTML = "";

    if (items.length === 0) {
      searchResultsList.innerHTML = `<div class="search-no-results">No bikes found</div>`;
    } else {
      items.forEach((product) => {
        const itemEl = document.createElement("a");
        itemEl.classList.add("search-item");
        itemEl.href = `product.html?id=${product.id}`;

        itemEl.innerHTML = `
          <div class="search-item-left">
            <div class="search-image">
              <img src="${product.image || 'https://via.placeholder.com/36'}" alt="${product.name || product.title}" class="search-item-img" />
            </div>
            <div class="search-item-text">
              <span class="search-item-name">${product.name || product.title}</span>
              <span class="search-item-category">${product.category || ""}</span>
            </div>
          </div>
        `;

        searchResultsList.appendChild(itemEl);
      });
    }

    searchDropdown.classList.remove("hidden");
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-container")) {
      document.querySelectorAll(".search-dropdown").forEach((dropdown) => {
        dropdown.classList.add("hidden");
      });
    }
  });
  const filterBtn = document.getElementById("mobile-filter-btn");
  const closeBtn = document.getElementById("close-filter-btn");
  const filterSidebar = document.getElementById("filter-sidebar");
  const filterOverlay = document.getElementById("filter-overlay");
  const applyBtn = document.getElementById("apply-filters-btn");

  function openFilter() {
    filterSidebar.classList.add("is-open");
    filterOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden"; 
  }

  function closeFilter() {
    filterSidebar.classList.remove("is-open");
    filterOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  if (filterBtn) filterBtn.addEventListener("click", openFilter);
  if (closeBtn) closeBtn.addEventListener("click", closeFilter);
  if (filterOverlay) filterOverlay.addEventListener("click", closeFilter);

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeFilter();
      }
    });
  }
  const openBtn = document.getElementById("open-filter-btn");
  const sidebar = document.getElementById("filter-sidebar");
  const overlay = document.getElementById("filter-overlay");

  if (openBtn && sidebar && overlay) {
    openBtn.addEventListener("click", () => {
      sidebar.classList.add("is-open");
      overlay.classList.add("is-active");
    });
  }

  const closeDrawer = () => {
    if (sidebar) sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-active");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
});