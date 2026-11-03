document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".filter-sidebar");
  const productGrid = document.getElementById("product-grid");

  sidebar.addEventListener("change", applyFilters);

  function applyFilters() {
    const selectedCategoryEls = document.querySelectorAll(
      'input[name="category"]:checked'
    );
    const selectedSizeEls = document.querySelectorAll(
      'input[name="size"]:checked'
    );
    const selectedBrandEls = document.querySelectorAll(
      'input[name="brand"]:checked'
    );

    const activeCategories = Array.from(selectedCategoryEls).map((cb) => cb.value.toLowerCase());
    const activeSizes = Array.from(selectedSizeEls).map((cb) => cb.value.toLowerCase());
    const activeBrands = Array.from(selectedBrandEls).map((cb) => cb.value.toLowerCase());

    const cards = productGrid.querySelectorAll(".product-card");

    cards.forEach((card) => {
      const cardCategory = (card.dataset.category || "").toLowerCase();
      const cardSize = (card.dataset.size || "").toLowerCase();
      const cardBrand = (card.dataset.brand || "").toLowerCase();

      const matchCategory =
        activeCategories.length === 0 || activeCategories.includes(cardCategory);
      const matchSize =
        activeSizes.length === 0 || activeSizes.includes(cardSize);
      const matchBrand =
        activeBrands.length === 0 || activeBrands.includes(cardBrand);

      if (matchCategory && matchSize && matchBrand) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }
});