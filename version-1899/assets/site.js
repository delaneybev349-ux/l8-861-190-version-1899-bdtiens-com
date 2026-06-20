(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            menu.classList.toggle("is-open", !expanded);
        });
    }

    function setupHeroSlider() {
        var root = document.querySelector("[data-hero-slider]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var images = Array.prototype.slice.call(root.querySelectorAll("[data-hero-image]"));
        var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-hero-tab]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function setActive(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            images.forEach(function (image, imageIndex) {
                image.classList.toggle("is-active", imageIndex === current);
            });
            tabs.forEach(function (tab, tabIndex) {
                tab.classList.toggle("is-active", tabIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                setActive(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                var index = Number(tab.getAttribute("data-hero-tab") || "0");
                setActive(index);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        var grid = document.querySelector("[data-filter-grid]");
        if (!panel || !grid) {
            return;
        }
        var keyword = panel.querySelector("[data-filter-keyword]");
        var region = panel.querySelector("[data-filter-region]");
        var type = panel.querySelector("[data-filter-type]");
        var year = panel.querySelector("[data-filter-year]");
        var category = panel.querySelector("[data-filter-category]");
        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            var keywordValue = normalize(keyword && keyword.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);
            var categoryValue = normalize(category && category.value);

            cards.forEach(function (card) {
                var textValue = normalize(card.getAttribute("data-text") + " " + card.getAttribute("data-title"));
                var matchKeyword = !keywordValue || textValue.indexOf(keywordValue) !== -1;
                var matchRegion = !regionValue || normalize(card.getAttribute("data-region")) === regionValue;
                var matchType = !typeValue || normalize(card.getAttribute("data-type")) === typeValue;
                var matchYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
                var matchCategory = !categoryValue || normalize(card.getAttribute("data-category")) === categoryValue;
                card.hidden = !(matchKeyword && matchRegion && matchType && matchYear && matchCategory);
            });
        }

        [keyword, region, type, year, category].forEach(function (item) {
            if (!item) {
                return;
            }
            item.addEventListener("input", apply);
            item.addEventListener("change", apply);
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        if (!players.length) {
            return;
        }
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-play-button]");
            var stream = player.getAttribute("data-stream");
            var initialized = false;
            var hlsInstance = null;

            function initialize() {
                if (initialized || !video || !stream) {
                    return;
                }
                initialized = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                    player._hls = hlsInstance;
                    return;
                }
                video.src = stream;
            }

            function play() {
                initialize();
                player.classList.add("is-playing");
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {
                        player.classList.remove("is-playing");
                    });
                }
            }

            if (button) {
                button.addEventListener("click", play);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        play();
                    }
                });
                video.addEventListener("play", function () {
                    player.classList.add("is-playing");
                });
                video.addEventListener("pause", function () {
                    if (!video.ended) {
                        player.classList.remove("is-playing");
                    }
                });
                video.addEventListener("ended", function () {
                    player.classList.remove("is-playing");
                });
            }
        });
    }

    ready(function () {
        setupNavigation();
        setupHeroSlider();
        setupFilters();
        setupPlayers();
    });
})();
