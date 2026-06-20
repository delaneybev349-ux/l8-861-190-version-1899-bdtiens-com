(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const siteMenu = document.querySelector("[data-site-menu]");

    if (menuButton && siteMenu) {
        menuButton.addEventListener("click", function () {
            siteMenu.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        let active = 0;
        let timer = null;

        const showSlide = function (next) {
            active = (next + slides.length) % slides.length;
            slides.forEach(function (slide, index) {
                slide.classList.toggle("is-active", index === active);
            });
            dots.forEach(function (dot, index) {
                dot.classList.toggle("is-active", index === active);
            });
        };

        const start = function () {
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        };

        const stop = function () {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                stop();
                showSlide(index);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    const filterPanel = document.querySelector("[data-filter-panel]");
    const filterScope = document.querySelector("[data-filter-scope]");

    if (filterPanel && filterScope) {
        const input = filterPanel.querySelector("[data-filter-input]");
        const yearSelect = filterPanel.querySelector("[data-year-filter]");
        const items = Array.from(filterScope.querySelectorAll(".movie-card, .rank-card"));

        const applyFilter = function () {
            const query = input ? input.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";

            items.forEach(function (item) {
                const text = [
                    item.dataset.title,
                    item.dataset.region,
                    item.dataset.genre,
                    item.dataset.tags
                ].join(" ").toLowerCase();
                const yearMatch = !year || item.dataset.year === year;
                const queryMatch = !query || text.indexOf(query) !== -1;
                item.classList.toggle("is-filtered-out", !(yearMatch && queryMatch));
            });
        };

        if (input) {
            input.addEventListener("input", applyFilter);
        }
        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilter);
        }
    }

    const searchResults = document.getElementById("searchResults");
    const pageSearchInput = document.getElementById("pageSearchInput");

    if (searchResults && pageSearchInput && Array.isArray(window.HF_SEARCH_INDEX)) {
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get("q") || "";
        pageSearchInput.value = initialQuery;

        const render = function (query) {
            const normalized = query.trim().toLowerCase();
            searchResults.innerHTML = "";

            if (!normalized) {
                const empty = document.createElement("div");
                empty.className = "empty-result";
                empty.textContent = "输入关键词后即可搜索影片。";
                searchResults.appendChild(empty);
                return;
            }

            const result = window.HF_SEARCH_INDEX.filter(function (item) {
                return [
                    item.title,
                    item.region,
                    item.year,
                    item.type,
                    item.genre,
                    item.category,
                    item.tags
                ].join(" ").toLowerCase().indexOf(normalized) !== -1;
            }).slice(0, 80);

            if (!result.length) {
                const empty = document.createElement("div");
                empty.className = "empty-result";
                empty.textContent = "未找到匹配影片，请尝试其他关键词。";
                searchResults.appendChild(empty);
                return;
            }

            result.forEach(function (item) {
                const article = document.createElement("article");
                article.className = "movie-card movie-card-compact";
                article.innerHTML = [
                    "<a class=\"card-cover\" href=\"" + item.link + "\" aria-label=\"观看" + escapeHtml(item.title) + "\">",
                    "<img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">",
                    "<span class=\"card-year\">" + escapeHtml(item.year) + "</span>",
                    "<span class=\"card-play\">▶</span>",
                    "</a>",
                    "<div class=\"card-body\">",
                    "<a class=\"card-category\" href=\"" + item.categoryLink + "\">" + escapeHtml(item.category) + "</a>",
                    "<h2><a href=\"" + item.link + "\">" + escapeHtml(item.title) + "</a></h2>",
                    "<p>" + escapeHtml(item.oneLine) + "</p>",
                    "<div class=\"card-meta\"><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.type) + "</span></div>",
                    "</div>"
                ].join("");
                searchResults.appendChild(article);
            });
        };

        const escapeHtml = function (value) {
            return String(value || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };

        const largeForm = document.querySelector("[data-search-large]");

        if (largeForm) {
            largeForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const query = pageSearchInput.value.trim();
                const url = new URL(window.location.href);
                if (query) {
                    url.searchParams.set("q", query);
                } else {
                    url.searchParams.delete("q");
                }
                window.history.replaceState(null, "", url.toString());
                render(query);
            });
        }

        render(initialQuery);
    }
})();
