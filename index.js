const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

const mediaQuery = window.matchMedia("(max-width: 768px)");
const burgerButton = document.getElementById("burger-button");
const menu = document.getElementById("burger-menu");

const menuBlock = document.getElementById("menu-block");
const linksMenu = menuBlock.querySelectorAll("a");
const links = [...linksMenu];

if (currentTheme === "dark") {
  document.body.classList.add("dark-theme");
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  let theme = "light";

  if (document.body.classList.contains("dark-theme")) {
    theme = "dark";
  }

  localStorage.setItem("theme", theme);
});

function showMenu() {
  menuBlock.classList.toggle("show");
  menu.classList.toggle("activate");
  burgerButton.classList.toggle("active");
}

function onCloseMenu() {
  document.body.style.overflow = "";
  showMenu();
}

links.forEach((el) => {
  el.addEventListener("click", () => {
    onCloseMenu();
  });
});

burgerButton.addEventListener("click", () => {
  if (!menuBlock.classList.contains("show")) {
    document.body.style.overflow = "hidden";
    showMenu();
  } else {
    onCloseMenu();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    onCloseMenu();
  }
});

mediaQuery.addEventListener("change", (e) => {
  const isShowMenu = menuBlock.classList.contains("show");
  if (!e.matches && isShowMenu) {
    onCloseMenu();
  }
});
