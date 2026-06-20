(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function openSearch(query) {
    var url = "./search.html";
    if (query) {
      url += "?q=" + encodeURIComponent(query);
    }
    window.location.href = url;
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initNavSearch() {
    var forms = document.querySelectorAll("[data-nav-search]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        openSearch(input ? input.value.trim() : "");
      });
    });
  }

  function initFilters() {
    var input = document.querySelector("[data-filter-input]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var categorySelect = document.querySelector("[data-filter-category]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    if (!input || cards.length === 0) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    if (initialQuery) {
      input.value = initialQuery;
    }

    function applyFilters() {
      var query = normalize(input.value);
      var typeValue = normalize(typeSelect ? typeSelect.value : "");
      var yearValue = normalize(yearSelect ? yearSelect.value : "");
      var categoryValue = normalize(categorySelect ? categorySelect.value : "");
      cards.forEach(function (card) {
        var searchText = normalize(card.getAttribute("data-search"));
        var cardType = normalize(card.getAttribute("data-type"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardCategory = normalize(card.getAttribute("data-category"));
        var matchesQuery = !query || searchText.indexOf(query) !== -1;
        var matchesType = !typeValue || cardType.indexOf(typeValue) !== -1;
        var matchesYear = !yearValue || cardYear === yearValue;
        var matchesCategory = !categoryValue || cardCategory === categoryValue;
        card.hidden = !(matchesQuery && matchesType && matchesYear && matchesCategory);
      });
    }

    [input, typeSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });
    applyFilters();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initNavSearch();
    initFilters();
  });
}());
