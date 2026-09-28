import { products } from "./products.js";

const tabsContainer = document.querySelector(".menu__tabs");
const productsContainer = document.querySelector(".menu__grid");
const mediaQueryRefreshBtn = window.matchMedia("(max-width: 1100px)");
const refresh = document.getElementById("refresh");
const POINT_WIDTH = 1100;
let isRefresh = false;
let selectedCategory = "coffee";

const changeRefreshStyle = (display = "") => (refresh.style.display = display);

tabsContainer.addEventListener("click", (event) => {
  const clickedBtn = event.target.closest(".tabs__btn");

  if (!clickedBtn) return;

  const currentActive = tabsContainer.querySelector(".tabs__btn.active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }

  clickedBtn.classList.add("active");
  if (selectedCategory !== clickedBtn.dataset.category) {
    isRefresh = false;
    changeRefreshStyle();
  }

  selectedCategory = clickedBtn.dataset.category;
  updateCategoryList(selectedCategory);
});

function updateCategoryList(selectedCategory) {
  productsContainer.innerHTML = "";
  let productsCurrentCategory = [];

  const productsAll = products.filter(
    (product) => product.category === selectedCategory,
  );

  productsCurrentCategory = productsAll;

  if (window.innerWidth <= POINT_WIDTH && !isRefresh) {
    productsCurrentCategory = productsAll.slice(0, 4);
  }

  productsCurrentCategory.forEach((product, index) => {
    const cardProduct = document.createElement("div");
    cardProduct.classList.add("menu__card", "product-card");

    cardProduct.innerHTML = `
          <div class="product-card__image-box">
            <img src="./assets/${product.category}-${index + 1}.jpg" alt="${product.name}" class="product-card__image">
          </div>
          <div class="product-card__content">
            <p class="product-card__title">
              ${product.name}
            </p>
            <p class="product-card__description">
              ${product.description}
            </p>
            <span class="product-card__price">
              ${product.price}
            </span>
          </div>`;

    productsContainer.append(cardProduct);
  });
  if (productsAll.length <= 4) {
    changeRefreshStyle("none");
  }
}

updateCategoryList(selectedCategory);

refresh.addEventListener("click", (event) => {
  isRefresh = true;
  changeRefreshStyle("none");
  updateCategoryList(selectedCategory);
});

mediaQueryRefreshBtn.addEventListener("change", (e) => {
  if (e.matches) {
    if (isRefresh) {
      changeRefreshStyle("none");
    }
    updateCategoryList(selectedCategory);
  } else {
    updateCategoryList(selectedCategory);
  }
});
