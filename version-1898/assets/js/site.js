(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;

      function showSlide(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, position) {
          slide.classList.toggle("is-active", position === index);
        });
        dots.forEach(function (dot, position) {
          dot.classList.toggle("is-active", position === index);
        });
      }

      dots.forEach(function (dot, position) {
        dot.addEventListener("click", function () {
          showSlide(position);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(index + 1);
        }, 5600);
      }
    }

    var pageSearch = document.querySelector("[data-page-search]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function applyFilters() {
      var query = pageSearch ? pageSearch.value.trim().toLowerCase() : "";
      var selectedType = typeFilter ? typeFilter.value : "";
      var selectedYear = yearFilter ? yearFilter.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = (card.getAttribute("data-search") || "").toLowerCase();
        var cardType = card.getAttribute("data-type") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var matchesQuery = !query || searchText.indexOf(query) !== -1;
        var matchesType = !selectedType || cardType === selectedType;
        var matchesYear = !selectedYear || cardYear === selectedYear;
        var show = matchesQuery && matchesType && matchesYear;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (pageSearch || typeFilter || yearFilter) {
      [pageSearch, typeFilter, yearFilter].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });
      applyFilters();
    }
  });
}());
