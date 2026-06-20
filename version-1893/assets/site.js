(function () {
    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('is-open');
            });
        }

        var filterPanel = document.querySelector('[data-filter-panel]');
        var grid = document.querySelector('[data-filter-grid]');

        if (filterPanel && grid) {
            var input = filterPanel.querySelector('[data-filter-input]');
            var region = filterPanel.querySelector('[data-filter-region]');
            var type = filterPanel.querySelector('[data-filter-type]');
            var year = filterPanel.querySelector('[data-filter-year]');
            var emptyState = document.querySelector('[data-empty-state]');
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');

            if (query && input) {
                input.value = query;
            }

            function applyFilter() {
                var keyword = normalize(input && input.value);
                var regionValue = normalize(region && region.value);
                var typeValue = normalize(type && type.value);
                var yearValue = normalize(year && year.value);
                var visibleCount = 0;

                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-search'));
                    var cardRegion = normalize(card.getAttribute('data-region'));
                    var cardType = normalize(card.getAttribute('data-type'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var matched = true;

                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }

                    if (regionValue && cardRegion !== regionValue) {
                        matched = false;
                    }

                    if (typeValue && cardType !== typeValue) {
                        matched = false;
                    }

                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }

                    card.hidden = !matched;

                    if (matched) {
                        visibleCount += 1;
                    }
                });

                if (emptyState) {
                    emptyState.classList.toggle('is-visible', visibleCount === 0);
                }
            }

            [input, region, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', applyFilter);
                    control.addEventListener('change', applyFilter);
                }
            });

            applyFilter();
        }
    });
})();
