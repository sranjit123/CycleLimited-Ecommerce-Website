const sortGroup = document.querySelector(".sort-group");
const sortBtn = document.querySelector(".sort-btn");
const selectedValue = document.querySelector(".selected-value");
const icon = sortBtn.querySelector("i"); 

let sortSelect = "featured";

sortBtn.addEventListener("click", () => {
  sortGroup.classList.toggle("open");
  if (sortGroup.classList.contains('open')) {
    icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
  } else {
    icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
  }
});

sortGroup.addEventListener('click', (event) => {
  if (event.target.matches('.option')) {
    const option = event.target;
    selectedValue.textContent = option.textContent;
    sortSelect = option.dataset.value;
    sortGroup.classList.remove('open');
    icon.classList.replace('fa-chevron-up', 'fa-chevron-down'); 
    filterAndRenderProducts(true); 
  }
});


document.addEventListener("click", (event) => {
  if (!sortGroup.contains(event.target)) {
    sortGroup.classList.remove("open");
  }
});

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8; 

function applyUrlParamsOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get("category")?.toLowerCase();
  const urlBrand = urlParams.get("brand")?.toLowerCase();
  const urlSize = urlParams.get("size")?.toLowerCase();

  document
    .querySelectorAll('.filter-sidebar input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
    });

  if (urlCategory) {
    const categoryCb = document.querySelector(
      `input[name="category"][value="${urlCategory}" i]`,
    );
    if (categoryCb) categoryCb.checked = true;
  }

  if (urlBrand) {
    const brandCb = document.querySelector(
      `input[name="brand"][value="${urlBrand}" i]`,
    );
    if (brandCb) brandCb.checked = true;
  }

  if (urlSize) {
    const sizeCb = document.querySelector(
      `input[name="size"][value="${urlSize}" i]`,
    );
    if (sizeCb) sizeCb.checked = true;
  }
}

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allProducts = await response.json();

    applyUrlParamsOnLoad();
    filterAndRenderProducts();
  } catch (error) {
    console.error("Error fetching product data:", error);
    const container = document.getElementById("product-grid");
    if (container) {
      container.innerHTML =
        "<p>Failed to load products. Please try again later.</p>";
    }
  }
}

function filterAndRenderProducts(resetPage = true) {
  if (resetPage) {
    currentPage = 1;
  }

  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked'),
  ).map((cb) => cb.value.toLowerCase());

  const selectedSizes = Array.from(
    document.querySelectorAll('input[name="size"]:checked'),
  ).map((cb) => cb.value.toLowerCase());

  const selectedBrands = Array.from(
    document.querySelectorAll('input[name="brand"]:checked'),
  ).map((cb) => cb.value.toLowerCase());

  const minPriceInput =
    parseFloat(
      document.querySelector('.price-inputs input[placeholder="Min"]')?.value,
    ) || 0;
  const maxPriceInput =
    parseFloat(
      document.querySelector('.price-inputs input[placeholder="Max"]')?.value,
    ) || Infinity;

  let filtered = allProducts.filter((product) => {
    const productCategory = (product.category || "").toLowerCase();
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(productCategory);

    const productSize = (product.size || "").toLowerCase();
    const matchesSize =
      selectedSizes.length === 0 || selectedSizes.includes(productSize);

    const productBrand = (product.brand || "").toLowerCase();
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(productBrand);

    const matchesPrice =
      product.price >= minPriceInput && product.price <= maxPriceInput;

    return (
      matchesCategory &&
      matchesSize &&
      matchesBrand &&
      matchesPrice
    );
  });

  if (sortSelect === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortSelect === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortSelect === "newest") {
    filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  displayProducts(paginatedProducts);
  renderPaginationControls(filtered.length);
}

function displayProducts(products) {
  const container = document.getElementById("product-grid");
  if (!container) return;

  container.innerHTML = ""; 

  if (products.length === 0) {
    container.innerHTML =
      '<p class="no-products">No products found matching your criteria.</p>';
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.dataset.category = product.category || "";
    card.dataset.size = product.size || "";
    card.dataset.brand = product.brand || "";

    card.innerHTML = `
      <div class='img-div'>
        <img src="${product.image}" alt="${product.name || product.title}">
      </div>
      <div class='text-div'>
          <div class='text-text-div'>
            <span class="product-category">${product.category}</span>
            <h2 class="product-title">${product.name || product.title}</h2>
          </div>
          <div class='price-div'>    
            <p class="product-price"><s>Rs. ${(product.price + 10000)}</s></p>
            <p class="product-price bold-price">Rs. ${product.price.toLocaleString("en-IN")}</p>
          </div>
          <div class='button-div'>
            <button class="add-to-cart-btn">
          Add to Cart
        </button>
          </div>
      </div>
    `;
    
    const imgDiv = card.querySelector(".img-div");
    imgDiv.addEventListener("click", function () {
      window.location.href = `product.html?id=${product.id}`;
    });

    const cartButton = card.querySelector(".add-to-cart-btn");
    cartButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (typeof window.addToCart === "function") {
        window.addToCart(card);
      }
    });

    container.appendChild(card);
  });
}

function renderPaginationControls(totalFilteredItems) {
  let paginationContainer = document.getElementById("pagination-container");

  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-container";
    paginationContainer.className = "pagination-container";

    const mainDiv = document.querySelector(".main-div");
    if (mainDiv) {
      mainDiv.appendChild(paginationContainer);
    }
  }

  paginationContainer.innerHTML = ""; 

  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  if (totalPages <= 1) return; 

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i> Previous';
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      filterAndRenderProducts(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(prevBtn);

  const numbersContainer = document.createElement("div");
  numbersContainer.className = "page-numbers";

  for (let i = 1; i <= totalPages; i++) {
    const numBtn = document.createElement("button");
    numBtn.className = `num-btn ${i === currentPage ? "active" : ""}`;
    numBtn.textContent = i;
    numBtn.addEventListener("click", () => {
      currentPage = i;
      filterAndRenderProducts(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    numbersContainer.appendChild(numBtn);
  }
  paginationContainer.appendChild(numbersContainer);

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = 'Next <i class="fa-solid fa-chevron-right"></i>';
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      filterAndRenderProducts(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  paginationContainer.appendChild(nextBtn);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  const priceDropdown = document.querySelector(".filter-toolbar-dropdown");
  const priceBtn = document.querySelector(".filter-btn");
  const priceApplyBtn = document.querySelector(".price-popover .apply-btn");

  priceBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    priceDropdown?.classList.toggle("is-active");
  });

  priceApplyBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    filterAndRenderProducts(true);
    priceDropdown?.classList.remove("is-active");
  });

  document.addEventListener("click", (e) => {
    if (priceDropdown && !priceDropdown.contains(e.target)) {
      priceDropdown.classList.remove("is-active");
    }
  });

  document
    .getElementById("apply-filters-btn")
    ?.addEventListener("click", () => filterAndRenderProducts(true));
});