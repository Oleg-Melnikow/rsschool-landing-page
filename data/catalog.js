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

    openModal(product, cardProduct, index);
  });
  if (productsAll.length <= 4) {
    changeRefreshStyle("none");
  }
}

updateCategoryList(selectedCategory);

refresh.addEventListener("click", () => {
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

// Create modal block
const productModal = document.getElementById("product-modal");

function openModal(product, cardProduct, index) {
  cardProduct.addEventListener("click", () => {
    document.body.style.overflow = "hidden";
    productModal.style.display = "flex";

    const popup = document.querySelector(".popup");

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn__close-modal");
    closeButton.textContent = "Close";

    popup.innerHTML = `
              <div class="modal-image">
                <img src="./assets/${product.category}-${index + 1}.jpg" alt="${product.name}">
              </div>
              <div class="product-data">
                <div class="product-info">
                  <p class="product-name">${product.name}</p>
                  <p class="product-description ">${product.description}</p>
                </div>
                ${createTabsModal(product.sizes, "size")}
                ${createTabsModal(product.additives, "additives")}
                <div class="product-price">
                  <p>Total:</p>
                  <p id="price-order" data-order="${product.price}">$${product.price}</p>
                </div>
                <div class="product-alert">
                  <div class="alert-icon"></div>
                  <div class="alert-title">
                    The cost is not final. Download our mobile app to see the final price and place your order. 
                    Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
                  </div>
                </div>
              </div>
    `;

    const containerData = popup.querySelector(".product-data");
    containerData.append(closeButton);

    closeButton.addEventListener("click", () => {
      onCloseModal();
    });

    const tabs = popup.querySelectorAll(".tabs-items");

    tabs.forEach((tabItem) => {
      changeProductSize(tabItem);
    });
  });
}

function changeProductSize(tabItem) {
  tabItem.addEventListener("click", (event) => {
    const priceOrder = document.getElementById("price-order");
    let priceCurrrent = +priceOrder.dataset.order;

    const currentTab = event.target.closest("[data-tabs]");
    const changeBtnSize = event.target.closest(".tabs__size");
    const changeAdditives = event.target.closest(".tabs__additives");

    if (!currentTab) return;

    if (changeBtnSize) {
      const currentActive = tabItem.querySelector(".tabs__size.active");

      if (currentActive) {
        currentActive.classList.remove("active");
        priceCurrrent -= +currentActive.dataset.price;
      }
      changeBtnSize.classList.add("active");

      changeBtnSize.dataset.price;
      priceCurrrent += +changeBtnSize.dataset.price;
    }

    if (changeAdditives) {
      changeAdditives.classList.toggle("active");
      const isActive = changeAdditives.classList.contains("active");

      if (isActive) {
        priceCurrrent += +changeAdditives.dataset.price;
      } else {
        priceCurrrent -= +changeAdditives.dataset.price;
      }
    }

    priceOrder.innerHTML = `$${priceCurrrent.toFixed(2)}`;
    priceOrder.dataset.order = priceCurrrent;
  });
}

function createTabsModal(tabsData, type) {
  const tabsArray = Object.entries(tabsData);
  let listTabs = "";

  tabsArray.forEach((item, index) => {
    const [name, data] = item;
    const correctName = type === "size" ? name : +name + 1;
    const isActive = type === "size" && !index ? " active" : "";

    listTabs += `
        <button class="tabs__${type}${isActive}" data-tabs="${type}" data-price="${data["add-price"]}">
          <span class="tabs__icon">
            ${correctName}
          </span>
          ${data?.size || data?.name}
        </button>`;
  });

  const containerTabs = `
                <div class="product-tabs">
                  <p class="tabs-tite">${type}</p>
                  <div class="tabs-items" id="tabs-${type}">
                    ${listTabs}
                  </div>
                </div>`;
  return containerTabs;
}

productModal?.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
});

function onCloseModal() {
  document.body.style.overflow = "";
  productModal.style.display = "none";
}

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    onCloseModal();
  }
});
