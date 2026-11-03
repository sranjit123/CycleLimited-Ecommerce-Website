document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".input-container input");
  const inputContainer = document.querySelector(".input-container");

  if (!searchInput || !inputContainer) {
    console.error("Search input or .input-container element not found in HTML.");
    return;
  }

  inputContainer.style.position = "relative";

  let searchDropdown = document.getElementById("search-dropdown");
  let searchResultsList = document.getElementById("search-results-list");

  if (!searchDropdown) {
    searchDropdown = document.createElement("div");
    searchDropdown.id = "search-dropdown";
    searchDropdown.className = "search-dropdown hidden";

    searchResultsList = document.createElement("div");
    searchResultsList.id = "search-results-list";
    searchResultsList.className = "search-dropdown-content";

    searchDropdown.appendChild(searchResultsList);
    inputContainer.appendChild(searchDropdown);
  }

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

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      searchDropdown.classList.add("hidden");
      searchResultsList.innerHTML = "";
      return;
    }

    const matches = productsData.filter((product) => {
      const title = (product.name || "").toLowerCase();
      const category = (product.category || "").toLowerCase();
      const brand = (product.brand || "").toLowerCase();
      return title.includes(query) || category.includes(query) || brand.includes(query);
    });

    renderSearchResults(matches);
  });

  function renderSearchResults(items) {
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
              <img src="${product.image}" alt="${product.name || product.title}" class="search-item-img" />
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
    if (!inputContainer.contains(e.target)) {
      searchDropdown.classList.add("hidden");
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim() && searchResultsList.children.length > 0) {
      searchDropdown.classList.remove("hidden");
    }
  });
});