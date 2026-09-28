const nextBtn = document.getElementById("arrow-next");
const prevBtn = document.getElementById("arrow-prev");
const paginationBullets = document.querySelectorAll(".pagination__bullet");
const bullets = [...paginationBullets];

const mediaQuerySlide = window.matchMedia("(max-width: 700px)");
const track = document.getElementById("sliderTrack");
const slide = track.querySelector(".coffee-slider__slide");
const initialSlides = document.getElementsByClassName("coffee-slider__slide");

let currentSlideNumber = 0;
let isTransitioning = false;
let currentDirection = "";

function handlePrev() {
  currentSlideNumber -= 1;
  if (currentSlideNumber < 0) {
    currentSlideNumber = bullets.length - 1;
  }
  changeDirection("prev");
}

function handlNext() {
  currentSlideNumber += 1;
  if (currentSlideNumber > bullets.length - 1) {
    currentSlideNumber = 0;
  }
  changeDirection("next");
}

nextBtn.addEventListener("click", handlNext);
prevBtn.addEventListener("click", handlePrev);

function changeBullet(type, currentSlideNumber) {
  const currentBullet = bullets[currentSlideNumber];

  let prevBullet = currentBullet.nextElementSibling || bullets[0];
  if (type === "next") {
    prevBullet =
      currentBullet.previousElementSibling || bullets[bullets.length - 1];
  }

  currentBullet.classList.toggle("active");
  prevBullet.classList.toggle("active");
}

function changeDirection(type) {
  currentDirection = type;
  if (isTransitioning) return;
  isTransitioning = true;

  updateSliderPosition(true);
  changeBullet(type, currentSlideNumber);
}

function updateSliderPosition(animate = true) {
  if (!animate) {
    track.style.transition = "none";
  } else {
    track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
  }
  setTransformOffset(currentSlideNumber);
}

function setTransformOffset(indexInDOM) {
  if (!slide) return;
  const x = indexInDOM > initialSlides.length - 1 ? 1 : 2;
  const slideWidth = slide.getBoundingClientRect().width;

  const offset = currentDirection === "next" ? -slideWidth * x : 0;
  track.style.transform = `translateX(${offset}px)`;
}

function changeTrackPosition() {
  const slideWidth = slide.getBoundingClientRect().width;
  track.style.transition = "transform 0s";
  track.style.transform = `translateX(${-slideWidth}px)`;
}

track.addEventListener("transitionend", () => {
  isTransitioning = false;
  changeTrackPosition();

  const allSlidesData = [...initialSlides];

  const [prev] = allSlidesData.slice(0, 1);
  const newData = allSlidesData.slice(1);

  const [last] = [...initialSlides].slice(-1);
  const restArray = [...initialSlides].slice(0, -1);

  const arraySlides =
    currentDirection === "next" ? [...newData, prev] : [last, ...restArray];

  track.innerHTML = "";
  arraySlides.forEach((item) => {
    track.append(item);
  });
});

function renderSlider(currentSlideNumber = 0) {
  currentDirection = "next";
  const [last] = [...initialSlides].slice(-1);
  const restArray = [...initialSlides].slice(0, -1);
  const allSlidesData = [last, ...restArray];
  track.innerHTML = "";
  allSlidesData.forEach((data) => {
    track.appendChild(data);
  });

  track.style.transition = "none";
  setTransformOffset(currentSlideNumber || initialSlides.length);
}

renderSlider();

mediaQuerySlide.addEventListener("change", (e) => {
  changeTrackPosition();
});

function initSwipe() {
  let touchStartX = 0;
  let touchEndX = 0;

  const minSwipeDistance = 50;

  function checkDirection() {
    const distance = touchEndX - touchStartX;

    if (window.innerWidth > 570) return;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        handlePrev();
      } else {
        handlNext();
      }
    }
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      if (window.innerWidth <= 570) {
        touchStartX = e.changedTouches[0].screenX;
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (window.innerWidth <= 570) {
        touchEndX = e.changedTouches[0].screenX;
        checkDirection();
      }
    },
    { passive: true },
  );
}

initSwipe();
