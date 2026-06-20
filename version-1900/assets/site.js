(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var navLinks = document.querySelector('[data-nav-links]');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
        var searchInput = panel.querySelector('[data-search-input]');
        var typeFilter = panel.querySelector('[data-type-filter]');
        var genreFilter = panel.querySelector('[data-genre-filter]');
        var scope = panel.closest('main') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var empty = scope.querySelector('[data-empty-state]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var searchText = normalize(searchInput ? searchInput.value : '');
            var typeText = normalize(typeFilter ? typeFilter.value : '');
            var genreText = normalize(genreFilter ? genreFilter.value : '');
            var visibleCount = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var typeValue = normalize(card.getAttribute('data-type'));
                var genreValue = normalize(card.getAttribute('data-genre'));
                var matchSearch = !searchText || haystack.indexOf(searchText) !== -1;
                var matchType = !typeText || typeValue.indexOf(typeText) !== -1;
                var matchGenre = !genreText || genreValue.indexOf(genreText) !== -1;
                var visible = matchSearch && matchType && matchGenre;

                card.style.display = visible ? '' : 'none';
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.style.display = visibleCount ? 'none' : 'block';
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', applyFilter);
        }
        if (genreFilter) {
            genreFilter.addEventListener('change', applyFilter);
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && searchInput) {
            searchInput.value = query;
            applyFilter();
        }
    });

    var globalSearchForms = Array.prototype.slice.call(document.querySelectorAll('[data-global-search]'));
    globalSearchForms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input');
            var query = input ? input.value.trim() : '';
            var target = form.getAttribute('action') || './search.html';
            window.location.href = target + (query ? '?q=' + encodeURIComponent(query) : '');
        });
    });
}());
