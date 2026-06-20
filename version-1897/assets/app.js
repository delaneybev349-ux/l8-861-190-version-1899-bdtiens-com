const menuButton = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
  });
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("image-hidden");
  });
});

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const hero = document.querySelector(".hero");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let current = 0;

  const activateSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    const imagePath = slides[current]?.getAttribute("data-image");
    if (hero && imagePath) {
      hero.style.setProperty("--hero-image", `url('${imagePath}')`);
    }
  };

  previous?.addEventListener("click", () => activateSlide(current - 1));
  next?.addEventListener("click", () => activateSlide(current + 1));
  activateSlide(0);
  window.setInterval(() => activateSlide(current + 1), 5200);
}

const searchInputs = document.querySelectorAll("[data-search-input]");

searchInputs.forEach((input) => {
  const scope = document.querySelector(input.getAttribute("data-search-scope") || "body");
  const cards = scope ? Array.from(scope.querySelectorAll("[data-search-item]")) : [];
  const empty = document.querySelector(input.getAttribute("data-empty-target") || "");
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("q");

  const apply = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matched = !query || text.includes(query);
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });
    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  };

  if (preset) {
    input.value = preset;
  }
  input.addEventListener("input", apply);
  apply();
});

let hlsLoader = null;
const playerMap = new WeakMap();

async function loadHls() {
  if (!hlsLoader) {
    hlsLoader = import("./hls.js");
  }
  const module = await hlsLoader;
  return module.H || module.default;
}

async function attachStream(video, stream) {
  if (!video || !stream) {
    return;
  }

  const oldPlayer = playerMap.get(video);
  if (oldPlayer && typeof oldPlayer.destroy === "function") {
    oldPlayer.destroy();
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = stream;
    return;
  }

  try {
    const Hls = await loadHls();
    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      playerMap.set(video, hls);
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }
  } catch (error) {
    video.dataset.state = "fallback";
  }

  video.src = stream;
}

document.querySelectorAll("[data-play]").forEach((button) => {
  button.addEventListener("click", async () => {
    const shell = button.closest("[data-player]");
    const video = shell?.querySelector("video");
    const stream = button.getAttribute("data-stream");
    if (!shell || !video || !stream) {
      return;
    }
    await attachStream(video, stream);
    shell.classList.add("is-playing");
    video.setAttribute("controls", "controls");
    video.play().catch(() => {});
  });
});

document.querySelectorAll("[data-player] video").forEach((video) => {
  video.addEventListener("playing", () => {
    video.closest("[data-player]")?.classList.add("is-playing");
  });
});
