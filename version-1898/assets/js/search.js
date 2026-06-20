(function () {
  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHTML(tag) + "</span>";
    }).join("");

    return [
      "<article class=\"movie-card\">",
      "<a class=\"movie-poster\" href=\"" + escapeHTML(movie.link) + "\">",
      "<img src=\"" + escapeHTML(movie.cover) + "\" alt=\"" + escapeHTML(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"movie-play-dot\">播放</span>",
      "</a>",
      "<div class=\"movie-card-body\">",
      "<div class=\"movie-meta-line\"><span>" + escapeHTML(movie.year) + "</span><span>" + escapeHTML(movie.region) + "</span><span>" + escapeHTML(movie.type) + "</span></div>",
      "<h2><a href=\"" + escapeHTML(movie.link) + "\">" + escapeHTML(movie.title) + "</a></h2>",
      "<p>" + escapeHTML(movie.oneLine) + "</p>",
      "<div class=\"movie-tags\">" + tags + "</div>",
      "<a class=\"movie-category-link\" href=\"" + escapeHTML(movie.link) + "\">立即观看</a>",
      "</div>",
      "</article>"
    ].join("");
  }

  function runSearch() {
    var input = document.querySelector("[data-site-search]");
    var results = document.querySelector("[data-search-results]");
    var empty = document.querySelector("[data-search-empty]");
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";

    if (!input || !results) {
      return;
    }

    input.value = initial;

    function render() {
      var query = input.value.trim().toLowerCase();
      var source = window.MOVIE_INDEX || [];
      var matches = source.filter(function (movie) {
        if (!query) {
          return true;
        }
        var text = [
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          (movie.tags || []).join(" "),
          movie.oneLine
        ].join(" ").toLowerCase();
        return text.indexOf(query) !== -1;
      }).slice(0, 80);

      results.innerHTML = matches.map(card).join("");

      if (empty) {
        empty.classList.toggle("is-visible", matches.length === 0);
      }
    }

    input.addEventListener("input", render);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSearch);
  } else {
    runSearch();
  }
}());
